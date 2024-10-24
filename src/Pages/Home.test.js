import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { gettAllMovies, searchMoviesByName } from "../services/movieService";
import { toast } from "react-toastify";

// Mock the dependencies
jest.mock("../services/movieService", () => ({
  gettAllMovies: jest.fn(),
  searchMoviesByName: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", async () => {
    gettAllMovies.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    expect(
      screen.getByPlaceholderText(/search your movies here.../i)
    ).toBeInTheDocument();
  });

  test("fetches and displays all movies on load", async () => {
    const movies = [
      { movieId: 1, movieName: "Movie 1", releaseDate: "2023-10-01" },
      { movieId: 2, movieName: "Movie 2", releaseDate: "2023-10-15" },
    ];

    gettAllMovies.mockResolvedValueOnce(movies);

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/movie 1/i)).toBeInTheDocument();
      expect(screen.getByText(/movie 2/i)).toBeInTheDocument();
    });
  });

  test("handles error when fetching movies", async () => {
    gettAllMovies.mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(/error fetching movies. please try again./i)
      ).toBeInTheDocument();
    });
  });

  test("searches for a movie and displays results", async () => {
    const movies = [
      { movieId: 1, movieName: "Searched Movie", releaseDate: "2023-10-01" },
    ];
    searchMoviesByName.mockResolvedValueOnce(movies);

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    fireEvent.change(
      screen.getByPlaceholderText(/search your movies here.../i),
      {
        target: { value: "Searched Movie" },
      }
    );
    fireEvent.click(screen.getByTestId("search-button"));

    await waitFor(() => {
      expect(screen.getByText(/searched movie/i)).toBeInTheDocument();
    });
  });

  test("handles error when searching for a movie", async () => {
    searchMoviesByName.mockRejectedValueOnce(new Error("Search failed"));

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    fireEvent.change(
      screen.getByPlaceholderText(/search your movies here.../i),
      {
        target: { value: "Some Movie" },
      }
    );
    fireEvent.click(screen.getByTestId("search-button"));

    await waitFor(() => {
      expect(
        screen.getByText(/error searching for movie. please try again./i)
      ).toBeInTheDocument();
    });
  });

  test("disables the booking button for upcoming movies", async () => {
    gettAllMovies.mockResolvedValueOnce([
      {
        movieId: 1,
        movieName: "Upcoming Movie",
        releaseDate: "2024-09-29T09:03:49.559Z",
      },
    ]);

    await act(async () => {
      render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Upcoming Movie/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole("link", { name: /upcoming/i });

    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveClass("disabled");
  });
});
