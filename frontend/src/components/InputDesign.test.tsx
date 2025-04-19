import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputDesign from "./InputDesign";
import { API_CONFIG } from "./types";

// Mock fetch
global.fetch = jest.fn();

// Mock implementation for fetch
const mockFetch = (mockData: ({ id: string; title: string; description: string; deadline: string; completed: boolean; createdAt: string; completedAt: null; } | { id: string; title: string; description: string; deadline: string; completed: boolean; createdAt: string; completedAt: string; })[]) => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData),
    }),
  );
};

describe("InputDesign Component", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Complete project",
      description: "Finish the React project by Friday",
      deadline: "2023-12-31T23:59:59",
      completed: false,
      createdAt: "2023-01-01T10:00:00",
      completedAt: null,
    },
    {
      id: "2",
      title: "Learn TypeScript",
      description: "Complete TypeScript course",
      deadline: "2023-11-15T23:59:59",
      completed: true,
      createdAt: "2023-01-05T09:30:00",
      completedAt: "2023-01-10T14:20:00",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch(mockTasks);
  });

  test("renders the task manager title", async () => {
    render(<InputDesign />);
    expect(screen.getByText("Task Manager")).toBeInTheDocument();
  });

  test("fetches and displays tasks on load", async () => {
    render(<InputDesign />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(`${API_CONFIG.baseUrl}/tasks`);
    });

    await waitFor(() => {
      expect(screen.getByText("Complete project")).toBeInTheDocument();
      expect(screen.getByText("Learn TypeScript")).toBeInTheDocument();
    });
  });

  test("allows adding a new task", async () => {
    render(<InputDesign />);

    // Setup mock for POST request
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              ...mockTasks,
              {
                id: "3",
                title: "New Task",
                description: "New Description",
                deadline: null,
                completed: false,
                createdAt: "2023-01-15T10:00:00",
                completedAt: null,
              },
            ]),
        }),
      );

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Enter task title"), {
      target: { value: "New Task" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter task description"), {
      target: { value: "New Description" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseUrl}/tasks`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            title: "New Task",
            description: "New Description",
            deadline: null,
          }),
        }),
      );
    });
  });

  test("shows validation error when adding task without title", async () => {
    render(<InputDesign />);

    // Try to submit without a title
    fireEvent.click(screen.getByText("Add Task"));

    // Check for error message
    expect(screen.getByText("Task title is required")).toBeInTheDocument();
  });

  test("allows filtering tasks", async () => {
    render(<InputDesign />);

    await waitFor(() => {
      expect(screen.getByText("Complete project")).toBeInTheDocument();
      expect(screen.getByText("Learn TypeScript")).toBeInTheDocument();
    });

    // Click on Completed filter
    fireEvent.click(screen.getByText("All"));
    fireEvent.click(screen.getByText("Completed"));

    // Only completed tasks should be visible
    await waitFor(() => {
      expect(screen.queryByText("Complete project")).not.toBeInTheDocument();
      expect(screen.getByText("Learn TypeScript")).toBeInTheDocument();
    });
  });

  test("allows searching tasks", async () => {
    render(<InputDesign />);

    await waitFor(() => {
      expect(screen.getByText("Complete project")).toBeInTheDocument();
      expect(screen.getByText("Learn TypeScript")).toBeInTheDocument();
    });

    // Search for "TypeScript"
    fireEvent.change(screen.getByPlaceholderText("Search tasks..."), {
      target: { value: "course" },
    });

    // Only matching tasks should be visible
    await waitFor(() => {
      expect(screen.queryByText("Complete project")).not.toBeInTheDocument();
      expect(screen.getByText("Learn TypeScript")).toBeInTheDocument();
    });
  });
});
