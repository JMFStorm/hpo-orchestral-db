const { getRepository } = require("typeorm");

const Symphony = require("../entities/Symphony");

// Describe
// Adds symphonies to table,
// returns saved count
const addSymphonies = async (symphonies) => {
  let addedCount = 0;

  for (const symph of symphonies) {
    const repo = getRepository(Symphony);

    let symphonyObject = null;
    const idObject = { symphony_id: symph.symphony_id, name: symph.name };
    const idExists = await repo.findOne(idObject);

    if (!idExists) {
      symphonyObject = await repo.save(idObject);
    }
  }

  return addedCount;
};

// Describe
// Deletes all symphonies from table,
// returns deleted count
const deleteAllSymphonyIds = async () => {
  const repo = getRepository(Symphony);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addSymphonies,
  deleteAllSymphonyIds,
};
