import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:"https://dreamscape-server.onrender.com/api/",
  withCredentials: true,
});
