const { getRepository } = require("typeorm");

const Musician = require("../entities/Musician");
const ConcertPerformance = require("../entities/ConcertPerformance");

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
// Deletes all musicians from table,
// returns deleted count
const deleteAllMusicians = async () => {
  const repo = getRepository(Musician);

  const result = await repo.delete({});
  return result.affected;
};

// Describe
// Gets all compositor musicians from table
const getAllCompositors = async () => {
  const repo = getRepository(ConcertPerformance);
  const response = await repo.find({ relations: ["compositor"] });

  const compositors = response
    .map((x) => {
      return x.compositor ? { id: x.compositor.id, name: x.compositor.name } : null;
    })
    .filter((x) => x);

  // Filter array to uniques
  return compositors.filter(
    (current, index, self) =>
      index === self.findIndex((x) => x.id === current.id && x.name === current.name)
  );
};

// Describe
// Gets all conductor musicians from table
const getAllConductors = async () => {
  const repo = getRepository(ConcertPerformance);
  const response = await repo.find({ relations: ["conductor"] });

  const conductors = response
    .map((x) => {
      return x.conductor ? { id: x.conductor.id, name: x.conductor.name } : null;
    })
    .filter((x) => x);

  // Filter array to uniques
  return conductors.filter(
    (current, index, self) =>
      index === self.findIndex((x) => x.id === current.id && x.name === current.name)
  );
};

module.exports = {
  addMusicians,
  getAllCompositors,
  getAllConductors,
  deleteAllMusicians,
};
