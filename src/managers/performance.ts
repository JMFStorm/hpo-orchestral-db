import { getRepository } from "typeorm";

import { seedLog } from "../socket";
import PremiereTag from "../entities/PremiereTag";
import Performance from "../entities/Performance";
import SoloistPerformance from "../entities/SoloistPerformance";
import Instrument from "../entities/Instrument";
import Musician from "../entities/Musician";
import Concert from "../entities/Concert";
import Symphony from "../entities/Symphony";
import PerformanceObject from "src/interfaces/PerformanceObject";
import SoloistPerformanceObject from "src/interfaces/SoloistPerformanceObject";

const allPerformanceRelations = [
  "concert",
  "concert.location",
  "concert.concert_tag",
  "concert.orchestra",
  "concert.conductors",
  "symphony",
  "symphony.composers",
  "premiere_tag",
  "soloist_performances",
  "soloist_performances.soloist",
  "soloist_performances.instrument",
];

const performanceRelationsForList = [
  "concert",
  "concert.concert_tag",
  "symphony",
  "symphony.composers",
  "premiere_tag",
];

export const saveSoloistPerformances = async (soloPerformances: SoloistPerformanceObject[]) => {
  const instrumentRepo = getRepository(Instrument);
  const musicianRepo = getRepository(Musician);
  const soloistPerfRepo = getRepository(SoloistPerformance);
  const performanceRepo = getRepository(Performance);

  let addedCount = 0;
  const performancesCount = soloPerformances.length;
  const numeralPart = Math.floor(performancesCount / 20);
  let soloistObjectsArray = [];
  await Promise.all(
    soloPerformances.map(async (perf) => {
      let soloistObj: Musician | undefined = undefined;
      let instrumentObj: Instrument | undefined = undefined;
      let performance: Performance | undefined = undefined;

      await Promise.all([
        await musicianRepo.findOne({ name: perf.soloistName }).then((res) => (soloistObj = res as Musician)),
        await instrumentRepo.findOne({ name: perf.instrumentName }).then((res) => (instrumentObj = res as Instrument)),
        await performanceRepo.findOne({ id: perf.performanceId }).then((res) => (performance = res as Performance)),
      ]);

      const soloistPerfObject: Partial<SoloistPerformance> = {
        soloist: soloistObj,
        instrument: instrumentObj,
        performance: performance,
      };
      const savedSoloistPerf = await soloistPerfRepo.save(soloistPerfObject);
      soloistObjectsArray.push(savedSoloistPerf);
      if (addedCount % numeralPart == 0) {
        seedLog(`Saving soloist performances: (${addedCount}/${performancesCount})`, "soloistPerformances");
      }
      addedCount++;
    })
  );
  seedLog(`Saved soloist performances: (${addedCount}/${performancesCount})`, "soloistPerformances");
  return addedCount;
};

// Describe
// Adds concert & soloist performances to table,
// returns saved count
export const addPerformances = async (performances: PerformanceObject[]) => {
  const concertRepo = getRepository(Concert);
  const symphonyRepo = getRepository(Symphony);
  const premiereTagRepo = getRepository(PremiereTag);
  const performanceRepo = getRepository(Performance);

  let addedCount = 0;
  const performancesCount = performances.length;
  const numeralPart = Math.floor(performancesCount / 40);
  let soloistPerformanceObjects: SoloistPerformanceObject[] = [];
  await Promise.all(
    performances.map(async (performance) => {
      const symphony = await symphonyRepo.findOne({ symphony_id: performance.symphonyId });
      // Init performance object
      let concertPerfObj: Partial<Performance> = {
        order: Number(performance.order),
        symphony: symphony,
        is_encore: performance.is_encore ?? false,
      };
      // Get all existing fields from tables
      await Promise.all([
        await concertRepo.findOne({ concert_id: performance.concertId }).then((x) => (concertPerfObj.concert = x)),
        await premiereTagRepo
          .findOne({ name: performance.premiere_tag })
          .then((x) => (concertPerfObj.premiere_tag = x)),
      ]);
      // Save
      const savedResponse = await performanceRepo.save(concertPerfObj);
      performance.soloist_performances.forEach((soloPerf) => {
        const soloistPerf: SoloistPerformanceObject = {
          soloistName: soloPerf.soloistName,
          instrumentName: soloPerf.instrumentName,
          performanceId: savedResponse.id,
        };
        soloistPerformanceObjects.push(soloistPerf);
      });
      if (addedCount % numeralPart == 0) {
        seedLog(`Saving performances: (${addedCount}/${performancesCount})`, "performances");
      }
      addedCount++;
    })
  );
  seedLog(`Saved performances: (${addedCount}/${performancesCount})`, "performances");
  return { addedCount, soloistPerformanceObjects };
};

// Describe
// Get all performances
export const getAllPerformances = async () => {
  const repo = getRepository(Performance);
  const result = await repo.find({ relations: allPerformanceRelations });
  return result;
};

// Describe
// Get performances by conductor id
export const getPerformancesByConductorId = async (conductorId: string) => {
  const repo = getRepository(Performance);
  const result = await repo.find({
    where: { conductor: { id: conductorId } },
    relations: allPerformanceRelations,
  });
  return result;
};

// Describe
// Get performances by premiere tag composer Id
export const getPerformancesByComposerAndPremiereTag = async (composerId: string, premiereTagIds: string[]) => {
  const tagRepo = getRepository(PremiereTag);
  const performanceRepo = getRepository(Performance);
  let tags: PremiereTag[] = [];
  for (const tagId of premiereTagIds) {
    const res = await tagRepo.findOne({ id: tagId });
    if (res) {
      tags.push(res);
    }
  }
  const tagsQuery = tags.map((tag) => ({
    premiere_tag: { id: tag.id },
  }));
  const performances = await performanceRepo.find({
    where: tagsQuery,
    relations: performanceRelationsForList,
  });
  const filtered = performances.filter((perf) => perf.symphony.composers.find((comp) => comp.id == composerId));
  return filtered;
};

// Describe
// Get premieres by composer Id
export const getAllPremieresByComposerId = async (composerId: string) => {
  const tagRepo = getRepository(PremiereTag);
  const performanceRepo = getRepository(Performance);
  const tags: PremiereTag[] = await tagRepo.find({});
  const tagsQuery = tags.map((tag) => ({
    premiere_tag: { id: tag.id },
  }));
  const performances = await performanceRepo.find({
    where: tagsQuery,
    relations: performanceRelationsForList,
  });
  const filtered = performances.filter((perf) => perf.symphony.composers.find((comp) => comp.id == composerId));
  return filtered;
};
