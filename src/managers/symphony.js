const { getRepository } = require("typeorm");

const Symphony = require("../entities/Symphony");
const SymphonyName = require("../entities/SymphonyName");

// Describe
// Adds symphony ids to table
// returns saved count
const addSymphonyIds = async (ids) => {
  const repo = getRepository(Symphony);

  const objects = ids.map((x) => {
    return {
      symphony_id: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Adds symphonies to id and name table
// returns if saved id
const addSymphonies = async (symphonies) => {
  let addedCount = 0;

  for (const symph of symphonies) {
    const repoId = getRepository(Symphony);
    const repoName = getRepository(SymphonyName);

    const idObject = { symphony_id: symph.symphony_id };
    const idExists = await repoId.findOne(idObject);

    let savedIdObj = null;

    if (!idExists) {
      const savedId = await repoId.save(idObject);
      savedIdObj = savedId;
    }

    const nameObject = { name: symph.name };
    const foundName = await repoName.findOne(nameObject);

    if (!foundName) {
      const saveNameObject = { ...nameObject, symphony: savedIdObj ? savedIdObj : null };
      await repoName.save(saveNameObject);

      addedCount++;
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

// Describe
// Deletes all symphony names from table,
// returns deleted count
const deleteAllSymphonyNames = async () => {
  const repo = getRepository(SymphonyName);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addSymphonies,
  addSymphonyIds,
  deleteAllSymphonyIds,
  deleteAllSymphonyNames,
};
