import { getRepository } from "typeorm";

import PremiereTag from "../entities/PremiereTag";
import ConcertPerformance from "../entities/SymphonyPerformance";
import SoloistPerformance from "../entities/SoloistPerformance";
import Instrument from "../entities/Instrument";
import Musician from "../entities/Musician";
import Concert from "../entities/Concert";
import Symphony from "../entities/Symphony";
import Arranger from "../entities/Arranger";
import PerformanceObject from "src/interfaces/PerformanceObject";
import SoloistPerformanceObject from "src/interfaces/SoloistPerformanceObject";
import SymphonyPerformance from "../entities/SymphonyPerformance";

// To get all relational tables from performances
const allPerformanceRelations = [
  "concert",
  "concert.location",
  "concert.concert_tag",
  "concert.orchestra",
  "symphony",
  "conductors",
  "compositors",
  "arrangers",
  "premiere_tag",
  "soloist_performances",
  "soloist_performances.soloist",
  "soloist_performances.instrument",
];

// Describe
// Adds concert & soloist performances to table,
// returns saved count
export const addPerformances = async (performances: PerformanceObject[]) => {
  const arrangerRepo = getRepository(Arranger);
  const concertRepo = getRepository(Concert);
  const symphonyRepo = getRepository(Symphony);
  const instrumentRepo = getRepository(Instrument);
  const musicianRepo = getRepository(Musician);
  const premiereTagRepo = getRepository(PremiereTag);
  const concertPerfRepo = getRepository(ConcertPerformance);
  const soloistPerfRepo = getRepository(SoloistPerformance);

  let addedCount = 0;
  const performancesCount = performances.length;

  for (const performance of performances) {
    if (addedCount % 50 == 0) {
      console.log(`Saving performance: (${addedCount}/${performancesCount})`);
    }

    const saveSoloistPerformances = async (performances: SoloistPerformanceObject[]) => {
      let soloistObjectsArray = [];

      // Iterate soloist performances to object array
      for (const performance of performances) {
        const soloistObj = await musicianRepo.findOne({ name: performance.soloistName });
        const instrumentObj = await instrumentRepo.findOne({ name: performance.instrumentName });

        const soloistPerfObject = {
          soloist: soloistObj,
          instrument: instrumentObj,
        };

        // Save soloist performance
        const savedSoloistPerf = await soloistPerfRepo.save(soloistPerfObject);
        soloistObjectsArray.push(savedSoloistPerf);
      }

      return soloistObjectsArray as SoloistPerformance[];
    };

    const setConductorObjectsArray = async (conductorNames: string[]) => {
      let conductorObjectsArray = [];

      for (const name of conductorNames) {
        const conductorObj = await musicianRepo.findOne({ name: name });
        conductorObjectsArray.push(conductorObj);
      }

      return conductorObjectsArray as Musician[];
    };

    const setCompositorObjectsArray = async (conmpositorNames: string[]) => {
      let compositorObjectsArray = [];

      for (const name of conmpositorNames) {
        const conmpositorObj = await musicianRepo.findOne({ name: name });
        compositorObjectsArray.push(conmpositorObj);
      }

      return compositorObjectsArray as Musician[];
    };

    let concertPerfObj: Partial<SymphonyPerformance> = {
      order: Number(performance.order),
      footnote: performance.footnote,
      archive_info: performance.archive_info,
    };

    // Get all existing fields from tables
    await Promise.all([
      await concertRepo
        .findOne({ concert_id: performance.concertId })
        .then((x) => (concertPerfObj.concert = x)),
      await symphonyRepo
        .findOne({ symphony_id: performance.symphonyId })
        .then((x) => (concertPerfObj.symphony = x)),
      await arrangerRepo
        .findOne({ names: performance.arrangers })
        .then((x) => (concertPerfObj.arrangers = x)),
      await premiereTagRepo
        .findOne({ name: performance.premiere_tag })
        .then((x) => (concertPerfObj.premiere_tag = x)),
      await saveSoloistPerformances(performance.soloist_performances).then(
        (x) => (concertPerfObj.soloist_performances = x)
      ),
      await setConductorObjectsArray(performance.conductors).then(
        (x) => (concertPerfObj.conductors = x)
      ),
      await setCompositorObjectsArray(performance.compositors).then(
        (x) => (concertPerfObj.compositors = x)
      ),
    ]);

    // Save
    await concertPerfRepo.save(concertPerfObj);
    addedCount++;
  }

  return addedCount;
};

// Describe
// Get all performances
export const getAllPerformances = async () => {
  const repo = getRepository(ConcertPerformance);
  const result = await repo.find({ relations: allPerformanceRelations });
  return result;
};

// Describe
// Get performances by performance id
export const getPerformancesByPerformanceId = async (performaceId: string) => {
  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({
    where: { id: performaceId },
    relations: allPerformanceRelations,
  });

  return result;
};

// Describe
// Get performances by conductor id
export const getPerformancesByConductorId = async (conductorId: string) => {
  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({
    where: { conductor: { id: conductorId } },
    relations: allPerformanceRelations,
  });

  return result;
};

// Describe
// Get performances by compositor id
export const getPerformancesByCompositorId = async (compositorId: string) => {
  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({
    where: { compositor: { id: compositorId } },
    relations: allPerformanceRelations,
  });

  return result;
};

// Describe
// Deletes all concert performances from table,
// returns deleted count
export const deleteAllConcertPerformances = async () => {
  const repo = getRepository(ConcertPerformance);
  const result = await repo.delete({});
  return result.affected;
};

// Describe
// Deletes all soloist performances from table,
// returns deleted count
export const deleteAllSoloistPerformances = async () => {
  const repo = getRepository(SoloistPerformance);
  const result = await repo.delete({});
  return result.affected;
};
