// Signup.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Signup from "./Signup"; // Adjust the import path as necessary
import { signup } from "../services/user-service"; // Adjust the import path as necessary
import { toast } from "react-toastify";

// Mock the signup function and toast notifications
jest.mock("../services/user-service", () => ({
  signup: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("Signup Component", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("renders the signup form", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Login Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact No/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test("validates the form fields", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Attempt to submit the form without filling any fields
    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    // Check that the correct number of errors are shown
    expect(await screen.findAllByText(/is required/i)).toHaveLength(5);

    // Fill in invalid data for the "Login Id"
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "abc" },
    });
    fireEvent.change(screen.getByLabelText(/login id/i), {
      target: { value: "ab" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText(/Contact No/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "" },
    });

    // Attempt to submit again
    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    // Check for the specific error messages
    // expect(
    //   await screen.findByText(/Name should contain at least 4 characters/i)
    // ).toBeInTheDocument();
    // expect(
    //   await screen.findByText(/loginId should contain at least 4 characters/i)
    // ).toBeInTheDocument();
    // expect(
    //   await screen.findByText(/Invalid email format/i)
    // ).toBeInTheDocument();
    // expect(
    //   await screen.findByText(/Phone number must be 10 digits/i)
    // ).toBeInTheDocument();
    // expect(
    //   await screen.findByText((content) =>
    //     content.includes("should contain at least 4 characters")
    //   )
    // ).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Login Id/i), {
      target: { value: "johnny" },
    });
    fireEvent.change(screen.getByLabelText(/Contact No/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    signup.mockResolvedValueOnce({}); // Mock successful signup response

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "User Registered Sucessfully !!"
      );
      expect(signup).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        loginId: "johnny",
        contactNo: "1234567890",
        password: "password123",
      });
    });
  });

  test("handles signup errors", async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Login Id/i), {
      target: { value: "johnny" },
    });
    fireEvent.change(screen.getByLabelText(/Contact No/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    signup.mockRejectedValueOnce({
      response: { data: { errorMsg: "Signup failed" } },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign up/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Signup failed");
    });
  });

  test("resets form fields", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    expect(screen.getByLabelText(/Name/i).value).toBe("");
    expect(screen.getByLabelText(/Email/i).value).toBe("");
  });
});
