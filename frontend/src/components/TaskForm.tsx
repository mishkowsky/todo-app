"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import { TaskFormData } from "./types";
import useAutoResizeTextarea from "./useAutoResizeTextarea";

interface TaskFormProps {
  onAddTask: (task: TaskFormData) => Promise<boolean>;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading }) => {
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: "",
    deadline: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      await onAddTask(newTask);
      setNewTask({ title: "", description: "", deadline: "" });
      setError("");
    } catch (err) {
      // Error will be shown as a notification by the parent component
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));

    if (name === "title" && value.trim()) {
      setError("");
    }
  };

  // Use the auto-resize hook for the description textarea
  const textareaRef = useAutoResizeTextarea(newTask.description);

  return (
    <form
      className={styles.taskForm}
      style={{
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        width: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <div className={styles.formField}>
        <label className={styles.formLabel}>
          <span>Task Title </span>
          <span className={styles.requiredMark}>*</span>
        </label>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <input
          type="text"
          name="title"
          placeholder="Enter task title"
          className={styles.input}
          value={newTask.title}
          required
          onChange={handleChange}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>Task Description</label>
        <textarea
          ref={textareaRef}
          name="description"
          placeholder="Enter task description"
          className={styles.textarea}
          value={newTask.description}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formField}>
        <label className={styles.formLabel}>Task Deadline</label>
        <input
          type="datetime-local"
          name="deadline"
          className={styles.input}
          value={newTask.deadline ? newTask.deadline : ""}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className={`${styles.button} ${styles.builderEc2776a4c27444fbada4fda3b589f882}`}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
