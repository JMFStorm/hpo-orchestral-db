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
    require("../entities/Symphony"),
    require("../entities/SymphonyName"),
    require("../entities/Orchestra"),
  ],
};

module.exports = typeorm.createConnection(connectionConfig);
