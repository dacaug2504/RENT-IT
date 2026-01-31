import axios from "axios";
import { store } from "../app/store";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
