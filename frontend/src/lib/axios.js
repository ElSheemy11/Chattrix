import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://ed1fc1d275bf.ngrok-free.app/api"
      : "/api",
  withCredentials: true,
});
