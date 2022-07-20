import axios from "axios";

import { baseUrl } from "../config";

const get = async (urlPath) => {
  try {
    const response = await axios.get(`${baseUrl}/${urlPath}`);
    return response.data;
  } catch (err) {
    console.log(err.response.data);
    return undefined;
  }
};

const post = async (urlPath, data) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("data", data);
    const response = await axios.post(`${baseUrl}/${urlPath}`, data ?? {}, config);
    return response.data;
  } catch (err) {
    console.log(err.response.data);
    return undefined;
  }
};

export const fetchAllComposers = async () => {
  const composers = await get("api/musician/composer");
  return composers;
};

export const fetchConcertsCombinationSearch = async (startDate, endDate, composer, soloist, conductor) => {
  const start = startDate ?? "1800-01-01";
  const end = endDate ?? "2023-01-01";
  let urlPath = `api/concert/combination/search?start=${start}&end=${end}`;

  if (composer) {
    urlPath = urlPath.concat(`&composer=${composer}`);
  }
  if (soloist) {
    urlPath = urlPath.concat(`&soloist=${soloist}`);
  }
  if (conductor) {
    urlPath = urlPath.concat(`&conductor=${conductor}`);
  }

  const concerts = await get(urlPath);
  return concerts;
};

export const fetchPerformancesByComposerIdAndPremiereTag = async (composerId, premiereTagIdsArray) => {
  let urlPath = `api/performance/composer/${composerId}`;

  urlPath = urlPath.concat("?");

  for (let i = 0; i < premiereTagIdsArray.length; i++) {
    if (0 < i) {
      urlPath = urlPath.concat("&");
    }
    urlPath = urlPath.concat(`premieretagid=${premiereTagIdsArray[i]}`);
  }

  const composers = await get(urlPath);
  return composers;
};

export const fetchComposersByStartingLetters = async (lettersArray) => {
  let urlPath = `api/musician/composer/lettersearch`;

  urlPath = urlPath.concat("?");

  for (let i = 0; i < lettersArray.length; i++) {
    if (0 < i) {
      urlPath = urlPath.concat("&");
    }
    urlPath = urlPath.concat(`char=${lettersArray[i][0]}`);
  }

  const composers = await get(urlPath);
  return composers;
};

export const fetchSymphoniesByComposerId = async (composerId) => {
  const urlPath = `api/symphony/composer/${composerId}`;
  const symphonies = await get(urlPath);
  return symphonies;
};

export const fetchConcertsBySymphonyId = async (symphonyId) => {
  const urlPath = `api/concert/symphony/${symphonyId}`;
  const symphonies = await get(urlPath);
  return symphonies;
};

export const fetchConcertById = async (concertId) => {
  const urlPath = `api/concert/${concertId}`;
  const symphonies = await get(urlPath);
  return symphonies;
};

export const uploadCsvData = async (csvData) => {
  const urlPath = `api/database/seed`;
  const body = { csvRows: csvData };
  const result = await post(urlPath, body);
  return result;
};
