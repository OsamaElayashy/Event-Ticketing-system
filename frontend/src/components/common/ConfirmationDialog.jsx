import React from 'react';
import './Common.css';

const ConfirmationDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-dialog">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <div className="modal-body">
          <p className="confirmation-message">{message}</p>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`confirm-button ${isDestructive ? 'destructive' : ''}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog; 