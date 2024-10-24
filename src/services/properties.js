import axios from "axios";

export const BASE_URL = "http://54.166.170.108:8080";
export const myAxios = axios.create({
  baseURL: BASE_URL,
});
