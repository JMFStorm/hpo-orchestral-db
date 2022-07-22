require("dotenv").config();

import PremiereTagConfig from "src/interfaces/PremiereTagConfig";

export type Environment = string | undefined;

const getServerPort = (env: Environment) => {
  const serverPortDev = process.env.SERVER_PORT_DEV || 4000;
  const serverPortProd = process.env.PORT || 4000;

  switch (env) {
    case "development":
      return serverPortDev;
    case "production":
      return serverPortProd;
    default:
      throw "Invalid node environment";
  }
};

const getCsvDirectoryPath = (env: Environment) => {
  const csvFileDirectoryDev = process.env.CSV_TEST_DIRECTORY_PATH;

  switch (env) {
    case "development":
      return csvFileDirectoryDev;
    case "production":
      return csvFileDirectoryDev;
    default:
      throw "Invalid node environment";
  }
};

export const premiereTags: PremiereTagConfig[] = [
  {
    regex: /\(ke.\)/,
    sqlName: "premiere",
  },
  {
    regex: /\(ekS\)/,
    sqlName: "premiere_in_finland",
  },
  {
    regex: /\(ke. ork.versio\)/,
    sqlName: "premiere_for_orchestra",
  },
  {
    regex: /\(ke. sov.\/ork.\)/,
    sqlName: "premiere_for_arranger_and_orchestra",
  },
  {
    regex: /\(tanssiversion ensiesitys\)/,
    sqlName: "premiere_for_dance",
  },
  {
    regex: /\(ek. konsertissa\)/,
    sqlName: "premiere_in_concert",
  },
  {
    regex: /\(ek Eurooppa.\)/,
    sqlName: "premiere_in_europe",
  },
  {
    regex: /\(ke. 2.versio\)/,
    sqlName: "premiere_for_second_version",
  },
  {
    regex: /\(ke. lopullinen versio\)/,
    sqlName: "premiere_for_final_version",
  },
  {
    regex: /\(ke. 2.sanat\)/,
    sqlName: "premiere_for_secondary_lyrics",
  },
  {
    regex: /\(ylimääräinen\)/,
    sqlName: "encore",
  },
];

const nodeEnvironment = process.env.NODE_ENV;

export const serverPort = getServerPort(nodeEnvironment);
export const csvDirectoryPath = getCsvDirectoryPath(nodeEnvironment);
