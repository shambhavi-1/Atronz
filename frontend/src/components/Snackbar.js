import React, { useEffect } from 'react';
import { useSnackbar } from '../context/SnackbarContext';
import '../styles/snackbar.css';

const Snackbar = () => {
  const { snackbar, hideSnackbar } = useSnackbar();

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 4000); // Auto-hide after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [snackbar.open, hideSnackbar]);

  if (!snackbar.open) return null;

  return (
    <div
      className={`snackbar snackbar-${snackbar.severity}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 10000,
        animation: snackbar.open ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-out',
        minWidth: '300px',
        maxWidth: '500px',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
    >
      {snackbar.message}
      <button
        onClick={hideSnackbar}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '18px',
          marginLeft: '10px',
          opacity: 0.8,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Snackbar;
