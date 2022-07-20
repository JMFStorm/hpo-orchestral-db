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

export const fetchConcertsCombinationSearch = async (
  startDate,
  endDate,
  composer,
  soloist,
  conductor
) => {
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

// http://localhost:4000/api/performance/composer/8b28beeb-bbca-4cca-be90-52ed1e183b04?premieretagid=78707c23-a68c-4cea-a78e-c3768f27dea9

export const fetchPerformancesByComposerIdAndPremiereTag = async (
  composerId,
  premiereTagIdsArray
) => {
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
