import { myAxios } from "./properties";
import { mockLogin } from "./mocks/user-service";

export const signup = (user) => {
  return myAxios
    .post("/api/v1.0/moviebooking/register", user)
    .then((response) => response.data);
};

export const login = (user) => {
  // return mockLogin(user);
  return myAxios
    .get(
      `/api/v1.0/moviebooking/login?loginId=${user.loginId}&password=${user.password}`
    )
    .then((response) => response.data);
};

export const forgetPassword = (user) => {
  return myAxios
    .post(
      `/api/v1.0/moviebooking/forgot?loginId=${user.loginId}&newPassword=${user.newPassword}`
    )
    .then((response) => response.data);
};

export const fetchTickets = (token) => {
  return myAxios
    .get(`/api/v1.0/moviebooking/showBookedTickets?token=${token}`)
    .then((response) => response.data);
};

export const fetchAllTickets = () => {
  return myAxios
    .get("/api/v1.0/moviebooking/showAllTickets")
    .then((response) => response.data);
};

export const deleteTicket = (ticketId, token) => {
  return myAxios
    .post(
      `/api/v1.0/moviebooking/deleteTicket?ticketId=${ticketId}&token=${token}`
    )
    .then((response) => response.data);
};
