import { getRepository } from "typeorm";

import Instrument from "../entities/Instrument";

// Describe
// Adds instruments to table from an array of names,
// filters duplicates, returns saved count
export const addInstruments = async (instrumentNames: string[]) => {
  const repo = getRepository(Instrument);

  let objects: Partial<Instrument>[] = [];

  // Filter duplicates and invalid
  instrumentNames.forEach((name) => {
    if (name.trim() === "") {
      return;
    }

    if (!objects.some((obj) => obj.name === name)) {
      objects.push({
        name,
      });
    }
  });

  let newObjects: Partial<Instrument>[] = [];

  const existingInstruments = await repo.find({});

  // Filter already existing
  objects.forEach((obj) => {
    if (!existingInstruments.some((instr) => instr.name === obj.name)) {
      newObjects.push({
        name: obj.name,
      });
    }
  });

  const result = await repo.save(newObjects);
  return result.length;
};

// Describe
// Deletes all instruments from table,
// returns deleted count
export const deleteAllInstruments = async () => {
  const repo = getRepository(Instrument);

  const result = await repo.delete({});
  return result.affected;
};
