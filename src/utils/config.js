const postgres = "postgres";
const localhost = "localhost";
const development = "development";

const dbConfigDev = {
  type: postgres,
  host: localhost,
  port: process.env.DB_PORT_DEV,
  username: postgres,
  password: process.env.DB_PASSWORD_DEV,
  database: process.env.DB_NAME_DEV,
};

const getDbConfig = (env) => {
  switch (env) {
    case development:
      return dbConfigDev;
    default:
      throw "Invalid node environment";
  }
};

const getServerPort = (env) => {
  const serverPortDev = process.env.SERVER_PORT_DEV;

  switch (env) {
    case development:
      return serverPortDev;
    default:
      throw "Invalid node environment";
  }
};

const nodeEnvironment = process.env.NODE_ENV;

module.exports = {
  dbConfig: getDbConfig(nodeEnvironment),
  serverPort: getServerPort(nodeEnvironment),
  csvTestFilePath: process.env.CSV_TEST_FILE_PATH,
};
