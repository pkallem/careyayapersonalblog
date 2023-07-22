import React from 'react';
import styles from '../styles/CreateBlogPopup.module.css';

interface DeleteConfirmationPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationPopup({ onClose, onConfirm }: DeleteConfirmationPopupProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.popupHeading}>Delete Blog</h2>
        <p>Are you sure you want to delete this blog?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
}