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
import Performance from "../entities/Performance";
import PremiereTag from "../entities/PremiereTag";
import Composer from "../entities/Composer";
import Conductor from "../entities/Conductor";

const entitiesList = [
  Arranger,
  Conductor,
  Musician,
  Instrument,
  SoloistPerformance,
  Symphony,
  Orchestra,
  Location,
  Concert,
  ConcertTag,
  Performance,
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

const configProd: ConnectionOptions = {
  url: process.env.DB_URI_PROD,
  type: postgres,
  host: process.env.DB_PORT_PROD,
  port: Number(process.env.DB_PORT_PROD),
  username: process.env.DB_USER_PROD,
  password: process.env.DB_PASSWORD_PROD,
  database: process.env.DB_NAME_PROD,
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
      return configProd;
    default:
      throw "Invalid node environment";
  }
};

const nodeEnvironment = process.env.NODE_ENV;
const config = getDbConfig(nodeEnvironment);

// Database connection
export default createConnection(config);
