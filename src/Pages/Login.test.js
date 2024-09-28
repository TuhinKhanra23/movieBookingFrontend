// Login.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import Login from "./Login"; // Adjust the import according to your structure
import { login } from "../services/user-service";
import { isLoggedIn, setLoginInfo } from "../components/loginComponents";
import { MemoryRouter } from "react-router-dom";

// Mocking dependencies
jest.mock("../services/user-service");
jest.mock("../components/loginComponents");

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/User Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log in/i })).toBeInTheDocument();
  });

  it("displays error message when loginId is empty", async () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/LoginId is required/i)).toBeInTheDocument();
    });
  });

  it("displays error message when password is empty", async () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/User Id/i), {
      target: { value: "user" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it("displays error message for short loginId", async () => {
    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/User Id/i), {
      target: { value: "usr" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/loginId should contain at least 4 characters!/i)
      ).toBeInTheDocument();
    });
  });

  it("calls login function and navigates on successful login", async () => {
    isLoggedIn.mockReturnValue(false);
    setLoginInfo.mockImplementation((user, callback) => callback());
    login.mockResolvedValue({ token: "testToken" });

    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/User Id/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        loginId: "user",
        password: "password",
      });
      expect(setLoginInfo).toHaveBeenCalled();
    });
  });

  it("displays error message on failed login", async () => {
    login.mockRejectedValue({
      response: { data: { errorMsg: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <Login />
        <ToastContainer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/User Id/i), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
