import axios from "axios";

import { baseUrl } from "../config";

console.log("baseUrl", baseUrl);

const UrlExtension = "/api/performance";
const url = baseUrl + UrlExtension;

const getPerformancesByCompositorId = async (compositorId) => {
  let Id = compositorId;

  try {
    const response = await axios.get(`${url}/compositor/${Id}`);
    console.log("response.data", response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getPerformancesByCompositorId };
