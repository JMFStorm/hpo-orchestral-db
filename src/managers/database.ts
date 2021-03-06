import { createQueryBuilder, getRepository } from "typeorm";

// Describe
// Assign names from array to to neme
// fields and add by repo
export const addEntitiesByName = async (names: string[], repoName: string) => {
  const repo = getRepository(repoName);

  const objects = names.map((x) => {
    return {
      name: x,
    };
  });

  const res = await repo.save(objects);
  return res.length;
};

// Describe
// Deletes all arrangers repo,
// returns deleted count
export const deleteAllFromRepo = async (repoName: string) => {
  const result = await createQueryBuilder().delete().from(repoName).execute();
  return result.affected;
};
