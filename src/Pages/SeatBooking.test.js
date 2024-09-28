import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import SeatBooking from "./SeatBooking";
import {
  gettAllMovies,
  getTheater,
  bookSeats,
  fetchBookedTickets,
} from "../services/movieService";
import { fetchCurrentUser, isLoggedIn } from "../components/loginComponents";

jest.mock("../services/movieService", () => ({
  ...jest.requireActual("../services/movieService"),
  bookSeats: jest.fn(),
  gettAllMovies: jest.fn(),
  getTheater: jest.fn(),
  fetchBookedTickets: jest.fn(),
}));

jest.mock("../components/loginComponents", () => ({
  fetchCurrentUser: jest.fn(),
  isLoggedIn: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

describe("SeatBooking Component", () => {
  const mockMovies = [
    { movieId: 1, movieName: "Movie One" },
    { movieId: 2, movieName: "Movie Two" },
  ];

  const mockTheaters = [
    { theaterId: 1, theaterName: "Theater One" },
    { theaterId: 2, theaterName: "Theater Two" },
  ];

  const mockBookedTickets = ["Row 1-Seat 1", "Row 1-Seat 2"];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchCurrentUser.mockReturnValue({ token: "mock-token" });
    isLoggedIn.mockReturnValue(true);
    gettAllMovies.mockResolvedValue(mockMovies);
    getTheater.mockResolvedValue(mockTheaters);
    fetchBookedTickets.mockResolvedValue(mockBookedTickets);
  });

  test("renders SeatBooking component and fetches movies", async () => {
    render(
      <MemoryRouter>
        <SeatBooking />
      </MemoryRouter>
    );

    // Check if the movie selection is present
    await waitFor(() => {
      expect(screen.getByLabelText(/Movie/i)).toBeInTheDocument();
    });

    // Check if movies are listed
    expect(screen.getByText("Movie One")).toBeInTheDocument();
    expect(screen.getByText("Movie Two")).toBeInTheDocument();
  });

  test("fetches theaters when a movie is selected", async () => {
    render(
      <MemoryRouter>
        <SeatBooking />
      </MemoryRouter>
    );

    // Select a movie
    fireEvent.change(screen.getByLabelText(/Movie/i), {
      target: { value: "Movie One" },
    });

    // Wait for theaters to be populated
    await waitFor(() => {
      expect(screen.getByLabelText(/Theater/i)).toBeInTheDocument();
    });

    // Check if theaters are listed
    expect(screen.getByText("Theater One")).toBeInTheDocument();
    expect(screen.getByText("Theater Two")).toBeInTheDocument();
  });

  test("fetches booked seats when a theater is selected", async () => {
    render(
      <MemoryRouter>
        <SeatBooking />
      </MemoryRouter>
    );

    // Select a movie
    fireEvent.change(screen.getByLabelText(/Movie/i), {
      target: { value: "Movie One" },
    });

    // Select a theater
    fireEvent.change(screen.getByLabelText(/Theater/i), {
      target: { value: "Theater One" },
    });

    // Wait for booked seats to be fetched
    await waitFor(() => {
      expect(fetchBookedTickets).toHaveBeenCalledWith("");
    });

    // Assert booked seats are marked correctly
    // const seatElement = screen.getByText("B"); // Check for booked seat indicator
    // expect(seatElement).toBeInTheDocument();
  });

  test("books seats successfully", async () => {
    // Arrange: Set up the component
    render(
      <MemoryRouter>
        <SeatBooking />
      </MemoryRouter>
    );

    // Select a movie
    fireEvent.change(screen.getByLabelText(/Movie/i), {
      target: { value: "Movie One" },
    });

    // Select a theater
    fireEvent.change(screen.getByLabelText(/Theater/i), {
      target: { value: "Theater One" },
    });

    // Choose seats
    fireEvent.click(screen.getByRole("button", { name: /Choose Seats/i }));

    // Wait for the seats to be rendered
    await screen.findByText("Seat Booking");

    // Click on the first available seat
    const availableSeats = await screen.findAllByText("A");
    fireEvent.click(availableSeats[0]);

    // Book seats
    fireEvent.click(screen.getByRole("button", { name: /Book Seats/i }));

    // Assert the success toast is called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Seats booked successfully!");
    });

    // Check that the bookSeats function is called with the correct arguments
    expect(bookSeats).toHaveBeenCalledWith(
      expect.objectContaining({
        movieName: "",
        theaterName: "",
        seatNumber: ["Row 1-Seat 3"], // Should now include the booked seat
      }),
      "mock-token"
    );
  });

  // test("shows error message on booking failure", async () => {
  //   // Mock booking failure
  //   bookSeats.mockRejectedValue({
  //     response: { data: { errorMsg: "Booking error" } },
  //   });

  //   render(
  //     <MemoryRouter>
  //       <SeatBooking />
  //     </MemoryRouter>
  //   );

  //   // Select a movie
  //   fireEvent.change(screen.getByLabelText(/Movie/i), {
  //     target: { value: "Movie One" },
  //   });
  //   fireEvent.change(screen.getByLabelText(/Theater/i), {
  //     target: { value: "Theater One" },
  //   });

  //   // Choose a seat
  //   fireEvent.click(screen.getByText("A"));

  //   // Attempt to book seats
  //   fireEvent.click(screen.getByRole("button", { name: /Book Seats/i }));

  //   // Assert the error toast is called
  //   await waitFor(() => {
  //     expect(toast.warning).toHaveBeenCalledWith("Booking error");
  //   });
  // });
});
