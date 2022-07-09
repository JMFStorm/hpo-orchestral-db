import { getRepository } from "typeorm";

import Arrangers from "../entities/Arranger";
import Musician from "../entities/Musician";
import ConcertPerformance from "../entities/SymphonyPerformance";

// Describe
// Adds musicians to table from an array of names,
// filters duplicates, returns saved count
export const addMusicians = async (musicianNames: string[]) => {
  const repo = getRepository(Musician);

  let objects: Partial<Musician>[] = [];

  // Filter duplicates and invalid
  musicianNames.forEach((name) => {
    if (name.trim() === "") {
      return;
    }

    if (!objects.some((obj) => obj.name === name)) {
      objects.push({
        name,
      });
    }
  });

  let newObjects: Partial<Musician>[] = [];

  const existingMusicians = await repo.find({});

  // Filter already existing
  objects.forEach((obj) => {
    if (!existingMusicians.some((mus) => mus.name === obj.name)) {
      newObjects.push({
        name: obj.name,
      });
    }
  });

  const result = await repo.save(newObjects);
  return result.length;
};

// Describe
// Gets all compositor musicians from table
export const getAllCompositors = async () => {
  const repo = getRepository(ConcertPerformance);
  const response = await repo.find({ relations: ["compositors"] });

  const compositors = response
    .map((x) => x.compositors)
    .flat(1)
    .filter((x) => x);

  // Filter array to uniques
  const filtered = compositors.filter(
    (current, index, self) =>
      index === self.findIndex((x) => x.id === current.id && x.name === current.name)
  );

  return filtered;
};

// Describe
// Search compositors by the starting letter
export const searchCompositorsByStartingLetter = async (lettersArr: string[]) => {
  const regexString = (str: string) => `^${str}`;
  const regexArr = lettersArr.map((x) => new RegExp(regexString(x), "i"));

  const response = await getAllCompositors();

  const filteredByStaringLetter = response.filter((comp) =>
    regexArr.some((reg) => reg.test(comp.name))
  );
  return filteredByStaringLetter;
};

// Describe
// Gets all conductor musicians from table
export const getAllConductors = async () => {
  const repo = getRepository(ConcertPerformance);
  const response = await repo.find({ relations: ["conductors"] });

  const conductors = response
    .map((x) => x.conductors)
    .flat(1)
    .filter((x) => x);

  // Filter array to uniques
  const filtered = conductors.filter(
    (current, index, self) =>
      index === self.findIndex((x) => x.id === current.id && x.name === current.name)
  );

  return filtered;
};

// Describe
// Gets all arrangers
export const getAllArrangers = async () => {
  const repo = getRepository(Arrangers);
  const response = await repo.find();
  return response;
};

// Describe
// Deletes all musicians from table,
// returns deleted count
export const deleteAllMusicians = async () => {
  const repo = getRepository(Musician);

  const result = await repo.delete({});
  return result.affected;
};
