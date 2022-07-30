import { getRepository } from "typeorm";

import Orchestra from "../entities/Orchestra";

// Describe
// Adds orchestries to table,
// returns saved count
export const addOrchestries = async (orchestraNames: string[]) => {
  const repo = getRepository(Orchestra);
  let newOrchestries: Partial<Orchestra>[] = [];

  await Promise.all(
    orchestraNames.map(async (orchestraName) => {
      const found = await repo.findOne({ name: orchestraName });
      if (!found) {
        newOrchestries.push({
          name: orchestraName,
        });
      }
    })
  );

  const res = await repo.save(newOrchestries);
  return res.length;
};
