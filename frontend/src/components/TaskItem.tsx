"use client";
import React from "react";
import styles from "./InputDesign.module.css";
import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  searchQuery: string;
  onToggleStatus: (taskId: string) => Promise<void>;
  onEditTask: (task: Task) => void;
  isToggling: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  searchQuery,
  onToggleStatus,
  onEditTask,
  isToggling,
}) => {
  const getTaskBackground = () => {
    if (task.completed) return "#f7faf7";
    if (task.deadline && new Date(task.deadline) < new Date()) return "#faf7f7";
    if (
      task.deadline &&
      new Date(task.deadline) < new Date(Date.now() + 24 * 60 * 60 * 1000)
    )
      return "#fafaf7";
    return "#ffffff";
  };

  const getTaskTitleStyle = () => ({
    textDecoration: task.completed ? "line-through" : "none",
    color: task.completed
      ? "#48bb78"
      : task.deadline && new Date(task.deadline) < new Date()
        ? "#e53e3e"
        : "#2d3748",
    marginTop: 0,
  });

  const highlightSearchTerm = (text: string) => {
    if (!searchQuery) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className={styles.searchHighlight}>
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  };

  return (
    <article
      className={`${styles.taskItem} ${styles.builder1f6cfe48c0064594a86010bf75610c9c}`}
      style={{ border: "1px solid #f0f0f0" }}
    >
      <header
        className={styles.taskHeader}
        style={{ background: getTaskBackground() }}
      >
        <div className={styles.taskInfo}>
          <h3 className={styles.taskTitle} style={getTaskTitleStyle()}>
            {highlightSearchTerm(task.title)}
          </h3>
          <div className={styles.taskMeta}>
            <div>
              <span className={styles.metaLabel}>Created: </span>
              <span className={styles.metaValue}>
                {new Date(task.created_at).toLocaleString()}
              </span>
            </div>
            <div className={styles.dueDate}>
              <span className={styles.metaLabel}>Due: </span>
              <span className={styles.metaValue}>
                {task.deadline
                  ? new Date(task.deadline).toLocaleString()
                  : "no deadline"}
              </span>
            </div>
            {task.completed && (
              <div className={styles.completedDate}>
                <span>Completed: </span>
                <span>{new Date(task.completed_at!).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.taskActions}>
          <button
            className={`${styles.editButton} ${styles.builderC588c7e23dea41199252ce03f080a927}`}
            onClick={() => onEditTask(task)}
            aria-label="Edit task"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <label className={styles.checkboxLabel}>
            <input
              className={`${styles.checkbox} ${styles.builder0c01c4db2e5f4fee97e39f42e98be36e}`}
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleStatus(task.id)}
              disabled={isToggling}
              aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
            />
          </label>
        </div>
      </header>
      <p className={styles.taskDescription}>
        {highlightSearchTerm(task.description)}
      </p>
    </article>
  );
};

export default TaskItem;
