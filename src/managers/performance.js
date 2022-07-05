const { getRepository } = require("typeorm");

const PremiereTag = require("../entities/PremiereTag");
const ConcertPerformance = require("../entities/SymphonyPerformance");
const SoloistPerformance = require("../entities/SoloistPerformance");
const Instrument = require("../entities/Instrument");
const Musician = require("../entities/Musician");
const Concert = require("../entities/Concert");
const Symphony = require("../entities/Symphony");

// To get all relational tables from performances
const allPerformanceRelations = [
  "concert",
  "concert.location",
  "concert.concert_tag",
  "concert.orchestra",
  "symphony",
  "conductor",
  "compositor",
  "arranger",
  "premiere_tag",
  "soloist_performances",
  "soloist_performances.soloist",
  "soloist_performances.instrument",
];

// Describe
// Adds concert & soloist performances to table,
// returns saved count
const addPremiereTags = async (premiereTags) => {
  let addedCount = 0;
  const premiereTagRepo = getRepository(PremiereTag);

  for (const premiereTag of premiereTags) {
    const premiereTagObject = {
      name: premiereTag.sqlName,
    };

    // Save
    await premiereTagRepo.save(premiereTagObject);
    addedCount++;
    console.log("Added premiere_tag:", premiereTagObject);
  }

  return addedCount;
};

// Describe
// Adds concert & soloist performances to table,
// returns saved count
const addPerformances = async (symphonies) => {
  const concertRepo = getRepository(Concert);
  const symphonyRepo = getRepository(Symphony);
  const instrumentRepo = getRepository(Instrument);
  const musicianRepo = getRepository(Musician);
  const premiereTagRepo = getRepository(PremiereTag);
  const concertPerfRepo = getRepository(ConcertPerformance);
  const soloistPerfRepo = getRepository(SoloistPerformance);

  let addedCount = 0;
  const symphoniesCount = symphonies.length;

  for (const symph of symphonies) {
    if (addedCount % 50 == 0) {
      console.log(`Saving performance: (${addedCount}/${symphoniesCount})`);
    }

    const saveSoloistPerformances = async (performances) => {
      let soloistPerfArray = [];

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
        soloistPerfArray.push(savedSoloistPerf);
      }

      return soloistPerfArray;
    };

    let concertPerfObj = {
      order: symph.order,
    };

    // Get all existing fields from tables
    await Promise.all([
      await concertRepo
        .findOne({ concert_id: symph.concertId })
        .then((x) => (concertPerfObj.concert = x)),
      await symphonyRepo
        .findOne({ symphony_id: symph.symphonyId })
        .then((x) => (concertPerfObj.symphony = x)),
      await musicianRepo
        .findOne({ name: symph.conductor })
        .then((x) => (concertPerfObj.conductor = x)),
      await musicianRepo
        .findOne({ name: symph.compositor })
        .then((x) => (concertPerfObj.compositor = x)),
      await musicianRepo
        .findOne({ name: symph.arranger })
        .then((x) => (concertPerfObj.arranger = x)),
      await premiereTagRepo
        .findOne({ name: symph.premiere_tag })
        .then((x) => (concertPerfObj.premiere_tag = x)),
      await saveSoloistPerformances(symph.soloist_performances).then(
        (x) => (concertPerfObj.soloist_performances = x)
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
const getAllPerformances = async () => {
  const repo = getRepository(ConcertPerformance);
  const result = await repo.find({ relations: allPerformanceRelations });
  return result;
};

// Describe
// Get all premiere tags
const getAllPremiereTags = async () => {
  const repo = getRepository(PremiereTag);
  const result = await repo.find();
  return result;
};

// Describe
// Get premiere tag by name
const getPremiereTagByName = async (name) => {
  const repo = getRepository(PremiereTag);
  const result = await repo.findOne({ name: name });
  console.log("Premiere tag", result);
  return result;
};

// Describe
// Get all performances with search params
const getPerformancesSearch = async ({ compositorId, conductorId }) => {
  const repo = getRepository(ConcertPerformance);

  // Create query object
  let whereQuery = {};

  if (compositorId) {
    whereQuery.compositor = { id: compositorId };
  }
  if (conductorId) {
    whereQuery.conductor = { id: conductorId };
  }

  const result = await repo.find({
    where: whereQuery,
    relations: allPerformanceRelations,
  });

  return result;
};

// Describe
// Get performances by conductor id
const getPerformancesByConductorId = async (conductorId) => {
  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({
    where: { conductor: { id: conductorId } },
    relations: allPerformanceRelations,
  });

  return result;
};

// Describe
// Get performances by compositor id
const getPerformancesByCompositorId = async (compositorId) => {
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
const deleteAllConcertPerformances = async () => {
  const repo = getRepository(ConcertPerformance);
  const result = await repo.delete({});
  return result.affected;
};

// Describe
// Deletes all soloist performances from table,
// returns deleted count
const deleteAllSoloistPerformances = async () => {
  const repo = getRepository(SoloistPerformance);
  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addPerformances,
  addPremiereTags,
  getAllPerformances,
  getAllPremiereTags,
  getPremiereTagByName,
  getPerformancesByConductorId,
  getPerformancesByCompositorId,
  getPerformancesSearch,
  deleteAllConcertPerformances,
  deleteAllSoloistPerformances,
};
