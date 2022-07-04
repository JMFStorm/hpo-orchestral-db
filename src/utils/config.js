require("dotenv").config();

const postgres = "postgres";
const localhost = "localhost";
const development = "development";
const production = "production";

const dbConfigDev = {
  type: postgres,
  host: localhost,
  port: process.env.DB_PORT_DEV,
  username: postgres,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
};

const dbConfigDemo = {
  url: process.env.DB_URI_DEMO,
  type: postgres,
  host: process.env.DB_PORT_HOST,
  port: process.env.DB_PORT_DEMO,
  username: process.env.DB_USER_DEMO,
  password: process.env.DB_PASSWORD_DEMO,
  database: process.env.DB_NAME_DEMO,
  ssl: {
    rejectUnauthorized: false,
  },
};

const getDbConfig = (env) => {
  switch (env) {
    case development:
      console.log("Using local database");
      return dbConfigDev;
    case production:
      console.log("Using server database");
      return dbConfigDemo;
    default:
      throw "Invalid node environment";
  }
};

const getServerPort = (env) => {
  const serverPortDev = process.env.SERVER_PORT_DEV || 4000;
  const serverPortDemo = process.env.PORT || 4000;

  switch (env) {
    case development:
      return serverPortDev;
    case production:
      return serverPortDemo;
    default:
      throw "Invalid node environment";
  }
};

const getCsvDirectoryPath = (env) => {
  const csvFileDirectoryDev = process.env.CSV_TEST_DIRECTORY_PATH;

  switch (env) {
    case development:
      return csvFileDirectoryDev;
    case production:
      return csvFileDirectoryDev;
    default:
      throw "Invalid node environment";
  }
};

const nodeEnvironment = process.env.NODE_ENV;

module.exports = {
  dbConfig: getDbConfig(nodeEnvironment),
  serverPort: getServerPort(nodeEnvironment),
  csvDirectoryPath: getCsvDirectoryPath(nodeEnvironment),
};
