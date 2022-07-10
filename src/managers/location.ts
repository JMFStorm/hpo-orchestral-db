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

// Describe
// Deletes all locations from table,
// returns deleted count
export const deleteAllLocations = async () => {
  const repo = getRepository(Location);

  const result = await repo.delete({});
  return result.affected;
};