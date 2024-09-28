import React from "react";
import { render, screen } from "@testing-library/react";
import { MovieListCard } from "./MovieListCard"; // adjust the import path accordingly
import "@testing-library/jest-dom";

describe("MovieListCard Component", () => {
  beforeEach(() => {
    render(<MovieListCard />);
  });

  test("renders card title", () => {
    const title = screen.getByRole("heading", { level: 5 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Card title");
  });

  test("renders card subtitle", () => {
    const subtitle = screen.getByRole("heading", { level: 6 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("Card subtitle");
  });

  test("renders card image", () => {
    const image = screen.getByAltText("Card cap");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://picsum.photos/318/180");
  });

  test("renders card text", () => {
    const cardText = screen.getByText(
      /Some quick example text to build on the card title/i
    );
    expect(cardText).toBeInTheDocument();
  });

  test("renders card links", () => {
    const cardLink1 = screen.getByText("Card Link");
    const cardLink2 = screen.getByText("Another Link");
    expect(cardLink1).toBeInTheDocument();
    expect(cardLink2).toBeInTheDocument();
  });
});
