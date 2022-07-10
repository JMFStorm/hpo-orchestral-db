import Compositor from "../entities/Compositor";
import SymphonyObject from "src/interfaces/SymphonyObject";

import { getRepository } from "typeorm";

import Symphony from "../entities/Symphony";

// Describe
// Get all symphonies
export const getAllSymphonies = async () => {
  const repo = getRepository(Symphony);
  const result = await repo.find({ relations: ["compositors"] });
  return result;
};

// Describe
// Adds symphonies with related compositors
// return added count
export const addSymphoniesAndRelatedCompositors = async (symphonies: SymphonyObject[]) => {
  let addedCount = 0;

  console.log("symphonies", symphonies);

  const SymphonyRepo = getRepository(Symphony);
  const compositorRepo = getRepository(Compositor);

  for (const symphony of symphonies) {
    let compositorObjects: Compositor[] = [];

    for (const compositorName of symphony.compositorNames) {
      let existingComp = await compositorRepo.findOne({ name: compositorName });

      if (!existingComp) {
        const newComp: Partial<Compositor> = { name: compositorName };
        existingComp = await compositorRepo.save(newComp);
      }
      compositorObjects.push(existingComp);
    }
    const newSymphony: Partial<Symphony> = {
      name: symphony.name,
      symphony_id: symphony.symphony_id,
      compositors: compositorObjects,
    };

    await SymphonyRepo.save(newSymphony);
    addedCount++;
  }

  return addedCount;
};

// Describe
// Get symphony by composerId
export const getSymphoniesByComposerId = async (composerId: string) => {
  const repo = getRepository(Compositor);
  const response = await repo.find({
    where: { id: composerId },
    relations: ["symphonies"],
    take: 1,
  });
  const result = response?.length > 0 ? response[0].symphonies : undefined;
  return result;
};

// Describe
// Get symphony by csv symphony_id
export const getSymphonyByCsvId = async (symphonyCsvId: string) => {
  const repo = getRepository(Symphony);
  const result = repo.findOne({ symphony_id: symphonyCsvId });
  return result;
};

// Describe
// Deletes all symphonies from table,
// returns deleted count
export const deleteAllSymphonyIds = async () => {
  const repo = getRepository(Symphony);

  const result = await repo.delete({});
  return result.affected;
};
