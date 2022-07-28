import { getRepository, Any, Between, MoreThanOrEqual, ILike } from "typeorm";

import Performance from "../entities/Performance";
import ConcertObject from "../interfaces/ConcertObject";
import Concert from "../entities/Concert";
import ConcertTag from "../entities/ConcertTag";
import Location from "../entities/Location";
import Orchestra from "../entities/Orchestra";
import Musician from "../entities/Musician";
import { filterUniquesById, findStringArrayMatch, parseStringToDate } from "../utils/functions";
import Composer from "../entities/Composer";
import Conductor from "../entities/Conductor";
import { seedLog } from "../socket";

// Describe
// Add concerts to table
// returns saved count
export const addConcerts = async (concerts: ConcertObject[]) => {
  const concertCount = concerts.length;
  const numeralPart = Math.floor(concertCount / 20);
  let result: any = [];
  let addedCount = 0;

  for (const concert of concerts) {
    if (addedCount % numeralPart == 0) {
      seedLog(`Saving concerts: (${addedCount}/${concertCount})`, "concerts");
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
    concertObject.archive_info = concert.archive_info;
    concertObject.footnote = concert.footnote;

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
    // Add only from valid conductor names
    const conductorObjects: Conductor[] = [];
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
      await concertTagRepo.findOne({ name: concert.concert_tag }).then((x) => (concertObject.concert_tag = x)),
      await locationRepo.findOne({ name: concert.location }).then((x) => (concertObject.location = x)),
      await orchestraRepo.findOne({ name: concert.orchestra }).then((x) => (concertObject.orchestra = x)),
    ]);
    // Save result
    result = await concertRepo.save(concertObject);
    addedCount++;
  }
  seedLog(`Saved concerts: (${addedCount}/${concertCount})`, "concerts");
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
export const getConcertsBySymphonyId = async (symphonyId: string, startDate: Date, endDate: Date) => {
  const performanceRepo = getRepository(Performance);
  const concertRepo = getRepository(Concert);

  const response = await performanceRepo.find({
    where: { symphony: { id: symphonyId } },
    relations: ["concert"],
  });
  const concertIds = response.map((x) => x.concert.id);
  const uniqueIds = concertIds.filter((current, index, self) => index === self.findIndex((x) => x === current));

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
      "performances.symphony.arrangers",
      "performances.symphony.composers",
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
  startDate: Date,
  composer?: string,
  conductor?: string,
  soloist?: string,
  chunkIndex: number = 0
) => {
  let composerConcerts: Concert[] = [];
  let musicianConcerts: Concert[] = [];
  let conductorConcerts: Concert[] = [];

  if (Number.isNaN(chunkIndex)) {
    chunkIndex = 0;
  }

  const start = startDate.toDateString();

  if (composer) {
    const composerRepo = getRepository(Composer);
    const composerResponse = await composerRepo.find({
      where: { name: ILike(`%${composer}%`) },
      relations: ["symphonies", "symphonies.performances", "symphonies.performances.concert"],
    });
    composerConcerts = composerResponse
      .map((x) => x.symphonies.map((x) => x.performances.map((x) => x.concert)))
      .flat(2);
  }

  if (soloist) {
    const musicianRepo = getRepository(Musician);
    const musicianResponse = await musicianRepo.find({
      where: { name: ILike(`%${soloist}%`) },
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
  }

  if (conductor) {
    const conductorRepo = getRepository(Conductor);
    const conductorResponse = await conductorRepo.find({
      where: { name: ILike(`%${conductor}%`) },
      relations: ["concerts"],
    });
    conductorConcerts = conductorResponse.map((x) => x.concerts).flat(1);
  }

  const chunk = 100;
  const skipAmount = chunk * chunkIndex;
  const array = composerConcerts.concat(musicianConcerts).concat(conductorConcerts);

  const queryList = filterUniquesById(array).map((x) => ({
    id: x.id,
    date: MoreThanOrEqual(start),
  }));
  const whereQuery =
    queryList.length === 0
      ? {
          date: MoreThanOrEqual(start),
        }
      : queryList;

  const concertRepo = getRepository(Concert);
  const concertsResponse = await concertRepo.find({
    where: whereQuery,
    relations: [
      "conductors",
      "concert_tag",
      "performances",
      "performances.soloist_performances",
      "performances.soloist_performances.soloist",
      "performances.symphony",
      "performances.symphony.arrangers",
      "performances.symphony.composers",
    ],
    order: {
      date: "ASC",
    },
    take: chunk,
    skip: skipAmount,
  });

  const filterComposers = composer
    ? (concert: Concert) =>
        findStringArrayMatch(
          concert.performances
            .map((x) => x.symphony.composers)
            .flat()
            .map((x) => x.name),
          composer,
          true
        )
    : (x: Concert) => x;
  const filterConductors = conductor
    ? (concert: Concert) =>
        findStringArrayMatch(
          concert.conductors.map((x) => x.name),
          conductor,
          true
        )
    : (x: Concert) => x;
  const filterSoloists = soloist
    ? (concert: Concert) =>
        findStringArrayMatch(
          concert.performances
            .map((x) => x.soloist_performances)
            .flat()
            .map((x) => x.soloist)
            .map((x) => x.name),
          soloist,
          true
        )
    : (x: Concert) => x;

  const results = concertsResponse
    .filter((concert) => filterComposers(concert) && filterConductors(concert) && filterSoloists(concert))
    .flat(1);

  const mapped: Partial<Concert>[] = results.map((x) => ({
    concert_id: x.concert_id,
    concert_tag: x.concert_tag,
    conductors: x.conductors,
    id: x.id,
    starting_time: x.starting_time,
    date: x.date,
  }));
  return mapped;
};
