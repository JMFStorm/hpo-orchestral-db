import SymphonyObject from "src/interfaces/SymphonyObject";

import { getRepository } from "typeorm";

import Symphony from "../entities/Symphony";
import SymphonyPerformance from "../entities/SymphonyPerformance";

// Describe
// Adds symphonies to table,
// returns saved count
export const addSymphonies = async (symphonies: Partial<SymphonyObject>[]) => {
  let addedCount = 0;

  for (const symph of symphonies) {
    const repo = getRepository(Symphony);

    const idObject = { symphony_id: symph.symphony_id, name: symph.name };
    const idExists = await repo.findOne(idObject);

    if (!idExists) {
      await repo.save(idObject);
      addedCount++;
    }
  }

  return addedCount;
};

// Describe
// Search symphonies by compositor id
export const getSymphoniesByCompositorId = async (compositorId: string) => {
  const repo = getRepository(SymphonyPerformance);

  const response = await repo.find({
    relations: ["symphony", "compositors"],
  });

  const relatedPerformances = response.filter((x) =>
    x.compositors.map((x) => x.id).includes(compositorId)
  );

  const result = relatedPerformances.map((x) => x.symphony);
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
