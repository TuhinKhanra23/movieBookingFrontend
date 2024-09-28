import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookedTickets from "./BookedTickets"; // Adjust the path as necessary
import { fetchTickets } from "../services/user-service";
import { fetchCurrentUser } from "../components/loginComponents";
import { toast } from "react-toastify";

// Mocking the necessary functions
jest.mock("../services/user-service");
jest.mock("../components/loginComponents");

describe("BookedTickets Component", () => {
  const mockUser = { token: "mock-token" };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchCurrentUser.mockReturnValue(mockUser);
    jest.spyOn(toast, "warning").mockImplementation(() => {}); // Mock toast warning
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore(); // Restore original implementation after tests
  });
  test("fetches and displays booked tickets", async () => {
    const mockTickets = [
      {
        ticketId: 1,
        name: "John Doe",
        movieName: "Inception",
        theaterName: "Cineplex",
        theaterLoc: "Downtown",
        bookingDate: "2023-09-28",
        seatNumber: ["A1", "A2"],
      },
      {
        ticketId: 2,
        name: "Jane Doe",
        movieName: "Interstellar",
        theaterName: "Cineworld",
        theaterLoc: "Uptown",
        bookingDate: "2023-09-29",
        seatNumber: ["B1"],
      },
    ];

    fetchTickets.mockResolvedValueOnce(mockTickets);

    render(
      <MemoryRouter>
        <BookedTickets />
      </MemoryRouter>
    );

    // Wait for tickets to be displayed
    await waitFor(() => {
      expect(screen.getByText(/inception/i)).toBeInTheDocument();
      expect(screen.getByText(/cineplex/i)).toBeInTheDocument();
      expect(screen.getByText(/total tickets : 2/i)).toBeInTheDocument();
      expect(screen.getByText(/interstellar/i)).toBeInTheDocument();
      expect(screen.getByText(/cineworld/i)).toBeInTheDocument();
      expect(screen.getByText(/total tickets : 1/i)).toBeInTheDocument();
    });
  });

  test("shows warning toast when fetching tickets fails", async () => {
    const errorMessage = "Failed to fetch tickets";
    fetchTickets.mockRejectedValueOnce({
      response: { data: { errorMsg: errorMessage } },
    });

    render(
      <MemoryRouter>
        <BookedTickets />
      </MemoryRouter>
    );

    // Wait for the warning toast
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(errorMessage);
    });

    // Check if the error was logged correctly
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching booked tickets:",
      errorMessage
    );
  });

  test("displays message when no booked tickets are found", async () => {
    fetchTickets.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <BookedTickets />
      </MemoryRouter>
    );

    // Wait for the no tickets message
    await waitFor(() => {
      expect(screen.getByText(/no booked tickets found/i)).toBeInTheDocument();
    });
  });
});
