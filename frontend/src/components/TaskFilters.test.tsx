import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskFilters from "./TaskFilters";

describe("TaskFilters Component", () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all filter buttons", () => {
    render(
      <TaskFilters
        selectedStatuses={["all", "active", "completed", "expired"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  test("applies correct styling to selected filters", () => {
    render(
      <TaskFilters
        selectedStatuses={["active", "completed"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    expect(screen.getByText("All")).toHaveStyle("background: #ffffff");
    expect(screen.getByText("Active")).toHaveStyle("background: #4299e1");
    expect(screen.getByText("Completed")).toHaveStyle("background: #4299e1");
    expect(screen.getByText("Expired")).toHaveStyle("background: #ffffff");
  });

  test("calls onFilterChange with all statuses when All is clicked and not selected", () => {
    render(
      <TaskFilters
        selectedStatuses={["active"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(screen.getByText("All"));

    expect(mockOnFilterChange).toHaveBeenCalledWith([
      "all",
      "active",
      "completed",
      "expired",
    ]);
  });

  test("calls onFilterChange with empty array when All is clicked and already selected", () => {
    render(
      <TaskFilters
        selectedStatuses={["all", "active", "completed", "expired"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(screen.getByText("All"));

    expect(mockOnFilterChange).toHaveBeenCalledWith([]);
  });

  test("adds status to selection when clicked and not selected", () => {
    render(
      <TaskFilters
        selectedStatuses={["active"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(screen.getByText("Completed"));

    expect(mockOnFilterChange).toHaveBeenCalledWith(["active", "completed"]);
  });

  test("removes status from selection when clicked and already selected", () => {
    render(
      <TaskFilters
        selectedStatuses={["active", "completed"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(screen.getByText("Active"));

    expect(mockOnFilterChange).toHaveBeenCalledWith(["completed"]);
  });

  test("selects all when three filters are selected", () => {
    render(
      <TaskFilters
        selectedStatuses={["active", "completed"]}
        onFilterChange={mockOnFilterChange}
      />,
    );

    fireEvent.click(screen.getByText("Expired"));

    expect(mockOnFilterChange).toHaveBeenCalledWith([
      "all",
      "active",
      "completed",
      "expired",
    ]);
  });
});
