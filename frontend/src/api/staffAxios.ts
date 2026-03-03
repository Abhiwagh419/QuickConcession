import axios from "axios";

export const staffAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

staffAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("staffToken");

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  return config;
});