"use client";
import React, { useState, useEffect } from "react";
import styles from "./InputDesign.module.css";
import { Task, TaskFormData, API_CONFIG } from "./types";
import Notification, { NotificationType } from "./Notification";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import TaskSearch from "./TaskSearch";
import TaskList from "./TaskList";
import EditTaskDialog from "./EditTaskDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const InputDesign: React.FC = () => {
  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([
    "all",
    "active",
    "completed",
    "expired",
  ]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
  } | null>(null);

  // Loading states for different actions
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isTogglingTask, setIsTogglingTask] = useState<string | null>(null);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  // Fetch tasks when page changes or on component mount
  useEffect(() => {
    fetchTasks().catch((error) => {
      showNotification("Failed to fetch tasks. Please try again.", "error");
    });
  }, []);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // API functions
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      return true;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  };

  const addTask = async (newTask: TaskFormData) => {
    setIsAddingTask(true);
    try {
      if (newTask.deadline === "") { newTask.deadline = null;}
      const response = await fetch(`${API_CONFIG.baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const success = await fetchTasks();
      if (success) {
        showNotification("Task added successfully!", "success");
      }
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      showNotification("Failed to add task. Please try again.", "error");
      throw error;
    } finally {
      setIsAddingTask(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    setIsTogglingTask(taskId);
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const newStatus = !task.completed;

      const response = await fetch(`${API_CONFIG.baseUrl}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const success = await fetchTasks();
      if (success) {
        showNotification(
          `Task marked as ${newStatus ? "completed" : "active"}!`,
          "success",
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      showNotification(
        "Failed to update task status. Please try again.",
        "error",
      );
    } finally {
      setIsTogglingTask(null);
    }
  };

  const saveEditedTask = async (editedTask: Task) => {
    setIsSavingTask(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/tasks/${editedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTask),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const success = await fetchTasks();
      if (success) {
        closeEditDialog();
        showNotification("Task updated successfully!", "success");
      }
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      showNotification("Failed to update task. Please try again.", "error");
      throw error;
    } finally {
      setIsSavingTask(false);
    }
  };

  const deleteTask = async () => {
    if (!editingTask) return;

    setIsDeletingTask(true);
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/tasks/${editingTask.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const success = await fetchTasks();
      if (success) {
        closeEditDialog();
        closeDeleteConfirm();
        showNotification("Task deleted successfully!", "success");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotification("Failed to delete task. Please try again.", "error");
    } finally {
      setIsDeletingTask(false);
    }
  };

  // UI handlers
  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task });
  };

  const closeEditDialog = () => {
    setEditingTask(null);
  };

  const openDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  return (
    <main className={styles.div}>
      <h1 className={styles.h1}>Task Manager</h1>

      <TaskForm onAddTask={addTask} isLoading={isAddingTask} />

      <TaskFilters
        selectedStatuses={selectedStatuses}
        onFilterChange={setSelectedStatuses}
      />

      <TaskSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <TaskList
        tasks={tasks}
        searchQuery={searchQuery}
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleTaskStatus}
        onEditTask={openEditDialog}
        togglingTaskId={isTogglingTask}
      />

      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          onSave={saveEditedTask}
          onCancel={closeEditDialog}
          onDelete={openDeleteConfirm}
          isSaving={isSavingTask}
        />
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirmDialog
          onConfirm={deleteTask}
          onCancel={closeDeleteConfirm}
          isDeleting={isDeletingTask}
        />
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </main>
  );
};

export default InputDesign;
