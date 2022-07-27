export const baseUrl =
  process.env.NODE_ENV === "production" ? process.env.REACT_APP_SERVER_URL_PROD : process.env.REACT_APP_SERVER_URL_DEV;

export const socketServerUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_SOCKET_SERVER_URL_PROD
    : process.env.REACT_APP_SOCKET_SERVER_URL_DEV;
