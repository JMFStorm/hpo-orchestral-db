const { getRepository } = require("typeorm");

const instrument = require("../entities/Instrument");

const getAllInstruments = async () => {
  const instruments = await getRepository(instrument).find();
  return instruments;
};

module.exports = {
  getAllInstruments,
};
