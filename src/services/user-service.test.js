// userService.test.js
import {
  signup,
  login,
  forgetPassword,
  fetchTickets,
  fetchAllTickets,
  deleteTicket,
} from "./user-service"; // Adjust the import based on your file structure
import { myAxios } from "./properties";

jest.mock("./properties", () => ({
  myAxios: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe("User Service API", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("signup makes a POST request and returns data", async () => {
    const user = { username: "testUser", password: "testPass" };
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await signup(user);
    expect(myAxios.post).toHaveBeenCalledWith(
      "/api/v1.0/moviebooking/register",
      user
    );
    expect(result).toEqual(mockResponse);
  });

  test("login makes a GET request and returns data", async () => {
    const user = { loginId: "testUser", password: "testPass" };
    const mockResponse = { success: true };

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await login(user);
    expect(myAxios.get).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/login?loginId=${user.loginId}&password=${user.password}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("forgetPassword makes a POST request and returns data", async () => {
    const user = { loginId: "testUser", newPassword: "newPass" };
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await forgetPassword(user);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/forgot?loginId=${user.loginId}&newPassword=${user.newPassword}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("fetchTickets makes a GET request and returns data", async () => {
    const token = "some-token";
    const mockResponse = [{ ticketId: 1, movieName: "Movie 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchTickets(token);
    expect(myAxios.get).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/showBookedTickets?token=${token}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("fetchAllTickets makes a GET request and returns data", async () => {
    const mockResponse = [{ ticketId: 1, movieName: "Movie 1" }];

    myAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await fetchAllTickets();
    expect(myAxios.get).toHaveBeenCalledWith(
      "/api/v1.0/moviebooking/showAllTickets"
    );
    expect(result).toEqual(mockResponse);
  });

  test("deleteTicket makes a POST request and returns data", async () => {
    const ticketId = 1;
    const token = "some-token";
    const mockResponse = { success: true };

    myAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await deleteTicket(ticketId, token);
    expect(myAxios.post).toHaveBeenCalledWith(
      `/api/v1.0/moviebooking/deleteTicket?ticketId=${ticketId}&token=${token}`
    );
    expect(result).toEqual(mockResponse);
  });
});
