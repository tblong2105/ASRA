import axios from "axios";
import { getToken } from "./js-cookie";
import { openNotification } from "components/helper/Notification";
import { ERROR } from "../constants/Notification";
const http = axios.create({
  timeout: 1200000,
  baseURL:
    window.location.protocol +
    "//" +
    window.location.hostname +
    (process.env.REACT_APP_SERVER_PORT
      ? ":" + process.env.REACT_APP_SERVER_PORT
      : window.location.port
      ? ":" + window.location.port
      : "") +
    "/" +
    process.env.REACT_APP_BASE_API,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const get = (url: string, params: Object = {}) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, params)
      .then((obj) => {
        resolve(obj.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const post = (url: string, params: Object = {}) => {
  return new Promise((resolve, reject) => {
    http
      .post(url, params)
      .then((obj) => {
        resolve(obj.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

http.interceptors.request.use(
  (config) => {
    // Check exit token
    config.headers = {
      Authorization: "Bearer " + getToken(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 500 || error.status === 500) {
      openNotification(
        ERROR,
        error?.response?.data?.message?.messageDetail ||
          error?.response?.message ||
          error?.response?.data?.message ||
          error?.message
      );
    } else {
      openNotification(ERROR, error?.message);
    }
    return Promise.reject(error);
  }
);
