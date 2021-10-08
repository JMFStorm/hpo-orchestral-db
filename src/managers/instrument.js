const { getRepository } = require("typeorm");

const instrument = require("../entities/Compositor");

const getAllInstruments = async () => {
  const instruments = await getRepository(instrument).find();
  return instruments;
};

module.exports = {
  getAllInstruments,
};
