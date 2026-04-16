import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#000000',
              color: '#ffffff',
              border: '1px solid #999999',
              borderRadius: '6px',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            },
            success: {
              style: {
                background: '#000000',
                border: '1px solid #ffffff',
              },
            },
            error: {
              style: {
                background: '#000000',
                border: '1px solid #999999',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
