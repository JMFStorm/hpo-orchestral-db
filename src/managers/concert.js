const { getRepository } = require("typeorm");

const Concert = require("../entities/Concert");
const ConcertTag = require("../entities/ConcertTag");
const Location = require("../entities/Location");
const Orchestra = require("../entities/Orchestra");

// Describe
// Adds concerts to table
// returns saved count
const addConcerts = async (concerts) => {
  let result = [];

  for (const concert of concerts) {
    const concertRepo = getRepository(Concert);
    const concertTagRepo = getRepository(ConcertTag);
    const locationRepo = getRepository(Location);
    const orchestraRepo = getRepository(Orchestra);

    let concertObject = {};

    const parseDate = (date) => {
      const dateArr = date.split(".");
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    };

    // Fill concert object fields
    concertObject.concert_id = concert.concert_id;

    // Parse date and time
    // Recommended date: 1999-01-08 -> January 8, 1999
    concertObject.date = parseDate(concert.date);
    concertObject.starting_time = concert.starting_time === "" ? null : concert.starting_time;

    // Fill fields from existing table rows
    concertObject.concert_tag = await concertTagRepo.findOne({ name: concert.concert_tag });
    concertObject.location = await locationRepo.findOne({ name: concert.location });
    concertObject.orchestra = await orchestraRepo.findOne({ name: concert.orchestra });

    // Save result
    result = await concertRepo.save(concertObject);
  }

  return result.length;
};

// Describe
// Adds concert tags to table from an array of names,
// returns saved count
const addConcertTags = async (tagNames) => {
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
// Deletes all concert tags from table,
// returns deleted count
const deleteAllConcertTags = async () => {
  const repo = getRepository(ConcertTag);

  const result = await repo.delete({});
  return result.affected;
};

module.exports = {
  addConcerts,
  addConcertTags,
  deleteAllConcertTags,
};
