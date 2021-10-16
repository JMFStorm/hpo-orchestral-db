import axios from "axios";

import { baseUrl } from "../config";

const UrlExtension = "/api/performance";
const requestUrl = baseUrl + UrlExtension;

const getPerformancesByCompositorId = async (compositorId) => {
  let Id = compositorId;

  try {
    const response = await axios.get(`${requestUrl}/compositor/${Id}`);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getPerformancesBySearchParams = async (searchParams) => {
  try {
    const { compositorId, conductorId } = searchParams;

    if (!compositorId && !conductorId) {
      return [];
    }

    const url =
      `${requestUrl}/search?` +
      `${compositorId ? `compositorId=${compositorId}` : ""}` +
      `${Object.keys(searchParams).length > 1 ? "&" : ""}` +
      `${conductorId ? `conductorId=${conductorId}` : ""}`;

    const response = await axios.get(url);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getPerformancesByCompositorId, getPerformancesBySearchParams };
