const { getRepository } = require("typeorm");

const Arrangers = require("../entities/Arrangers");
const Musician = require("../entities/Musician");
const ConcertPerformance = require("../entities/SymphonyPerformance");

// Describe
// Adds musicians to table from an array of names,
// filters duplicates, returns saved count
const addMusicians = async (musicianNames) => {
  const repo = getRepository(Musician);

  let objects = [];

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

  let newObjects = [];

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
const getAllCompositors = async () => {
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
// Gets all conductor musicians from table
const getAllConductors = async () => {
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
const getAllArrangers = async () => {
  const repo = getRepository(Arrangers);
  const response = await repo.find();
  return response;
};

// Describe
// Deletes all musicians from table,
// returns deleted count
const deleteAllMusicians = async () => {
  const repo = getRepository(Musician);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addMusicians,
  getAllCompositors,
  getAllConductors,
  getAllArrangers,
  deleteAllMusicians,
};
