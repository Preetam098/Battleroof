import axios from "axios";

export const API_POST = axios.interceptors.response.use(
  (res) => {
    // Add configurations here
    if (res.status === 201) {
    }
    return res;
  },
  (err) => {
    return Promise.reject(err);
  }
);
