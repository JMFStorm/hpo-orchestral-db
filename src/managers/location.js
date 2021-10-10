const { getRepository } = require("typeorm");

const Location = require("../entities/Location");

// Describe
// Adds locations to table,
// returns saved count
const addLocations = async (locationNames) => {
  const repo = getRepository(Location);

  const objects = locationNames.map((x) => {
    return {
      name: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all locations from table,
// returns deleted count
const deleteAllLocations = async () => {
  const repo = getRepository(Location);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = { addLocations, deleteAllLocations };
