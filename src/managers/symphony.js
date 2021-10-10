const { getRepository } = require("typeorm");

const SymphonyId = require("../entities/SymphonyId");

// Describe
// Adds symphony ids to table
// returns saved count
const addSymphonyIds = async (ids) => {
  const repo = getRepository(SymphonyId);

  const objects = ids.map((x) => {
    return {
      symphony_id: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all symphony ids from table,
// returns deleted count
const deleteAllSymphonyIds = async () => {
  const repo = getRepository(SymphonyId);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addSymphonyIds,
  deleteAllSymphonyIds,
};
