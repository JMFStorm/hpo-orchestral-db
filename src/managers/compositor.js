const { getRepository } = require("typeorm");

const Compositor = require("../entities/Compositor");

// Describe
// Adds creates compositors on table from an array of names,
// filters duplicates, returns saved count
const createCompositors = async (compositorNames) => {
  const repo = getRepository(Compositor);

  let objects = [];
  let duplicates = 0;

  // Filter duplicates
  compositorNames.forEach((name) => {
    if (!objects.some((obj) => obj.name === name)) {
      objects.push({
        name,
      });
    } else {
      duplicates++;
    }
  });

  console.log(
    `Found ${duplicates} duplicates in ${compositorNames.length} compositors`
  );

  const result = await repo.save(objects);
  return result.length;
};

// Describe
// Deletes all compositors from table
// returns deleted count
const deleteAllCompositors = async () => {
  const repo = getRepository(Compositor);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  createCompositors,
  deleteAllCompositors,
};
