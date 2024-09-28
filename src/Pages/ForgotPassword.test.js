import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { toast } from "react-toastify";
import * as userService from "../services/user-service";

// Mock the toast function
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ForgotPassword Component", () => {
  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  it("renders without crashing", () => {
    renderWithRouter(<ForgotPassword />);
  });

  it("submits the form successfully", async () => {
    const mockForgetPassword = jest
      .spyOn(userService, "forgetPassword")
      .mockResolvedValueOnce({});

    renderWithRouter(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "testPassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockForgetPassword).toHaveBeenCalledWith({
        loginId: "testUser",
        newPassword: "testPassword123",
      });
      expect(toast.success).toHaveBeenCalledWith("Password Reset Successful!");
    });

    mockForgetPassword.mockRestore(); // Restore original implementation
  });

  it("handles error from the forgetPassword API", async () => {
    const mockForgetPassword = jest
      .spyOn(userService, "forgetPassword")
      .mockRejectedValueOnce({
        response: { data: { errorMsg: "Error message" } },
      });

    renderWithRouter(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "testPassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Error message");
    });

    mockForgetPassword.mockRestore(); // Restore original implementation
  });

  it("shows validation errors for missing fields", async () => {
    renderWithRouter(<ForgotPassword />);

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/loginid is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid loginId", async () => {
    renderWithRouter(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/loginid should contain at least 4 characters/i)
      ).toBeInTheDocument();
    });
  });

  // Optionally, you can test the reset functionality
  it("resets the form correctly", async () => {
    renderWithRouter(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "testPassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset/i }));

    expect(screen.getByLabelText(/user id/i).value).toBe("");
    expect(screen.getByLabelText(/new password/i).value).toBe("");
  });
});
