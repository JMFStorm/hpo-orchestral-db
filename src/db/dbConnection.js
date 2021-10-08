require("reflect-metadata");
require("dotenv").config();
const typeorm = require("typeorm");

const { dbConfig } = require("../utils/config");

const connectionConfig = {
  ...dbConfig,
  synchronize: true,
  entities: [require("../entities/Compositor")],
};

module.exports = typeorm.createConnection(connectionConfig);
