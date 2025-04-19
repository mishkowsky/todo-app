import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskSearch from "./TaskSearch";

describe("TaskSearch Component", () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search input with placeholder", () => {
    render(<TaskSearch searchQuery="" onSearchChange={mockOnSearchChange} />);

    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
  });

  test("displays current search query value", () => {
    render(
      <TaskSearch
        searchQuery="test query"
        onSearchChange={mockOnSearchChange}
      />,
    );

    expect(screen.getByPlaceholderText("Search tasks...")).toHaveValue(
      "test query",
    );
  });

  test("calls onSearchChange when input changes", () => {
    render(<TaskSearch searchQuery="" onSearchChange={mockOnSearchChange} />);

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("new search");
  });

  test("renders search icon", () => {
    render(<TaskSearch searchQuery="" onSearchChange={mockOnSearchChange} />);

    // Check for SVG element
    const svgElement = document.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("applies correct CSS classes", () => {
    render(<TaskSearch searchQuery="" onSearchChange={mockOnSearchChange} />);

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    expect(searchInput).toHaveClass("searchInput");
    expect(searchInput).toHaveClass("builderDe9ff5f18ff74d0d8f236229ad08c71c");
  });
});
