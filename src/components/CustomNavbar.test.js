import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CustomNavbar from "./CustomNavbar";
import { doLogout, fetchCurrentUser, isLoggedIn } from "./loginComponents";
import { toast } from "react-toastify";

// Mocking dependencies
jest.mock("./loginComponents", () => ({
  doLogout: jest.fn(),
  fetchCurrentUser: jest.fn(),
  isLoggedIn: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("CustomNavbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navbar for logged out user", () => {
    isLoggedIn.mockReturnValue(false);

    render(
      <BrowserRouter>
        <CustomNavbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();
  });

  test("renders navbar for logged in user", () => {
    isLoggedIn.mockReturnValue(true);
    fetchCurrentUser.mockReturnValue({ name: "User", role: "user" });

    render(
      <BrowserRouter>
        <CustomNavbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Booked Tickets")).toBeInTheDocument();
    expect(screen.queryByText("Add Theater")).not.toBeInTheDocument();
  });

  test("renders navbar for logged in admin", () => {
    isLoggedIn.mockReturnValue(true);
    fetchCurrentUser.mockReturnValue({ name: "Admin", role: "Admin" });

    render(
      <BrowserRouter>
        <CustomNavbar />
      </BrowserRouter>
    );

    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("Add Theater")).toBeInTheDocument();
    expect(screen.getByText("Manage Movies")).toBeInTheDocument();
    expect(screen.getByText("Manage Tickets")).toBeInTheDocument();
  });

  test("handles logout functionality", () => {
    isLoggedIn.mockReturnValue(true);
    fetchCurrentUser.mockReturnValue({ name: "User", role: "user" });

    // Mocking doLogout to call the callback
    doLogout.mockImplementation((callback) => {
      callback(); // Call the callback to simulate successful logout
    });

    render(
      <BrowserRouter>
        <CustomNavbar />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(doLogout).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith("User Logged out.");
  });
});
