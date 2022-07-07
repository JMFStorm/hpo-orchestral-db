const { getRepository } = require("typeorm");

const Arrangers = require("../entities/Arrangers");

// Describe
// Adds arrangers to table,
// returns saved count
const addArrangers = async (arrangerNames) => {
  const repo = getRepository(Arrangers);

  const objects = arrangerNames.map((x) => {
    return {
      names: x,
    };
  });

  console.log("arrangers", objects);

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all arrangers from table,
// returns deleted count
const deleteAllArrangers = async () => {
  const repo = getRepository(Arrangers);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = { addArrangers, deleteAllArrangers };
