import axios from "axios";

import { baseUrl } from "../config";

export const axiosRequest = async (axiosRequest, urlPath) => {
  try {
    const response = await axiosRequest(`${baseUrl}/${urlPath}`);
    return response.data;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const fetchAllComposers = async () => {
  const composers = await axiosRequest(axios.get, "api/musician/composer");
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

  const concerts = await axiosRequest(axios.get, urlPath);
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

  const composers = await axiosRequest(axios.get, urlPath);
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

  const composers = await axiosRequest(axios.get, urlPath);
  return composers;
};

export const fetchSymphoniesByComposerId = async (composerId) => {
  let urlPath = `api/symphony/composer/${composerId}`;
  const symphonies = await axiosRequest(axios.get, urlPath);
  return symphonies;
};

export const fetchConcertsBySymphonyId = async (symphonyId) => {
  let urlPath = `api/concert/symphony/${symphonyId}`;
  const symphonies = await axiosRequest(axios.get, urlPath);
  return symphonies;
};

// http://localhost:4000/api/concert/ddb118b0-d4b6-42e4-8f0c-d315fa2e309a

export const fetchConcertById = async (concertId) => {
  let urlPath = `api/concert/${concertId}`;
  const symphonies = await axiosRequest(axios.get, urlPath);
  return symphonies;
};
