import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ManageMovies from "./ManageMovies";
import { gettAllMovies, deleteMovieById } from "../services/movieService";
import { isLoggedIn, fetchCurrentUser } from "../components/loginComponents";
import { toast } from "react-toastify";

jest.mock("../services/movieService");
jest.mock("../components/loginComponents");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ManageMovies Component", () => {
  const moviesMock = [
    { movieId: 1, movieName: "Movie One", releaseDate: "2024-01-01" },
    { movieId: 2, movieName: "Movie Two", releaseDate: "2024-02-01" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    isLoggedIn.mockReturnValue(true);
    fetchCurrentUser.mockReturnValue({ token: "mockToken" });
    gettAllMovies.mockResolvedValue(moviesMock);
  });

  test("renders movies on load", async () => {
    render(
      <MemoryRouter>
        <ManageMovies />
      </MemoryRouter>
    );

    expect(await screen.findByText("Movie One")).toBeInTheDocument();
    expect(await screen.findByText("Movie Two")).toBeInTheDocument();
  });

  test("deletes a movie", async () => {
    render(
      <MemoryRouter>
        <ManageMovies />
      </MemoryRouter>
    );

    await screen.findByText("Movie One");
    deleteMovieById.mockResolvedValue({});

    // Get the movie card for "Movie One"
    const movieCard = screen.getByText("Movie One").closest("div.card");

    // Find the delete button within that movie card
    const deleteButton = within(movieCard).getByRole("button", {
      name: /delete/i,
    });

    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Movie Deleted Successfully!!")
    );
    expect(screen.queryByText("Movie One")).not.toBeInTheDocument();
  });

  // test("shows error on movie delete failure", async () => {
  //   // Arrange
  //   render(
  //     <MemoryRouter>
  //       <ManageMovies />
  //     </MemoryRouter>
  //   );

  //   await screen.findByText("Movie One");

  //   // Mock the delete function to reject
  //   deleteMovieById.mockRejectedValue(new Error("Failed to delete movie"));

  //   // Get the movie card for "Movie One"
  //   const movieCard = screen.getByText("Movie One").closest("div.card");

  //   // Find the delete button within that movie card
  //   const deleteButton = within(movieCard).getByRole("button", {
  //     name: /delete/i,
  //   });

  //   // Act
  //   fireEvent.click(deleteButton);

  //   // Assert
  //   await waitFor(() =>
  //     expect(toast.error).toHaveBeenCalledWith("Failed to delete movie")
  //   );
  // });

  // test("shows error on movie delete failure", async () => {
  //   render(
  //     <MemoryRouter>
  //       <ManageMovies />
  //     </MemoryRouter>
  //   );

  //   await screen.findByText("Movie One");
  //   deleteMovieById.mockRejectedValue(new Error("Delete error"));

  //   const movieCard = screen.getByText("Movie One").closest("div.card");
  //   const deleteButton = within(movieCard).getByRole("button", {
  //     name: /delete/i,
  //   });

  //   fireEvent.click(deleteButton);

  //   await waitFor(() =>
  //     expect(toast.error).toHaveBeenCalledWith("Failed to delete movie")
  //   );
  // });
});
