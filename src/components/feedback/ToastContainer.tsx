import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: 'Cairo, sans-serif',
          direction: 'rtl',
          borderRadius: '1rem',
          background: '#1e293b',
          color: '#fff',
          fontSize: '0.875rem',
          fontWeight: 600,
          padding: '12px 16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        },
        success: {
          style: {
            background: '#064e3b',
            color: '#ecfdf5',
            border: '1px solid #059669',
          },
        },
        error: {
          style: {
            background: '#881337',
            color: '#fff1f2',
            border: '1px solid #e11d48',
          },
        },
      }}
    />
  );
};
