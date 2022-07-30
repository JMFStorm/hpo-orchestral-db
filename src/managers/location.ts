import { getRepository } from "typeorm";

import Location from "../entities/Location";

// Describe
// Adds locations to table,
// returns saved count
export const addLocations = async (locationNames: string[]) => {
  const repo = getRepository(Location);
  let newLocations: Partial<Location>[] = [];

  await Promise.all(
    locationNames.map(async (locationName) => {
      const found = await repo.findOne({ name: locationName });
      if (!found) {
        newLocations.push({
          name: locationName,
        });
      }
    })
  );

  const res = await repo.save(newLocations);
  return res.length;
};
