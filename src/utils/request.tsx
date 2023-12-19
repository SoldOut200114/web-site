import axios from "axios";

const request = axios.create({
  timeout: 300000,
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default request;
