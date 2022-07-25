import { getRepository, IsNull, Not } from "typeorm";

import Performance from "../entities/Performance";
import Composer from "../entities/Composer";
import Arrangers from "../entities/Arranger";
import Musician from "../entities/Musician";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Concert from "../entities/Concert";
import Conductor from "../entities/Conductor";
import Symphony from "../entities/Symphony";

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

  const symphoniesRepo = getRepository(Symphony);
  const performancesRepo = getRepository(Performance);
  const composersRepo = getRepository(Composer);

  let composers: Composer[] = [];
  let premieres: Performance[] = [];
  let symphonies: Symphony[] = [];

  const getComposers = async () => await composersRepo.find({ order: { name: "ASC" } });
  const getPremieres = async () =>
    await performancesRepo.find({
      where: {
        premiere_tag: Not(IsNull()),
      },
      relations: ["symphony", "symphony.composers", "premiere_tag"],
    });
  const getSymphonies = async () =>
    await symphoniesRepo.find({
      relations: ["composers"],
    });

  await Promise.all([
    await getComposers().then((res) => (composers = res)),
    await getPremieres().then((res) => (premieres = res)),
    await getSymphonies().then((res) => (symphonies = res)),
  ]);

  const filteredByStaringLetter = composers.filter((comp) => regexArr.some((reg) => reg.test(comp.name)));
  const sorted = filteredByStaringLetter.sort((a, b) => sortStringsFunction(a.name, b.name));

  const composerIds = premieres
    .map((x) => x.symphony)
    .map((x) => x.composers)
    .flat()
    .map((x) => x.id);

  const withPremieres = sorted.map((comp) => {
    let premsCount = 0;
    composerIds.forEach((val) => {
      if (val === comp.id) {
        premsCount++;
      }
    });
    const symphsCount = symphonies.filter((x) => x.composers.find((x) => x.id === comp.id)).length;
    return { ...comp, premieresCount: premsCount, symphoniesCount: symphsCount };
  });

  return withPremieres;
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
