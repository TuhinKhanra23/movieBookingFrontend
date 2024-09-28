import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AddTheater from "./AddTheater";
import { addTheater } from "../services/movieService";
import { toast } from "react-toastify";
import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";

// Mocking dependencies
jest.mock("../services/movieService", () => ({
  addTheater: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("../components/loginComponents", () => ({
  isLoggedIn: jest.fn(() => true),
  fetchCurrentUser: jest.fn(() => ({ token: "mocked_token" })),
}));

describe("AddTheater Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isLoggedIn.mockReturnValue(true);
    fetchCurrentUser.mockReturnValue({ token: "mock-token" });
    jest.spyOn(toast, "warning").mockImplementation(() => {});
  });

  test("renders the AddTheater component", () => {
    render(
      <MemoryRouter>
        <AddTheater />
      </MemoryRouter>
    );
    expect(screen.getByText(/add theater here/i)).toBeInTheDocument();
  });

  test("shows error messages for invalid inputs", async () => {
    render(
      <MemoryRouter>
        <AddTheater />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /add theater/i }));

    expect(
      await screen.findByText(/theater name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/theater location is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/theater capacity is required/i)
    ).toBeInTheDocument();
  });

  test("successfully submits the form with valid data", async () => {
    render(
      <MemoryRouter>
        <AddTheater />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/theater name/i), {
      target: { value: "Awesome Theater" },
    });
    fireEvent.change(screen.getByLabelText(/theater location/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText(/theater capacity/i), {
      target: { value: 50 },
    });

    addTheater.mockResolvedValueOnce({ success: true });

    fireEvent.click(screen.getByRole("button", { name: /add theater/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Theater Added Successfully!");
    });

    expect(screen.getByLabelText(/theater name/i).value).toBe("");
  });

  test("shows error toast on API failure", async () => {
    render(
      <MemoryRouter>
        <AddTheater />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/theater name/i), {
      target: { value: "New Theater" },
    });
    fireEvent.change(screen.getByLabelText(/theater location/i), {
      target: { value: "Downtown" },
    });
    fireEvent.change(screen.getByLabelText(/theater capacity/i), {
      target: { value: "50" },
    });

    // Mock the API to reject the promise
    addTheater.mockRejectedValueOnce({
      response: { data: { errorMsg: "Error adding theater" } },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add theater/i }));

    // Wait for the warning toast
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Error adding theater");
    });
  });
});
