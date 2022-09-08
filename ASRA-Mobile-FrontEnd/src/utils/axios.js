import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const PRODUCTION_BASE_URL = "14.225.254.106";
const DEVELOPMENT_BASE_URL = "localhost";
const http = axios.create({
  timeout: 1200000,
  baseURL: `http://${PRODUCTION_BASE_URL}:8080/api`,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, params)
      .then((obj) => {
        resolve(obj.data);
      })
      .catch((err) => {
        // reject(err);
      });
  });
};

export const post = (url, params) => {
  return new Promise((resolve, reject) => {
    http
      .post(url, params)
      .then((obj) => {
        resolve(obj.data);
      })
      .catch((err) => {
        // reject(err);
      });
  });
};

http.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("ASRA");
    // Check exit token
    config.headers = {
      Authorization: "Bearer " + token,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 500) {
      alert(
        error.response.data.message.messageDetail ||
          error.response.message ||
          error.response.data.message
      );
    } else {
      alert(error.message);
      s;
    }
    return Promise.reject(error);
  }
);
