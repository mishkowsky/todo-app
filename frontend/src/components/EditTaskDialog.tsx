"use client";
import React, { useState } from "react";
import styles from "./InputDesign.module.css";
import { Task } from "./types";
import useAutoResizeTextarea from "./useAutoResizeTextarea";

interface EditTaskDialogProps {
  task: Task;
  onSave: (task: Task) => Promise<boolean>;
  onCancel: () => void;
  onDelete: () => void;
  isSaving: boolean;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  task,
  onSave,
  onCancel,
  onDelete,
  isSaving,
}) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));

    if (name === "title" && value.trim()) {
      setError("");
    }
  };

  // Use the auto-resize hook for the description textarea
  const textareaRef = useAutoResizeTextarea(editedTask.description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      await onSave(editedTask);
      // Success notification will be shown by the parent component
    } catch (err) {
      // Error notification will be shown by the parent component
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit Task</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>
              <span>Task Title </span>
              <span className={styles.requiredMark}>*</span>
            </label>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <input
              type="text"
              name="title"
              className={styles.input}
              required
              value={editedTask.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Task Description</label>
            <textarea
              ref={textareaRef}
              name="description"
              className={styles.textarea}
              value={editedTask.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Task Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              className={styles.input}
              value={editedTask.deadline}
              onChange={handleChange}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={`${styles.deleteButton} ${styles.builder7a465a9e08934fcb8c1e8b3710d279f7}`}
              onClick={onDelete}
            >
              Delete
            </button>
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={`${styles.cancelButton} ${styles.builder74dcffb027ad4397a57ffe385efd25bb}`}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${styles.saveButton} ${styles.builderB3185e20cbcb4ac6a8548293e7de67df}`}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskDialog;
