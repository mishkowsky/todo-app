import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditTaskDialog from "./EditTaskDialog";

describe("EditTaskDialog Component", () => {
  const mockTask = {
    id: "1",
    title: "Test Task",
    description: "This is a test task",
    deadline: "2023-12-31T23:59",
    completed: false,
    created_at: "2023-01-01T10:00:00",
    completed_at: null,
  };

  const mockOnSave = jest.fn().mockResolvedValue(true);
  const mockOnCancel = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog with task details", () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("This is a test task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023-12-31T23:59")).toBeInTheDocument();
  });

  test("shows saving state when isSaving is true", () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={true}
      />,
    );

    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.getByText("Saving...").closest("button")).toBeDisabled();
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  test("calls onDelete when delete button is clicked", () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  test("shows error when submitting without title", async () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    // Clear the title
    const titleInput = screen.getByDisplayValue("Test Task");
    fireEvent.change(titleInput, { target: { value: "" } });

    // Submit the form
    fireEvent.click(screen.getByText("Save"));

    // Check for error message
    expect(screen.getByText("Task title is required")).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("calls onSave with updated task when form is submitted", async () => {
    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    // Update the title
    const titleInput = screen.getByDisplayValue("Test Task");
    fireEvent.change(titleInput, { target: { value: "Updated Task" } });

    // Update the description
    const descriptionInput = screen.getByDisplayValue("This is a test task");
    fireEvent.change(descriptionInput, {
      target: { value: "Updated description" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Save"));

    // Check that onSave was called with updated task
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        ...mockTask,
        title: "Updated Task",
        description: "Updated description",
      });
    });
  });

  test("handles error when onSave fails", async () => {
    const mockFailedSave = jest
      .fn()
      .mockRejectedValue(new Error("Failed to save"));

    render(
      <EditTaskDialog
        task={mockTask}
        onSave={mockFailedSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        isSaving={false}
      />,
    );

    // Submit the form
    fireEvent.click(screen.getByText("Save"));

    // Check that error handling occurred
    await waitFor(() => {
      expect(mockFailedSave).toHaveBeenCalled();
    });
  });
});
