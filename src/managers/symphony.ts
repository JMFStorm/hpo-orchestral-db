import { getRepository } from "typeorm";

import Composer from "../entities/Composer";
import SymphonyObject from "../interfaces/SymphonyObject";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Symphony from "../entities/Symphony";
import Performance from "../entities/Performance";

// Describe
// Get all symphonies
export const getAllSymphonies = async () => {
  const repo = getRepository(Symphony);
  const result = await repo.find({ relations: ["composers"] });
  return result;
};

// Describe
// Adds symphonies with related composers
// return added count
export const addSymphoniesAndRelatedComposers = async (symphonies: SymphonyObject[]) => {
  let addedCount = 0;
  const symphoniesCount = symphonies.length;
  const numeralPart = Math.floor(symphoniesCount / 20);

  const SymphonyRepo = getRepository(Symphony);
  const composerRepo = getRepository(Composer);

  for (const symphony of symphonies) {
    if (addedCount % numeralPart == 0) {
      console.log(`Saving symphony: (${addedCount}/${symphoniesCount})`);
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

    const newSymphony: Partial<Symphony> = {
      name: symphony.name,
      symphony_id: symphony.symphony_id,
      composers: composerObjects,
    };
    try {
      await SymphonyRepo.save(newSymphony);
    } catch (err) {
      console.log("Error with", newSymphony);
      console.error(err);
      process.exit();
    }
    addedCount++;
  }

  return addedCount;
};

// Describe
// Get symphony by composerId
export const getSymphoniesByComposerId = async (composerId: string) => {
  const repo = getRepository(Composer);

  const response = await repo.find({
    where: { id: composerId },
    relations: ["symphonies"],
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
        relations: ["concert", "symphony"],
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
