import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskForm from "./TaskForm";

describe("TaskForm Component", () => {
  const mockAddTask = jest.fn().mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form elements correctly", () => {
    render(<TaskForm onAddTask={mockAddTask} isLoading={false} />);

    expect(screen.getByText("Task Title")).toBeInTheDocument();
    expect(screen.getByText("Task Description")).toBeInTheDocument();
    expect(screen.getByText("Task Deadline")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter task title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter task description"),
    ).toBeInTheDocument();
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("shows loading state when isLoading is true", () => {
    render(<TaskForm onAddTask={mockAddTask} isLoading={true} />);

    expect(screen.getByText("Adding...")).toBeInTheDocument();
    expect(screen.getByText("Adding...").closest("button")).toBeDisabled();
  });

  test("shows error when submitting without title", async () => {
    render(<TaskForm onAddTask={mockAddTask} isLoading={false} />);

    // Submit form without filling title
    fireEvent.click(screen.getByText("Add Task"));

    // Check for error message
    expect(screen.getByText("Task title is required")).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  test("clears form after successful submission", async () => {
    render(<TaskForm onAddTask={mockAddTask} isLoading={false} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "New Task" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    // Check that form was cleared
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter task title")).toHaveValue("");
    });
  });

  test("handles error when onAddTask fails", async () => {
    const mockFailedAddTask = jest
      .fn()
      .mockRejectedValue(new Error("Failed to add task"));

    render(<TaskForm onAddTask={mockFailedAddTask} isLoading={false} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "New Task" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    // Check that error handling occurred
    await waitFor(() => {
      expect(mockFailedAddTask).toHaveBeenCalled();
    });
  });
});
