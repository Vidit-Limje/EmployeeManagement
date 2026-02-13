import axios from "axios";

export const api = axios.create({
  baseURL: "https://employeemanagement-vksl.onrender.com",
});
