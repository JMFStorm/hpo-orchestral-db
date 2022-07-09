import { getRepository } from "typeorm";

import PremiereTagConfig from "src/interfaces/PremiereTagConfig";
import PremiereTag from "../entities/PremiereTag";

// Describe
// Adds premiere tags to table,
// returns saved count
export const addPremiereTags = async (premiereTags: PremiereTagConfig[]) => {
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
export const getAllPremiereTags = async () => {
  const repo = getRepository(PremiereTag);
  const result = await repo.find();
  return result;
};

// Describe
// Get premiere tag by name
export const getPremiereTagByName = async (name: string) => {
  const repo = getRepository(PremiereTag);
  const result = await repo.findOne({ name: name });
  return result;
};

// Describe
// Deletes all premiere tags from table,
// returns deleted count
export const deleteAllPremiereTags = async () => {
  const repo = getRepository(PremiereTag);

  const result = await repo.delete({});
  return result.affected;
};
