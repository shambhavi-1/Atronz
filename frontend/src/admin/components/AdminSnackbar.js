import React from 'react';
import { useAdminSnackbar } from '../context/AdminSnackbarContext';
import '../../styles/snackbar.css';

const AdminSnackbar = () => {
  const { snackbar, hideSnackbar } = useAdminSnackbar();

  if (!snackbar.open) return null;

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'success':
        return 'snackbar-success';
      case 'error':
        return 'snackbar-error';
      case 'warning':
        return 'snackbar-warning';
      case 'info':
        return 'snackbar-info';
      default:
        return 'snackbar-success';
    }
  };

  return (
    <div
      className={`snackbar ${getSeverityClass(snackbar.severity)}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        minWidth: '300px',
        maxWidth: '500px',
        padding: '12px 16px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease-out',
        cursor: 'pointer',
      }}
      onClick={hideSnackbar}
    >
      {snackbar.message}
    </div>
  );
};

export default AdminSnackbar;
