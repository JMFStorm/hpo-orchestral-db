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
    require("../entities/SoloistPerformance"),
    require("../entities/Symphony"),
    require("../entities/Orchestra"),
    require("../entities/Location"),
    require("../entities/Concert"),
    require("../entities/ConcertTag"),
    require("../entities/ConcertPerformance"),
  ],
};

module.exports = typeorm.createConnection(connectionConfig);
