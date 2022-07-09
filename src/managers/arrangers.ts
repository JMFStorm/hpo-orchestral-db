import { getRepository } from "typeorm";

import Arrangers from "../entities/Arranger";

// Describe
// Adds arrangers to table,
// returns saved count
export const addArrangers = async (arrangerNames: string[]) => {
  const repo = getRepository(Arrangers);

  const objects = arrangerNames.map((x) => {
    return {
      names: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all arrangers from table,
// returns deleted count
export const deleteAllArrangers = async () => {
  const repo = getRepository(Arrangers);

  const result = await repo.delete({});
  return result.affected;
};
