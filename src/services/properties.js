import axios from "axios";

export const BASE_URL = "http://34.228.189.67:8080";
export const myAxios = axios.create({
  baseURL: BASE_URL,
});
 