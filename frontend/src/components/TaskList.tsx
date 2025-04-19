import React from "react";
import styles from "./InputDesign.module.css";
import TaskItem from "./TaskItem";
import { Task } from "./types";

interface TaskListProps {
  tasks: Task[];
  searchQuery: string;
  selectedStatuses: string[];
  onToggleStatus: (taskId: string) => Promise<void>;
  onEditTask: (task: Task) => void;
  togglingTaskId: string | null;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  searchQuery,
  selectedStatuses,
  onToggleStatus,
  onEditTask,
  togglingTaskId,
}) => {
  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter by status
    if (selectedStatuses.includes("all")) return true;

    if (
      selectedStatuses.includes("active") &&
      !task.completed &&
      (!task.deadline || new Date(task.deadline) > new Date())
    ) {
      return true;
    }

    if (selectedStatuses.includes("completed") && task.completed) {
      return true;
    }

    if (
      selectedStatuses.includes("expired") &&
      task.deadline && // Only consider tasks with deadlines
      new Date(task.deadline) < new Date() &&
      !task.completed
    ) {
      return true;
    }

    return false;
  });

  return (
    <section className={styles.taskList}>
      {filteredTasks.length === 0 ? (
        <div className={styles.noTasksMessage}>
          No tasks match your current filters
        </div>
      ) : (
        filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            searchQuery={searchQuery}
            onToggleStatus={onToggleStatus}
            onEditTask={onEditTask}
            isToggling={togglingTaskId === task.id}
          />
        ))
      )}
    </section>
  );
};

export default TaskList;
