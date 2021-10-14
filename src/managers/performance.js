const { getRepository } = require("typeorm");

const ConcertPerformance = require("../entities/ConcertPerformance");
const SoloistPerformance = require("../entities/SoloistPerformance");
const Instrument = require("../entities/Instrument");
const Musician = require("../entities/Musician");
const Concert = require("../entities/Concert");
const Symphony = require("../entities/Symphony");

// Describe
// Adds concert & soloist performances to table,
// returns saved count
const addPerformances = async (symphonies) => {
  const concertRepo = getRepository(Concert);
  const symphonyRepo = getRepository(Symphony);
  const instrumentRepo = getRepository(Instrument);
  const musicianRepo = getRepository(Musician);
  const concertPerfRepo = getRepository(ConcertPerformance);
  const soloistPerfRepo = getRepository(SoloistPerformance);

  let addedCount = 0;
  const symphoniesCount = symphonies.length;

  for (const symph of symphonies) {
    console.log(`Saving performance: (${addedCount}/${symphoniesCount})`);

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
      await concertRepo.findOne({ concert_id: symph.concertId }).then((x) => (concertPerfObj.concert = x)),
      await symphonyRepo
        .findOne({ symphony_id: symph.symphonyId })
        .then((x) => (concertPerfObj.symphony = x)),
      await musicianRepo.findOne({ name: symph.conductor }).then((x) => (concertPerfObj.conductor = x)),
      await musicianRepo.findOne({ name: symph.compositor }).then((x) => (concertPerfObj.compositor = x)),
      await musicianRepo.findOne({ name: symph.arranger }).then((x) => (concertPerfObj.arranger = x)),
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
  const relationsArr = ["concert", "symphony", "conductor", "compositor", "arranger", "soloist_performances"];

  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({ relations: relationsArr });
  return result;
};

// Describe
// Get performances by compositor id
const getPerformancesByCompositorId = async (compositorId) => {
  const relationsArr = ["concert", "symphony", "conductor", "compositor", "arranger", "soloist_performances"];

  const repo = getRepository(ConcertPerformance);

  const result = await repo.find({
    where: { compositor: { id: compositorId } },
    relations: relationsArr,
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
  getAllPerformances,
  getPerformancesByCompositorId,
  deleteAllConcertPerformances,
  deleteAllSoloistPerformances,
};
