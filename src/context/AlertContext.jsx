import { useState, createContext, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
  };

  const hideAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={hideAlert} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};