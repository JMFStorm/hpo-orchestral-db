import axios from "axios";

import { baseUrl } from "../config";

console.log("baseUrl", baseUrl);

const UrlExtension = "/api/performance";
const url = baseUrl + UrlExtension;

const getPerformancesByCompositorId = async (compositorId) => {
  let Id = compositorId;

  Id = "a5ebf672-14d7-443e-9f4f-58087b454a55"; // Sibelius

  try {
    const response = await axios.get(`${url}/compositor/${Id}`);
    console.log("response.data", response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getPerformancesByCompositorId };
