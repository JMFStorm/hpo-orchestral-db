import axios from "axios";

import { baseUrl } from "../config";

const UrlExtension = "api/musician/";
const requestUrl = baseUrl + UrlExtension;

const getAllConductors = async () => {
  try {
    const url = requestUrl + "conductor";
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const getAllComposers = async () => {
  try {
    const url = requestUrl + "composer";
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export { getAllConductors, getAllComposers };
