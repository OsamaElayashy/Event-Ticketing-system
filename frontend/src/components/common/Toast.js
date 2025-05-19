import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const ToastContext = React.createContext(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [severity, setSeverity] = React.useState('info');

  const showToast = (message, severity = 'info') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const hideToast = () => {
    setOpen(false);
  };

  const value = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={hideToast} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

// Convenience functions for different toast types
export const showToast = {
  success: (message) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, severity: 'success' },
    });
    window.dispatchEvent(event);
  },
  error: (message) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, severity: 'error' },
    });
    window.dispatchEvent(event);
  },
  warning: (message) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, severity: 'warning' },
    });
    window.dispatchEvent(event);
  },
  info: (message) => {
    const event = new CustomEvent('show-toast', {
      detail: { message, severity: 'info' },
    });
    window.dispatchEvent(event);
  },
};

export default ToastProvider; 