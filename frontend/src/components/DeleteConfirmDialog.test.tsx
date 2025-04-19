import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

describe("DeleteConfirmDialog Component", () => {
  const mockOnConfirm = jest.fn().mockResolvedValue(undefined);
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders confirmation dialog with message", () => {
    render(
      <DeleteConfirmDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={false}
      />,
    );

    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this task? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("shows deleting state when isDeleting is true", () => {
    render(
      <DeleteConfirmDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={true}
      />,
    );

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.getByText("Deleting...").closest("button")).toBeDisabled();
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <DeleteConfirmDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={false}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test("calls onConfirm when delete button is clicked", () => {
    render(
      <DeleteConfirmDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={false}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  test("applies correct CSS classes", () => {
    render(
      <DeleteConfirmDialog
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={false}
      />,
    );

    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toHaveClass("deleteButton");
    expect(deleteButton).toHaveClass("builder054fbf9545874a1c8f118f0de7e0900f");

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toHaveClass("cancelButton");
    expect(cancelButton).toHaveClass("builder772a71541aae4c55979ad464e5981489");
  });
});
