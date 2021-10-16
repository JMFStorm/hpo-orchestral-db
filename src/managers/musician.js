const { getRepository } = require("typeorm");

const Musician = require("../entities/Musician");

// Describe
// Adds musicians to table from an array of names,
// filters duplicates, returns saved count
const addMusicians = async (musicianNames) => {
  const repo = getRepository(Musician);

  let objects = [];
  let invalid = 0;

  // Filter duplicates and invalid
  musicianNames.forEach((name) => {
    if (name.trim() === "") {
      invalid++;
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
// Deletes all compositor musicians from table
const getAllCompositors = async () => {
  console.log("getAllCompositors");
};

// Describe
// Deletes all conductor musicians from table
const getAllConductors = async () => {
  console.log("getAllConductors");
};

module.exports = {
  addMusicians,
  getAllCompositors,
  getAllConductors,
  deleteAllMusicians,
};
