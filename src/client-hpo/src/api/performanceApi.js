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
      `${compositorId?.length > 0 ? `compositorId=${compositorId}` : ""}` +
      `${Object.keys(searchParams).length > 1 ? "&" : ""}` +
      `${conductorId?.length > 0 ? `conductorId=${conductorId}` : ""}`;

    const response = await axios.get(url);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getPerformancesByCompositorId, getPerformancesBySearchParams };
