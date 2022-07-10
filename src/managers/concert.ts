import SymphonyPerformance from "../entities/SymphonyPerformance";
import ConcertObject from "../interfaces/ConcertObject";
import { getRepository, Any } from "typeorm";

import Concert from "../entities/Concert";
import ConcertTag from "../entities/ConcertTag";
import Location from "../entities/Location";
import Orchestra from "../entities/Orchestra";

// Describe
// Adds concerts to table
// returns saved count
export const addConcerts = async (concerts: ConcertObject[]) => {
  let result: any = [];

  let addedCount = 0;
  const concertCount = concerts.length;

  for (const concert of concerts) {
    if (addedCount % 25 == 0) {
      console.log(`Saving concerts: (${addedCount}/${concertCount})`);
    }

    const concertRepo = getRepository(Concert);
    const concertTagRepo = getRepository(ConcertTag);
    const locationRepo = getRepository(Location);
    const orchestraRepo = getRepository(Orchestra);

    let concertObject: Partial<Concert> = {};

    const parseDate = (date: string) => {
      const dateArr = date.split(".");
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    };

    // Fill concert object fields
    concertObject.concert_id = concert.concert_id;

    // Parse date and time
    // Recommended date: 1999-01-08 -> January 8, 1999
    concertObject.date = parseDate(concert.date);
    concertObject.starting_time = concert.starting_time !== "" ? concert.starting_time : undefined;

    // Fill fields from existing table rows
    await Promise.all([
      await concertTagRepo
        .findOne({ name: concert.concert_tag })
        .then((x) => (concertObject.concert_tag = x)),
      await locationRepo
        .findOne({ name: concert.location })
        .then((x) => (concertObject.location = x)),
      await orchestraRepo
        .findOne({ name: concert.orchestra })
        .then((x) => (concertObject.orchestra = x)),
    ]);

    // Save result
    result = await concertRepo.save(concertObject);
    addedCount++;
  }

  return result.length;
};

// Describe
// Adds concert tags to table from an array of names,
// returns saved count
export const addConcertTags = async (tagNames: string[]) => {
  const repo = getRepository(ConcertTag);

  const tagObjects = tagNames.map((x) => {
    return {
      name: x,
    };
  });

  const result = await repo.save(tagObjects);
  return result.length;
};

// Describe
// Search concerts by symphony id
export const getConcertsBySymphonyId = async (symphonyId: string) => {
  const performanceRepo = getRepository(SymphonyPerformance);
  const concertRepo = getRepository(Concert);

  const response = await performanceRepo.find({
    where: { symphony: { id: symphonyId } },
    relations: ["concert"],
  });

  const concertIds = response.map((x) => x.concert.id);

  // Filter array to uniques
  const uniqueIds = concertIds.filter(
    (current, index, self) => index === self.findIndex((x) => x === current)
  );

  const concerts = await concertRepo.find({
    where: { id: Any(uniqueIds) },
    relations: ["location", "orchestra", "concert_tag"],
    order: {
      date: "DESC",
    },
  });

  return concerts;
};

// Describe
// Deletes all concert tags from table,
// returns deleted count
export const deleteAllConcertTags = async () => {
  const repo = getRepository(ConcertTag);

  const result = await repo.delete({});
  return result.affected;
};
