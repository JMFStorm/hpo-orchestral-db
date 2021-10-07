const nodeEnvironment = process.env.NODE_ENV;

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

const serverPortDev = 3000;

const getDbConfig = () => {
  switch (nodeEnvironment) {
    case development:
      return dbConfigDev;
    default:
      throw "Invalid node environment";
  }
};

const getServerPort = () => {
  switch (nodeEnvironment) {
    case development:
      return serverPortDev;
    default:
      throw "Invalid node environment";
  }
};

module.exports = {
  dbConfig: getDbConfig(),
  serverPort: getServerPort(),
};
