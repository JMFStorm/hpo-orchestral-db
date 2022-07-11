require("reflect-metadata");
require("dotenv").config();

import { Environment } from "src/utils/config";
import { ConnectionOptions, createConnection } from "typeorm";

const postgres = "postgres";
const localhost = "localhost";

import Musician from "../entities/Musician";
import Arranger from "../entities/Arranger";
import Instrument from "../entities/Instrument";
import SoloistPerformance from "../entities/SoloistPerformance";
import Symphony from "../entities/Symphony";
import Orchestra from "../entities/Orchestra";
import Location from "../entities/Location";
import Concert from "../entities/Concert";
import ConcertTag from "../entities/ConcertTag";
import SymphonyPerformance from "../entities/SymphonyPerformance";
import PremiereTag from "../entities/PremiereTag";
import Composer from "../entities/Composer";

const entitiesList = [
  Arranger,
  Musician,
  Instrument,
  SoloistPerformance,
  Symphony,
  Orchestra,
  Location,
  Concert,
  ConcertTag,
  SymphonyPerformance,
  PremiereTag,
  Composer,
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
