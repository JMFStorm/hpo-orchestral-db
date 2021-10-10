const { getRepository } = require("typeorm");

const Instrument = require("../entities/Instrument");

// Describe
// Adds instruments to table from an array of names,
// filters duplicates, returns saved count
const addInstruments = async (instrumentNames) => {
  const repo = getRepository(Instrument);

  let objects = [];
  let invalid = 0;

  // Filter duplicates and invalid
  instrumentNames.forEach((name) => {
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

  const existingInstruments = await repo.find({});

  // Filter already existing
  objects.forEach((obj) => {
    if (!existingInstruments.some((instr) => instr.name === obj.name)) {
      newObjects.push({
        name: obj.name,
      });
    }
  });

  const result = await repo.save(newObjects);
  return result.length;
};

// Describe
// Deletes all instruments from table,
// returns deleted count
const deleteAllInstruments = async () => {
  const repo = getRepository(Instrument);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addInstruments,
  deleteAllInstruments,
};
