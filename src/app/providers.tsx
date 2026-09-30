import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoleProvider } from '@/features/auth/RoleContext';
import { ToastProvider } from '@/shared/context/ToastContext';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleProvider>
    <ToastProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ToastProvider>
  </RoleProvider>
);
