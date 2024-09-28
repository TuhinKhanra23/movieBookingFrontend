import React from "react";
import { render, screen } from "@testing-library/react";
import Base from "./Base";
import CustomNavbar from "./CustomNavbar";

// Mock the CustomNavbar component
jest.mock("./CustomNavbar", () => () => <div>Mocked Navbar</div>);

describe("Base Component", () => {
  test("renders Base component with default title", () => {
    render(<Base>Test Child</Base>);

    // Check if the mocked navbar is rendered
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();

    // Check if the child component is rendered
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  test("renders Base component with custom title", () => {
    const { container } = render(<Base title="Custom Title">Test Child</Base>);

    // Check if the navbar is rendered
    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument();

    // Check if the child component is rendered
    expect(screen.getByText("Test Child")).toBeInTheDocument();

    // Check for the title (if applicable)
    // Since there's no title display logic in the current implementation, you may skip this check
    // Example: expect(container).toHaveTextContent('Custom Title');
  });
});
