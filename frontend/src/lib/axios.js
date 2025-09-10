import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ed1fc1d275bf.ngrok-free.app/api",
  withCredentials: true,
});
