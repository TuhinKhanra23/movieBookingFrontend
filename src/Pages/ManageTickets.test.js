import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import ManageTickets from "./ManageTickets"; // Adjust the path as necessary
import { fetchAllTickets, deleteTicket } from "../services/user-service";
import { fetchCurrentUser, isLoggedIn } from "../components/loginComponents"; // Import isLoggedIn
import { toast } from "react-toastify";

// Mock the dependencies
jest.mock("../services/user-service", () => ({
  fetchAllTickets: jest.fn(),
  deleteTicket: jest.fn(),
}));

jest.mock("../components/loginComponents", () => ({
  fetchCurrentUser: jest.fn(),
  isLoggedIn: jest.fn(), // Mock isLoggedIn
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("ManageTickets Component", () => {
  const user = { token: "fake-token" };
  const tickets = [
    {
      ticketId: 1,
      name: "Ticket One",
      movieName: "Movie A",
      theaterName: "Theater A",
      theaterLoc: "Location A",
      bookingDate: new Date().toISOString(),
      seatNumber: ["A1", "A2"],
    },
    {
      ticketId: 2,
      name: "Ticket Two",
      movieName: "Movie B",
      theaterName: "Theater B",
      theaterLoc: "Location B",
      bookingDate: new Date().toISOString(),
      seatNumber: ["B1"],
    },
  ];

  beforeEach(() => {
    fetchCurrentUser.mockReturnValue(user);
    isLoggedIn.mockReturnValue(true); // Mock isLoggedIn to return true
    fetchAllTickets.mockResolvedValue(tickets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders tickets correctly", async () => {
    render(
      <MemoryRouter>
        <ManageTickets />
      </MemoryRouter>
    );

    // Wait for tickets to be rendered
    await waitFor(() => {
      expect(screen.getByText("Ticket One")).toBeInTheDocument();
      expect(screen.getByText("Ticket Two")).toBeInTheDocument();
    });
  });

  // test("handles delete ticket", async () => {
  //   deleteTicket.mockResolvedValue("Ticket deleted successfully");

  //   render(
  //     <MemoryRouter>
  //       <ManageTickets />
  //     </MemoryRouter>
  //   );

  //   // Wait for tickets to be rendered
  //   await waitFor(() => {
  //     expect(screen.getByText("Ticket One")).toBeInTheDocument();
  //   });

  //   // Click delete button
  //   fireEvent.click(screen.getByRole("button", { name: /delete/i }));

  //   // Assert that the success toast is called
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith("Ticket deleted successfully");
  //   });
  // });

  test("shows warning on fetch error", async () => {
    fetchAllTickets.mockRejectedValue(new Error("Fetch error"));

    render(
      <MemoryRouter>
        <ManageTickets />
      </MemoryRouter>
    );

    // Wait for the warning toast
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        "Session Expired !! Please Login Again"
      );
    });
  });

  test("shows warning on delete error", async () => {
    // Mock the deleteTicket function to reject with an error
    deleteTicket.mockRejectedValue(new Error("Delete error"));

    render(
      <MemoryRouter>
        <ManageTickets />
      </MemoryRouter>
    );

    // Wait for tickets to be rendered
    await waitFor(() => {
      expect(screen.getByText("Ticket One")).toBeInTheDocument();
    });

    // Click the delete button for the first ticket
    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);

    // Assert that the warning toast is called
    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith(
        "Session Expired !! Please Login Again"
      );
    });
  });

  test("shows message when no tickets are found", async () => {
    fetchAllTickets.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ManageTickets />
      </MemoryRouter>
    );

    // Wait for no tickets found message
    await waitFor(() => {
      expect(screen.getByText("No booked tickets found.")).toBeInTheDocument();
    });
  });
});
