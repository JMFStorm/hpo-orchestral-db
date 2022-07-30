import { getRepository } from "typeorm";

import Composer from "../entities/Composer";
import SymphonyObject from "../interfaces/SymphonyObject";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Symphony from "../entities/Symphony";
import Performance from "../entities/Performance";
import Arranger from "../entities/Arranger";

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

  const SymphonyRepo = getRepository(Symphony);
  const composerRepo = getRepository(Composer);
  const arrangerRepo = getRepository(Arranger);

  let newSymphonies: SymphonyObject[] = [];
  await Promise.all(
    symphonies.map(async (symph) => {
      const found = await SymphonyRepo.findOne({ symphony_id: symph.symphony_id });
      if (!found) {
        newSymphonies.push(symph);
      }
    })
  );

  await Promise.all(
    newSymphonies.map(async (symphony) => {
      let composerObjects: Composer[] = [];
      let arrangersObject: Arranger | undefined = undefined;

      const handleComposers = async (composerNames: string[]) => {
        for (const composerName of composerNames) {
          const composer = (await composerRepo.findOne({ name: composerName })) as Composer;
          if (composer && !composerObjects.some((comp) => comp.name === composer.name)) {
            composerObjects.push(composer);
          }
        }
      };

      await Promise.all([
        await handleComposers(symphony.composerNames),
        await arrangerRepo.findOne({ names: symphony.arrangers }).then((res) => (arrangersObject = res)),
      ]);

      const newSymphony: Partial<Symphony> = {
        name: symphony.name,
        symphony_id: symphony.symphony_id,
        composers: composerObjects,
        arrangers: arrangersObject,
      };
      try {
        await SymphonyRepo.save(newSymphony);
      } catch (err) {
        console.log("Error with", newSymphony);
        console.error(err);
        process.exit();
      }
      addedCount++;
    })
  );
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
