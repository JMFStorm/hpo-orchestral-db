import { getRepository, IsNull, ILike, Not } from "typeorm";

import Performance from "../entities/Performance";
import Composer from "../entities/Composer";
import Arrangers from "../entities/Arranger";
import Musician from "../entities/Musician";
import { filterUniquesById, sortStringsFunction } from "../utils/functions";
import Concert from "../entities/Concert";
import Conductor from "../entities/Conductor";
import Symphony from "../entities/Symphony";

export const addMusicians = async (musicianNames: string[]) => {
  const repo = getRepository(Musician);
  let newMusicians: Partial<Musician>[] = [];

  await Promise.all(
    musicianNames.map(async (musicianName) => {
      const found = await repo.findOne({ name: musicianName });
      if (!found) {
        newMusicians.push({
          name: musicianName,
        });
      }
    })
  );

  const res = await repo.save(newMusicians);
  return res.length;
};

export const addComposers = async (composerNames: string[]) => {
  const repo = getRepository(Composer);
  let newComposers: Partial<Composer>[] = [];

  await Promise.all(
    composerNames.map(async (composerName) => {
      const found = await repo.findOne({ name: composerName });
      if (!found) {
        newComposers.push({
          name: composerName,
        });
      }
    })
  );

  const res = await repo.save(newComposers);
  return res.length;
};

export const addConductors = async (conductorNames: string[]) => {
  const repo = getRepository(Conductor);
  let newConductors: Partial<Conductor>[] = [];

  await Promise.all(
    conductorNames.map(async (conductorName) => {
      const found = await repo.findOne({ name: conductorName });
      if (!found) {
        newConductors.push({
          name: conductorName,
        });
      }
    })
  );

  const res = await repo.save(newConductors);
  return res.length;
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

// Describe
// Search soloists by a keyword
export const getSoloistsByKeyword = async (keyword: string) => {
  const repo = getRepository(Musician);
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
