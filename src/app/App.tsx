import React from 'react';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import { AppShell } from '@/shared/layout/AppShell';

export const App: React.FC = () => (
  <AppProviders>
    <AppShell>
      <AppRoutes />
    </AppShell>
  </AppProviders>
);

export default App;
