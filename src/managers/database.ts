import { getRepository } from "typeorm";

// Describe
// Assign names from array to to neme
// fields and add by repo
export const addEntitiesByName = async (names: string[], repoName: string) => {
  const repo = getRepository(repoName);

  const objects = names.map((x) => {
    return {
      names: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all arrangers repo,
// returns deleted count
export const deleteAllFromRepo = async (repoName: string) => {
  const repo = getRepository(repoName);

  const result = await repo.delete({});
  return result.affected;
};
