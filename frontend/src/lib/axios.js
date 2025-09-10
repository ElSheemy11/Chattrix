import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://8fc9d5d82857.ngrok-free.app/api",
  withCredentials: true,
});
