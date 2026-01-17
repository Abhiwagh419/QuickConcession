import axios from "axios";

export const staffAxios = axios.create({
  baseURL: "http://localhost:4000",
});

staffAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("staffToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
