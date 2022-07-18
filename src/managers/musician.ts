import { getRepository } from "typeorm";

import Composer from "../entities/Composer";
import Arrangers from "../entities/Arranger";
import Musician from "../entities/Musician";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Concert from "../entities/Concert";
import Conductor from "../entities/Conductor";

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
// Adds conductors to table from an array of names,
// filters duplicates, returns saved count
export const addConductors = async (conductorNames: string[]) => {
  const repo = getRepository(Conductor);

  let objects: Partial<Conductor>[] = [];

  // Filter duplicates and invalid
  conductorNames.forEach((name) => {
    if (name.trim() === "") {
      return;
    }

    if (!objects.some((obj) => obj.name === name)) {
      objects.push({
        name,
      });
    }
  });

  let newObjects: Partial<Conductor>[] = [];

  const existingConductors = await repo.find({});

  // Filter already existing
  objects.forEach((obj) => {
    if (!existingConductors.some((cond) => cond.name === obj.name)) {
      newObjects.push({
        name: obj.name,
      });
    }
  });

  const result = await repo.save(newObjects);
  return result.length;
};

// Describe
// Gets all composer musicians from table
export const getAllComposers = async () => {
  const repo = getRepository(Composer);
  const response = await repo.find({ order: { name: "ASC" } });
  return response;
};

// Describe
// Search composers by the starting letter
export const searchComposersByStartingLetter = async (lettersArr: string[]) => {
  const regexString = (str: string) => `^${str}`;
  const regexArr = lettersArr.map((x) => new RegExp(regexString(x), "i"));

  const response = await getAllComposers();

  const filteredByStaringLetter = response.filter((comp) =>
    regexArr.some((reg) => reg.test(comp.name))
  );
  return filteredByStaringLetter.sort((a, b) => sortStringsFunction(a.name, b.name));
};

// Describe
// Gets all conductor musicians from table
export const getAllConductors = async () => {
  const repo = getRepository(Concert);
  const response = await repo.find({ relations: ["conductors"] });

  const conductors = response
    .map((x) => x.conductors)
    .flat(1)
    .filter((x) => x);

  const filtered = filterUniquesById(conductors);
  return filtered;
};

// Describe
// Gets all arrangers
export const getAllArrangers = async () => {
  const repo = getRepository(Arrangers);
  const response = await repo.find();
  return response;
};
