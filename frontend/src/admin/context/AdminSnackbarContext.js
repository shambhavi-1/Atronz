import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminSnackbarContext = createContext();

export const useAdminSnackbar = () => {
  const context = useContext(AdminSnackbarContext);
  if (!context) {
    throw new Error('useAdminSnackbar must be used within an AdminSnackbarProvider');
  }
  return context;
};

export const AdminSnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        hideSnackbar();
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  return (
    <AdminSnackbarContext.Provider value={{ snackbar, showSnackbar, hideSnackbar }}>
      {children}
    </AdminSnackbarContext.Provider>
  );
};
