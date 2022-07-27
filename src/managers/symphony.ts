import { getRepository } from "typeorm";

import Composer from "../entities/Composer";
import SymphonyObject from "../interfaces/SymphonyObject";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Symphony from "../entities/Symphony";
import Performance from "../entities/Performance";
import Arranger from "../entities/Arranger";
import { seedLog } from "../socket";

// Describe
// Get all symphonies
export const getAllSymphonies = async () => {
  const repo = getRepository(Symphony);
  const result = await repo.find({ relations: ["composers", "arrangers"] });
  return result;
};

// Describe
// Adds symphonies with related composers
// return added count
export const addSymphonies = async (symphonies: SymphonyObject[]) => {
  let addedCount = 0;
  const symphoniesCount = symphonies.length;
  const numeralPart = Math.floor(symphoniesCount / 20);

  const SymphonyRepo = getRepository(Symphony);
  const composerRepo = getRepository(Composer);
  const arrangerRepo = getRepository(Arranger);

  for (const symphony of symphonies) {
    if (addedCount % numeralPart == 0) {
      seedLog(`Saving symphonies: (${addedCount}/${symphoniesCount})`, "symphonies");
    }
    let composerObjects: Composer[] = [];
    for (const composerName of symphony.composerNames) {
      let existingComp = await composerRepo.findOne({ name: composerName });
      if (!existingComp) {
        const newComp: Partial<Composer> = { name: composerName };
        existingComp = await composerRepo.save(newComp);
      }
      if (!composerObjects.some((x) => x.name === composerName)) {
        composerObjects.push(existingComp);
      }
    }
    const arrangersObject = await arrangerRepo.findOne({ names: symphony.arrangers });
    const newSymphony: Partial<Symphony> = {
      name: symphony.name,
      symphony_id: symphony.symphony_id,
      composers: composerObjects,
      arrangers: arrangersObject,
    };
    try {
      const found = await SymphonyRepo.findOne({ id: newSymphony.id });
      if (!found) {
        await SymphonyRepo.save(newSymphony);
      }
    } catch (err) {
      console.log("Error with", newSymphony);
      console.error(err);
      process.exit();
    }
    addedCount++;
  }
  seedLog(`Saved symphonies: (${addedCount}/${symphoniesCount})`, "symphonies");
  return addedCount;
};

// Describe
// Get symphony by composerId
export const getSymphoniesByComposerId = async (composerId: string) => {
  const repo = getRepository(Composer);
  const response = await repo.find({
    where: { id: composerId },
    relations: ["symphonies", "symphonies.arrangers"],
    take: 1,
  });
  const symphonies: Symphony[] = response?.length > 0 ? response[0].symphonies : [];
  if (!symphonies) {
    return [];
  }
  const performanceRepo = getRepository(Performance);
  const results = await Promise.all(
    symphonies.map(async (symphony) => {
      const res = await performanceRepo.find({
        where: { symphony: { id: symphony.id } },
        relations: ["concert", "symphony", "symphony.arrangers"],
      });
      const concerts = res.map((x) => x.concert);
      const count = filterUniquesById(concerts).length;
      return { ...symphony, concertsCount: count };
    })
  );
  return results.sort((a, b) => sortStringsFunction(a.name, b.name));
};

// Describe
// Get symphony by csv symphony_id
export const getSymphonyByCsvId = async (symphonyCsvId: string) => {
  const repo = getRepository(Symphony);
  const result = repo.findOne({ symphony_id: symphonyCsvId });
  return result;
};
