import { getRepository } from "typeorm";

import Instrument from "../entities/Instrument";

// Describe
// Adds instruments to table from an array of names,
// filters duplicates, returns saved count
export const addInstruments = async (instrumentNames: string[]) => {
  const repo = getRepository(Instrument);
  let newInstruments: Partial<Instrument>[] = [];

  await Promise.all(
    instrumentNames.map(async (instrumentName) => {
      const found = await repo.findOne({ name: instrumentName });
      if (!found) {
        newInstruments.push({
          name: instrumentName,
        });
      }
    })
  );

  const res = await repo.save(newInstruments);
  return res.length;
};
