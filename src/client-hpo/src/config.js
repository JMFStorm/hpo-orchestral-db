export const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_SERVER_URL_DEMO
    : process.env.REACT_APP_SERVER_URL_DEV;
