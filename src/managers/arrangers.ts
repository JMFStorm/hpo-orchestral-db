import { getRepository } from "typeorm";

import Arranger from "../entities/Arranger";

// Describe
// Adds arrangers to table,
// returns saved count
export const addArrangers = async (arrangerNames: string[]) => {
  const repo = getRepository(Arranger);

  let newArrangers: Partial<Arranger>[] = [];
  await Promise.all(
    arrangerNames.map(async (arrangers) => {
      const found = await repo.findOne({ names: arrangers });
      if (!found) {
        newArrangers.push({
          names: arrangers,
        });
      }
    })
  );

  const res = await repo.save(newArrangers);
  return res.length;
};
