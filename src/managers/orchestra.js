const { getRepository } = require("typeorm");

const Orchestra = require("../entities/Orchestra");

// Describe
// Adds orchestries to table,
// returns saved count
const addOrchestries = async (orchestraNames) => {
  const repo = getRepository(Orchestra);

  const objects = orchestraNames.map((x) => {
    return {
      name: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all orchestries from table,
// returns deleted count
const deleteAllOrchestries = async () => {
  const repo = getRepository(Orchestra);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = { addOrchestries, deleteAllOrchestries };
