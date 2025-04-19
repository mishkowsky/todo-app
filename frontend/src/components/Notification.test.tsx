import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Notification from "./Notification";

describe("Notification Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders notification with message", () => {
    const mockOnClose = jest.fn();

    render(
      <Notification
        message="Test notification"
        type="info"
        onClose={mockOnClose}
      />,
    );

    expect(screen.getByText("Test notification")).toBeInTheDocument();
  });

  test("calls onClose after duration", () => {
    const mockOnClose = jest.fn();

    render(
      <Notification
        message="Test notification"
        type="info"
        onClose={mockOnClose}
        duration={1000}
      />,
    );

    expect(mockOnClose).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("applies exit animation when closing", () => {
    const mockOnClose = jest.fn();

    render(
      <Notification
        message="Test notification"
        type="info"
        onClose={mockOnClose}
      />,
    );

    const closeButton = screen.getByLabelText("Close notification");
    fireEvent.click(closeButton);

    // Check that exit animation class is applied
    expect(
      screen.getByText("Test notification").closest("div.notification"),
    ).toHaveClass("notificationExit");

    // Fast-forward time to complete animation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("clears timeout on unmount", () => {
    const mockOnClose = jest.fn();

    const { unmount } = render(
      <Notification
        message="Test notification"
        type="info"
        onClose={mockOnClose}
        duration={5000}
      />,
    );

    unmount();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // onClose should not be called after unmount
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
