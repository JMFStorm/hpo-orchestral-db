require("reflect-metadata");
require("dotenv").config();

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
    require("../entities/SymphonyPerformance"),
    require("../entities/PremiereTag"),
  ],
};

module.exports = { connectionConfig };
