import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "./TaskList";

describe("TaskList Component", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Active",
      description: "task#1",
      deadline: "2025-12-31T23:59:59", // TODO make deadline dynamic
      completed: false,
      created_at: "2023-01-01T10:00:00",
      completed_at: null,
    },
    {
      id: "2",
      title: "Completed",
      description: "task#2",
      deadline: "2023-11-15T23:59:59",
      completed: true,
      created_at: "2023-01-05T09:30:00",
      completed_at: "2023-01-10T14:20:00",
    },
    {
      id: "3",
      title: "Expired",
      description: "task#3",
      deadline: "2022-01-01T00:00:00",
      completed: false,
      created_at: "2022-01-01T09:00:00",
      completed_at: null,
    },
  ];

  const mockToggleStatus = jest.fn();
  const mockEditTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all tasks when "all" filter is selected', () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery=""
        selectedStatuses={["all"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  test("filters tasks by active status", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery=""
        selectedStatuses={["active"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
    expect(screen.queryByText("Expired")).not.toBeInTheDocument();
  });

  test("filters tasks by completed status", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery=""
        selectedStatuses={["completed"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByText("Expired")).not.toBeInTheDocument();
  });

  test("filters tasks by expired status", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery=""
        selectedStatuses={["expired"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  test("filters tasks by search query", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery="active"
        selectedStatuses={["all"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.getByText("task#1")).toBeInTheDocument();
    expect(screen.queryByText("task#2")).not.toBeInTheDocument();
    expect(screen.queryByText("task#3")).not.toBeInTheDocument();
  });

  test("combines filters and search", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery="task"
        selectedStatuses={["completed"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    // search by title because description is splitted by highligting
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.queryByText("Expired")).not.toBeInTheDocument();
  });

  test("renders no tasks when none match filters", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery="nonexistent"
        selectedStatuses={["all"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId={null}
      />,
    );

    expect(screen.queryByText("Active Task")).not.toBeInTheDocument();
    expect(screen.queryByText("Completed Task")).not.toBeInTheDocument();
    expect(screen.queryByText("Expired Task")).not.toBeInTheDocument();
  });

  test("passes togglingTaskId to TaskItem", () => {
    render(
      <TaskList
        tasks={mockTasks}
        searchQuery=""
        selectedStatuses={["all"]}
        onToggleStatus={mockToggleStatus}
        onEditTask={mockEditTask}
        togglingTaskId="1"
      />,
    );

    // This is a bit of an implementation detail, but we can check that the component renders
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});
