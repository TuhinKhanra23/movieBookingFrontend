import axios from "axios";

export const BASE_URL = "http://localhost:3001";
export const myAxios = axios.create({
  baseURL: BASE_URL,
});
export const mockLogin = async (user) => {
  const userDetailsPromise = myAxios
    .get(`/users`)
    .then((response) => response.data);
  const userDetails = await userDetailsPromise;
  return userDetails.find(
    (userDetail) =>
      userDetail.loginId === user.loginId &&
      userDetail.password === user.password
  );
};
