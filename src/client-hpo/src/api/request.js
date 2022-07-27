import axios from "axios";

import { baseUrl } from "../config";

const get = async (urlPath) => {
  let result, error;
  try {
    const response = await axios.get(`${baseUrl}${urlPath}`);
    result = response.data;
  } catch (err) {
    console.error(err.response.data);
    error = err.response.data;
  }
  return { result, error };
};

const post = async (urlPath, data, configOverride) => {
  let result, error;
  try {
    const config = configOverride ?? {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(`${baseUrl}${urlPath}`, data ?? {}, config);
    result = response.data;
  } catch (err) {
    console.error(err.response.data);
    error = err.response.data;
  }
  return { result, error };
};

export const fetchAllComposers = async () => {
  const { result, error } = await get("api/musician/composer");
  return { result, error };
};

export const fetchAllPremiereTags = async () => {
  const { result, error } = await get("api/performance/premieretag");
  return { result, error };
};

export const fetchConcertsCombinationSearch = async (conductor, composer, soloist, startDateString, endDateString) => {
  let urlPath = `api/concert/combination/search?start=${startDateString}&end=${endDateString}`;

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

export const fetchPremieresByComposer = async (composerId) => {
  const urlPath = `api/performance/premiere/composer/${composerId}`;
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

  const { result, error } = await get(urlPath);
  return { result, error };
};

export const fetchSymphoniesByComposerId = async (composerId) => {
  const urlPath = `api/symphony/composer/${composerId}`;
  const { result, error } = await get(urlPath);
  return { result, error };
};

export const fetchConcertsBySymphonyId = async (symphonyId) => {
  const urlPath = `api/concert/symphony/${symphonyId}`;
  const { result, error } = await get(urlPath);
  return { result, error };
};

export const fetchConcertById = async (concertId) => {
  const urlPath = `api/concert/${concertId}`;
  const { result, error } = await get(urlPath);
  return { result, error };
};

export const uploadCsvData = async (csvData, token) => {
  const urlPath = `api/database/seed`;
  const body = { csvRows: csvData };
  const config = {
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
  };
  const result = await post(urlPath, body, config);
  return result;
};

export const loginUser = async (password) => {
  const urlPath = "api/login";
  const body = { password: password };
  const { result, error } = await post(urlPath, body);
  return { result, error };
};
