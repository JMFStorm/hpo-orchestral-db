import { getRepository } from "typeorm";

import Location from "../entities/Location";

// Describe
// Adds locations to table,
// returns saved count
export const addLocations = async (locationNames: string[]) => {
  const repo = getRepository(Location);

  const objects = locationNames.map((x) => {
    return {
      name: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};
