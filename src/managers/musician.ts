import { getRepository, IsNull, ILike, Not } from "typeorm";

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
// Search composers by a keyword
export const getComposersByKeyword = async (keyword: string) => {
  const repo = getRepository(Composer);
  const response = await repo.find({ where: { name: ILike(`%${keyword}%`) }, order: { name: "ASC" } });
  return response;
};

// Describe
// Search composers by a keyword
export const getConductorsByKeyword = async (keyword: string) => {
  const repo = getRepository(Conductor);
  const response = await repo.find({ where: { name: ILike(`%${keyword}%`) }, order: { name: "ASC" } });
  return response;
};

const addComposersWithSymphoniesAndPremieres = async (composers: Composer[]) => {
  let premieres: Performance[] = [];
  let symphonies: Symphony[] = [];

  const symphoniesRepo = getRepository(Symphony);
  const performancesRepo = getRepository(Performance);

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
    await getPremieres().then((res) => (premieres = res)),
    await getSymphonies().then((res) => (symphonies = res)),
  ]);

  const composerIds = premieres
    .map((x) => x.symphony)
    .map((x) => x.composers)
    .flat()
    .map((x) => x.id);

  const withCounts = composers.map((comp) => {
    let premsCount = 0;
    composerIds.forEach((val) => {
      if (val === comp.id) {
        premsCount++;
      }
    });

    const symphsCount = symphonies.filter((x) => x.composers.find((x) => x.id === comp.id)).length;
    return { ...comp, premieresCount: premsCount, symphoniesCount: symphsCount };
  });

  return withCounts;
};

// Describe
// Search composers by the starting letter
export const searchComposersByStartingLetter = async (lettersArr: string[]) => {
  const composersRepo = getRepository(Composer);
  const composers = await composersRepo.find({ order: { name: "ASC" } });

  const regexString = (str: string) => `^${str}`;
  const regexArr = lettersArr.map((x) => new RegExp(regexString(x), "i"));

  const filteredByStaringLetter = composers.filter((comp) => regexArr.some((reg) => reg.test(comp.name)));
  const sortedComps = filteredByStaringLetter.sort((a, b) => sortStringsFunction(a.name, b.name));

  const withCounts = addComposersWithSymphoniesAndPremieres(sortedComps);
  return withCounts;
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

// Describe
// Gets all arrangers
export const getComposerById = async (composerId: string) => {
  const repo = getRepository(Composer);
  const response = await repo.findOne({ id: composerId });
  return response;
};
