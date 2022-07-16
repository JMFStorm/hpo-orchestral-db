import Composer from "../entities/Composer";
import SymphonyObject from "../interfaces/SymphonyObject";
import { sortStringsFunction } from "../utils/functions";
import Symphony from "../entities/Symphony";

import { getRepository } from "typeorm";

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

  const SymphonyRepo = getRepository(Symphony);
  const composerRepo = getRepository(Composer);

  for (const symphony of symphonies) {
    if (addedCount % 500 == 0) {
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
  const result = response?.length > 0 ? response[0].symphonies : undefined;

  return result ? result.sort((a, b) => sortStringsFunction(a.name, b.name)) : [];
};

// Describe
// Get symphony by csv symphony_id
export const getSymphonyByCsvId = async (symphonyCsvId: string) => {
  const repo = getRepository(Symphony);
  const result = repo.findOne({ symphony_id: symphonyCsvId });
  return result;
};
