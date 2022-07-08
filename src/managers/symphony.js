const { getRepository } = require("typeorm");

const Symphony = require("../entities/Symphony");
const SymphonyPerformance = require("../entities/SymphonyPerformance");

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
// Search symphonies by compositor id
const getSymphoniesByCompositorId = async (compositorId) => {
  const repo = getRepository(SymphonyPerformance);

  const response = await repo.find({
    relations: ["symphony", "compositors"],
  });

  const relatedPerformances = response.filter((x) =>
    x.compositors.map((x) => x.id).includes(compositorId)
  );

  const result = relatedPerformances.map((x) => x.symphony);
  return relatedPerformances;
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
  getSymphoniesByCompositorId,
  deleteAllSymphonyIds,
};
