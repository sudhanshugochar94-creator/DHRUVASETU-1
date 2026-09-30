// ====================================================================
// SIH26063: Institutional Role & Session Context
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole } from '@/shared/types/index';
import { authService } from './services/authService';

interface RoleContextValue {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  canEditContent: boolean;
  canApproveContent: boolean;
  canUploadData: boolean;
  isAdmin: boolean;
  currentUser: { id: string; email?: string } | null;
  logout: () => Promise<void>;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Public Visitor');
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    // Check initial active session
    authService.getSession().then(async (session) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id, email: session.user.email });
        const profile = await authService.getUserProfile(session.user.id);
        if (profile) {
          if (profile.role === 'administrator') setCurrentRole('Administrator');
          else if (profile.role === 'content_manager') setCurrentRole('Content Manager');
          else if (profile.role === 'researcher') setCurrentRole('Researcher');
        }
      }
    });

    // Listen to live auth changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = authService.onAuthStateChange(async (_event: string, session: any) => {
      if (session?.user) {
        setCurrentUser({ id: session.user.id, email: session.user.email });
        const profile = await authService.getUserProfile(session.user.id);
        if (profile) {
          if (profile.role === 'administrator') setCurrentRole('Administrator');
          else if (profile.role === 'content_manager') setCurrentRole('Content Manager');
          else if (profile.role === 'researcher') setCurrentRole('Researcher');
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      if (sub && typeof sub.unsubscribe === 'function') sub.unsubscribe();
    };
  }, []);

  const canEditContent = currentRole === 'Content Manager' || currentRole === 'Administrator';
  const canApproveContent = currentRole === 'Content Manager' || currentRole === 'Administrator';
  const canUploadData = currentRole === 'Researcher' || currentRole === 'Administrator';
  const isAdmin = currentRole === 'Administrator';

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentRole('Public Visitor');
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setRole,
        canEditContent,
        canApproveContent,
        canUploadData,
        isAdmin,
        currentUser,
        logout
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextValue => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
