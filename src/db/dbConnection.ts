require("reflect-metadata");
require("dotenv").config();

import { Environment } from "src/utils/config";
import { ConnectionOptions, createConnection } from "typeorm";

const postgres = "postgres";
const localhost = "localhost";

const entitiesList = [
  require("../entities/Arrangers"),
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
];

const configDev: ConnectionOptions = {
  type: postgres,
  host: localhost,
  port: Number(process.env.DB_PORT_DEV),
  username: postgres,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
  synchronize: true,
  entities: entitiesList,
};

const configDemo: ConnectionOptions = {
  url: process.env.DB_URI_DEMO,
  type: postgres,
  host: process.env.DB_PORT_HOST,
  port: Number(process.env.DB_PORT_DEMO),
  username: process.env.DB_USER_DEMO,
  password: process.env.DB_PASSWORD_DEMO,
  database: process.env.DB_NAME_DEMO,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  entities: entitiesList,
};

const getDbConfig = (env: Environment) => {
  switch (env) {
    case "development":
      return configDev;
    case "production":
      return configDemo;
    default:
      throw "Invalid node environment";
  }
};

const nodeEnvironment = process.env.NODE_ENV;
const config = getDbConfig(nodeEnvironment);

// Database connection
export default createConnection(config);
