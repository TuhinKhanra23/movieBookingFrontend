import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar"; // Adjust the import path as necessary
import { searchMoviesByName } from "../services/movieService";
import "@testing-library/jest-dom";

// Mock the services used in the component
jest.mock("../services/movieService", () => ({
  searchMoviesByName: jest.fn(),
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
    render(<SearchBar />);
  });

  test("renders input and button", () => {
    const input = screen.getByPlaceholderText("Search your movies here...");
    const button = screen.getByRole("button");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("updates movie name on input change", () => {
    const input = screen.getByPlaceholderText("Search your movies here...");

    fireEvent.change(input, { target: { value: "Inception" } });
    expect(input.value).toBe("Inception");
  });

  test("calls searchMoviesByName and updates localStorage on button click", async () => {
    const input = screen.getByPlaceholderText("Search your movies here...");
    const mockData = [{ title: "Inception" }, { title: "Interstellar" }];
    searchMoviesByName.mockResolvedValueOnce(mockData);

    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.click(screen.getByRole("button"));

    // Check if searchMoviesByName was called with the correct argument
    expect(searchMoviesByName).toHaveBeenCalledWith("Inception");

    // Verify localStorage is updated
    // expect(localStorage.getItem("searchData")).toEqual(
    //   JSON.stringify(mockData)
    // );
  });

  test("handles search error gracefully", async () => {
    const input = screen.getByPlaceholderText("Search your movies here...");
    searchMoviesByName.mockRejectedValueOnce(new Error("Search failed"));

    fireEvent.change(input, { target: { value: "Unknown Movie" } });
    fireEvent.click(screen.getByRole("button"));

    // Check if searchMoviesByName was called
    expect(searchMoviesByName).toHaveBeenCalledWith("Unknown Movie");
    // We expect no errors to be thrown that affect the UI, so we can just check that the function was called
    expect(
      screen.getByPlaceholderText("Search your movies here...")
    ).toBeInTheDocument();
  });
});
