import { getRepository, Any, Between, Like } from "typeorm";

import Performance from "../entities/Performance";
import ConcertObject from "../interfaces/ConcertObject";
import Concert from "../entities/Concert";
import ConcertTag from "../entities/ConcertTag";
import Location from "../entities/Location";
import Orchestra from "../entities/Orchestra";
import Musician from "../entities/Musician";
import { filterUniquesById, parseStringToDate } from "../utils/functions";
import Composer from "../entities/Composer";
import Conductor from "../entities/Conductor";

// Describe
// Add concerts to table
// returns saved count
export const addConcerts = async (concerts: ConcertObject[]) => {
  let result: any = [];

  let addedCount = 0;
  const concertCount = concerts.length;

  for (const concert of concerts) {
    if (addedCount % 500 == 0) {
      console.log(`Saving concerts: (${addedCount}/${concertCount})`);
    }

    const conductorRepo = getRepository(Conductor);
    const concertRepo = getRepository(Concert);
    const concertTagRepo = getRepository(ConcertTag);
    const locationRepo = getRepository(Location);
    const orchestraRepo = getRepository(Orchestra);

    let concertObject: Partial<Concert> = {};

    // Fill concert object fields
    concertObject.concert_id = concert.concert_id;
    concertObject.date = parseStringToDate(concert.date);
    concertObject.starting_time = concert.starting_time !== "" ? concert.starting_time : undefined;

    const getConductor = async (name?: string) => {
      if (!name) {
        return;
      }
      const result = await conductorRepo.findOne({ name: name });
      if (!result) {
        throw "Conductor " + name + " missing from conductors";
      }
      return result;
    };

    const conductorObjects: Conductor[] = [];

    // Add only from valid conductor names
    concert.conductors.forEach(
      async (x) =>
        await getConductor(x)
          .then((x) => (x ? conductorObjects.push(x) : null))
          .catch((err: Error) => {
            console.error(err);
          })
    );
    concertObject.conductors = conductorObjects;

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
// Expect date format: yyyy-mm-dd (1999-01-08)
export const getConcertsBySymphonyId = async (
  symphonyId: string,
  startDate: Date,
  endDate: Date
) => {
  const performanceRepo = getRepository(Performance);
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

  const start = startDate.toISOString();
  const end = endDate.toISOString();

  const concerts = await concertRepo.find({
    where: {
      id: Any(uniqueIds),
      date: Between(start, end),
    },
    relations: ["concert_tag", "conductors"],
    order: {
      date: "DESC",
    },
  });

  return concerts;
};

// Describe
// Get all concerts
export const getAllConcerts = async () => {
  const repo = getRepository(Concert);
  const result = await repo.find({
    relations: ["location", "orchestra", "concert_tag", "conductors"],
    order: {
      date: "DESC",
    },
  });
  return result;
};

// Describe
// Get concert by id
export const getConcertById = async (concertId: string) => {
  const repo = getRepository(Concert);

  const response = await repo.find({
    where: { id: concertId },
    relations: [
      "location",
      "orchestra",
      "concert_tag",
      "conductors",
      "performances",
      "performances.symphony",
      "performances.symphony.composers",
      "performances.arrangers",
      "performances.soloist_performances",
      "performances.soloist_performances.soloist",
      "performances.soloist_performances.instrument",
      "performances.premiere_tag",
    ],
    take: 1,
  });

  const result = response.length > 0 ? response[0] : undefined;

  return result;
};

// Describe
// Search concerts by composer, conductor and soloist name
export const searchConcertsByNames = async (
  composer?: string,
  conductor?: string,
  soloist?: string
) => {
  if (!composer && !conductor && !soloist) {
    return [];
  }

  let composerConcerts: Concert[] = [];
  let musicianConcerts: Concert[] = [];

  const composerRepo = getRepository(Composer);

  const composerResponse = await composerRepo.find({
    where: { name: Like(`%${composer}%`) },
    relations: ["symphonies", "symphonies.performances", "symphonies.performances.concert"],
  });

  composerConcerts = composerResponse
    .map((x) => x.symphonies.map((x) => x.performances.map((x) => x.concert)))
    .flat(2);

  const musicianRepo = getRepository(Musician);

  const musicianResponse = await musicianRepo.find({
    where: { name: Like(`%${soloist}%`) },
    relations: [
      "soloist_performances",
      "soloist_performances.performance",
      "soloist_performances.performance.concert",
    ],
  });

  musicianConcerts = musicianResponse
    .map((x) => x.soloist_performances.map((x) => x.performance))
    .flat(2)
    .map((x) => x.concert);

  const array = composerConcerts.concat(musicianConcerts);

  const resultArr = filterUniquesById(array);

  return resultArr;
};
