import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import AddMovie from "./AddMovie";
import { addmovie } from "../services/movieService";
import { toast } from "react-toastify";

// Mock the movieService and toast
jest.mock("../services/movieService", () => ({
  addmovie: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock login components
jest.mock("../components/loginComponents", () => ({
  isLoggedIn: jest.fn(),
  fetchCurrentUser: jest.fn(),
}));

import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";

describe("AddMovie Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks before each test
    // Mock user data
    fetchCurrentUser.mockReturnValue({ token: "mocked_token" });
    isLoggedIn.mockReturnValue(true);
  });

  test("renders the AddMovie component", () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );
    expect(screen.getByText(/add movie here/i)).toBeInTheDocument();
  });

  test("shows error messages for invalid inputs", async () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );

    // Submit the form without filling it
    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    // Check for error messages
    expect(
      await screen.findByText(/movie name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/movie release date is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/movie theater list is required/i)
    ).toBeInTheDocument();
  });

  test("successfully submits the form with valid data", async () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/movie name/i), {
      target: { value: "Inception" },
    });
    fireEvent.change(screen.getByLabelText(/movie release date/i), {
      target: { value: "2023-09-28" },
    });
    fireEvent.change(screen.getByLabelText(/theater list/i), {
      target: { value: "Theater 1" },
    });

    // Mock the API response
    addmovie.mockResolvedValueOnce({ success: true });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    // Wait for the success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("movie Added Successfully!!");
    });

    // Check if the form resets
    expect(screen.getByLabelText(/movie name/i).value).toBe("");
  });

  test("shows error toast on API failure", async () => {
    render(
      <MemoryRouter>
        <AddMovie />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/movie name/i), {
      target: { value: "Inception" },
    });
    fireEvent.change(screen.getByLabelText(/movie release date/i), {
      target: { value: "2023-09-28" },
    });
    fireEvent.change(screen.getByLabelText(/theater list/i), {
      target: { value: "Theater 1" },
    });

    // Mock the API to reject the promise
    addmovie.mockRejectedValueOnce({
      response: { data: { errorMsg: "Error adding movie" } },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add movie/i }));

    // Wait for the warning toast
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Error adding movie");
    });
  });
});
