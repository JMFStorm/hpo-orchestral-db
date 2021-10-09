require("reflect-metadata");
require("dotenv").config();
const typeorm = require("typeorm");

const { dbConfig } = require("../utils/config");

const connectionConfig = {
  ...dbConfig,
  synchronize: true,
  entities: [
    require("../entities/Musician"),
    require("../entities/Instrument"),
    require("../entities/InstrumentSession"),
  ],
};

module.exports = typeorm.createConnection(connectionConfig);
