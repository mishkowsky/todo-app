import React from "react";
import styles from "./InputDesign.module.css";

interface DeleteConfirmDialogProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.confirmDialog}>
        <h2 className={styles.confirmTitle}>Delete Task</h2>
        <p className={styles.confirmMessage}>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>
        <div className={styles.confirmActions}>
          <button
            className={`${styles.cancelButton} ${styles.builder772a71541aae4c55979ad464e5981489}`}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`${styles.deleteButton} ${styles.builder054fbf9545874a1c8f118f0de7e0900f}`}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
