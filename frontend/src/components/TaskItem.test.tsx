import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskItem from "./TaskItem";

describe("TaskItem Component", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "This is a test task",
    deadline: "2023-12-31T23:59:59",
    completed: false,
    created_at: "2023-01-01T10:00:00",
    completed_at: null,
  };

  const mockCompletedTask = {
    ...mockTask,
    completed: true,
    completed_at: "2023-01-10T14:20:00",
  };

  const mockExpiredTask = {
    ...mockTask,
    deadline: "2022-01-01T00:00:00",
  };

  const mockToggleStatus = jest.fn().mockResolvedValue(undefined);
  const mockEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders task details correctly", () => {
    render(
      <TaskItem
        task={mockTask}
        searchQuery=""
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        isToggling={false}
      />,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test task")).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
    expect(screen.getByText(/Due:/)).toBeInTheDocument();
    expect(screen.queryByText(/Completed:/)).not.toBeInTheDocument();
  });

  test("calls onToggleStatus when checkbox is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        searchQuery=""
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        isToggling={false}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockToggleStatus).toHaveBeenCalledWith("1");
  });

  test("calls onEditTask when edit button is clicked", () => {
    render(
      <TaskItem
        task={mockTask}
        searchQuery=""
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        isToggling={false}
      />,
    );

    const editButton = screen.getByLabelText("Edit task");
    fireEvent.click(editButton);

    expect(mockEditTask).toHaveBeenCalledWith(mockTask);
  });

  test("disables checkbox and shows loading indicator when isToggling is true", () => {
    render(
      <TaskItem
        task={mockTask}
        searchQuery=""
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        isToggling={true}
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });
});
