const { getRepository } = require("typeorm");

const Symphony = require("../entities/Symphony");
const SymphonyName = require("../entities/SymphonyName");

// Describe
// Adds symphonies to id and name table
// returns if saved id
const addSymphonies = async (symphonies) => {
  let addedCount = 0;

  for (const symph of symphonies) {
    const repoId = getRepository(Symphony);
    const repoName = getRepository(SymphonyName);

    let symphonyObject = null;
    const idObject = { symphony_id: symph.symphony_id };
    const idExists = await repoId.findOne(idObject);

    if (!idExists) {
      symphonyObject = await repoId.save(idObject);
    } else {
      const findRes = await repoId.find(idObject);
      symphonyObject = findRes[0];
    }

    const nameObject = { name: symph.name };
    const foundName = await repoName.findOne(nameObject);

    // Save symphony_name, add relation 'from symphony'
    if (!foundName) {
      const saveNameObject = { ...nameObject, symphony: symphonyObject };
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
  deleteAllSymphonyIds,
  deleteAllSymphonyNames,
};
