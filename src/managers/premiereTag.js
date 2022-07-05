const { getRepository } = require("typeorm");

const PremiereTag = require("../entities/PremiereTag");

// Describe
// Adds premiere tags to table,
// returns saved count
const addPremiereTags = async (premiereTags) => {
  let addedCount = 0;
  const premiereTagRepo = getRepository(PremiereTag);

  for (const premiereTag of premiereTags) {
    const premiereTagObject = {
      name: premiereTag.sqlName,
    };

    // Save
    await premiereTagRepo.save(premiereTagObject);
    addedCount++;
    console.log("Added premiere_tag:", premiereTagObject);
  }

  return addedCount;
};

// Describe
// Get all premiere tags
const getAllPremiereTags = async () => {
  const repo = getRepository(PremiereTag);
  const result = await repo.find();
  return result;
};

// Describe
// Get premiere tag by name
const getPremiereTagByName = async (name) => {
  const repo = getRepository(PremiereTag);
  const result = await repo.findOne({ name: name });
  console.log("Premiere tag", result);
  return result;
};

module.exports = {
  addPremiereTags,
  getAllPremiereTags,
  getPremiereTagByName,
};
