import PropTypes from 'prop-types';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="dialog-body">
          <p>{message}</p>
        </div>

        <div className="dialog-footer">
          <button className="cancel-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`confirm-button ${isDestructive ? 'destructive' : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDestructive: PropTypes.bool,
};

export default ConfirmationDialog; 