import { getRepository } from "typeorm";

import Orchestra from "../entities/Orchestra";

// Describe
// Adds orchestries to table,
// returns saved count
export const addOrchestries = async (orchestraNames: string[]) => {
  const repo = getRepository(Orchestra);

  const objects = orchestraNames.map((x) => {
    return {
      name: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all orchestries from table,
// returns deleted count
export const deleteAllOrchestries = async () => {
  const repo = getRepository(Orchestra);

  const result = await repo.delete({});
  return result.affected;
};
