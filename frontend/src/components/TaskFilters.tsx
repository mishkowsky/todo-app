"use client";
import React from "react";
import styles from "./InputDesign.module.css";

interface TaskFiltersProps {
  selectedStatuses: string[];
  onFilterChange: (newStatuses: string[]) => void;
  theme?: string | null;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  selectedStatuses,
  onFilterChange,
  theme,
}) => {
  const toggleFilter = (filter: string) => {
    if (filter === "all") {
      if (selectedStatuses.includes("all")) {
        onFilterChange([]);
      } else {
        onFilterChange(["all", "active", "completed", "expired"]);
      }
      return;
    }

    const newStatuses = selectedStatuses.includes(filter)
      ? selectedStatuses.filter((s) => s !== filter)
      : [...selectedStatuses, filter];

    if (newStatuses.length === 3 && !newStatuses.includes("all")) {
      onFilterChange(["all", "active", "completed", "expired"]);
    } else {
      onFilterChange(newStatuses.filter((s) => s !== "all"));
    }
  };

  const getButtonStyle = (filter: string) => ({
    background: selectedStatuses.includes(filter) ? "#4299e1" : "#ffffff",
    color: selectedStatuses.includes(filter) ? "white" : "#4a5568",
    border: theme === "dark" ? "none" : "1px solid #e2e8f0",
  });

  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${styles.builderAcb154c385ef47b8a530f0c162b6382d}`}
        onClick={() => toggleFilter("all")}
        style={getButtonStyle("all")}
      >
        All
      </button>

      <button
        className={`${styles.filterButton} ${styles.builderB6b80b4e60994f3bb4d1c733d8e697b2}`}
        onClick={() => toggleFilter("active")}
        style={getButtonStyle("active")}
      >
        Active
      </button>

      <button
        className={`${styles.filterButton} ${styles.builderA0405099440642d3b77c7827ec7eb5b9}`}
        onClick={() => toggleFilter("completed")}
        style={getButtonStyle("completed")}
      >
        Completed
      </button>

      <button
        className={`${styles.filterButton} ${styles.builderF9afbd64eb6b46aba60280ce235cb6e0}`}
        onClick={() => toggleFilter("expired")}
        style={getButtonStyle("expired")}
      >
        Expired
      </button>
    </div>
  );
};

export default TaskFilters;
