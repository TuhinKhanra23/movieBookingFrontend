import {
  isLoggedIn,
  setLoginInfo,
  doLogout,
  fetchCurrentUser,
} from "./loginComponents"; // adjust the import path accordingly

describe("Auth Service", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("isLoggedIn", () => {
    it("should return false if there is no login data", () => {
      expect(isLoggedIn()).toBe(false);
    });

    it("should return true if there is login data", () => {
      localStorage.setItem("loginData", JSON.stringify({ name: "User" }));
      expect(isLoggedIn()).toBe(true);
    });
  });

  describe("setLoginInfo", () => {
    it("should set login data in localStorage and call next", () => {
      const nextMock = jest.fn();
      const data = { name: "User", role: "user" };

      setLoginInfo(data, nextMock);

      const storedData = localStorage.getItem("loginData");
      expect(storedData).toBe(JSON.stringify(data));
      expect(nextMock).toHaveBeenCalled();
    });
  });

  describe("doLogout", () => {
    it("should remove login data from localStorage and call next", () => {
      const nextMock = jest.fn();
      localStorage.setItem("loginData", JSON.stringify({ name: "User" }));

      doLogout(nextMock);

      expect(localStorage.getItem("loginData")).toBeNull();
      expect(nextMock).toHaveBeenCalled();
    });
  });

  describe("fetchCurrentUser", () => {
    it("should return undefined if user is not logged in", () => {
      expect(fetchCurrentUser()).toBeUndefined();
    });

    it("should return the current user if logged in", () => {
      const user = { name: "User", role: "user" };
      localStorage.setItem("loginData", JSON.stringify(user));

      expect(fetchCurrentUser()).toEqual(user);
    });
  });
});
