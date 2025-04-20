"use client";
import React, { useEffect, useState } from "react";
import styles from "./InputDesign.module.css";

export type NotificationType = "error" | "success" | "info";

export interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startExitAnimation();
    }, duration);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const startExitAnimation = () => {
    setIsExiting(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      onClose();
    }, 300); // Match this with the CSS animation duration
  };

  const handleClose = () => {
    startExitAnimation();
  };

  const getNotificationClass = () => {
    switch (type) {
      case "error":
        return styles.errorNotification;
      case "success":
        return styles.successNotification;
      case "info":
        return styles.infoNotification;
      default:
        return "";
    }
  };

  return (
    <div
      className={`
        ${styles.notification}
        ${getNotificationClass()}
        ${isExiting ? styles.notificationExit : ""}
      `}
    >
      <div className={styles.notificationContent}>
        <span className={styles.notificationMessage}>{message}</span>
        <button
          className={styles.notificationClose}
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;
