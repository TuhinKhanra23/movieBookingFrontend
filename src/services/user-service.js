import { myAxios } from "./properties";
import { mockLogin } from "./mocks/user-service";

export const signup = (user) => {
  return myAxios
    .post("/registerUser", user)
    .then((response) => response.data);
};

export const login = (user) => {
  // return mockLogin(user);
  return myAxios
    .get(
      `/login?loginId=${user.loginId}&password=${user.password}`
    )
    .then((response) => response.data);
};

export const forgetPassword = (user) => {
  return myAxios
    .post(
      `/forgot?loginId=${user.loginId}&newPassword=${user.newPassword}`
    )
    .then((response) => response.data);
};

export const fetchTickets = (loginId) => {
  return myAxios
    .get(`/showBookedTickets?userId=${loginId}`)
    .then((response) => response.data);
};

export const fetchAllTickets = () => {
  return myAxios
    .get("/showAllTickets")
    .then((response) => response.data);
};

export const deleteTicket = (ticketId, token) => {
  return myAxios
    .post(
      `/api/v1.0/moviebooking/deleteTicket?ticketId=${ticketId}&token=${token}`
    )
    .then((response) => response.data);
};
