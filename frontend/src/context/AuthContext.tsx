'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Super Admin' | 'Admin' | 'Analyst/IO';

export interface AuthUser {
  serviceId: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  unit: string;
  sessionToken: string;
  loginTime: string;
  clearanceLevel: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (serviceId: string, role: UserRole, passkey?: string) => Promise<boolean>;
  quickLogin: (targetRole: 'Analyst/IO' | 'Super Admin') => void;
  logout: () => void;
  hasRole: (requiredRole: UserRole) => boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'chakravyuh_user';
const ROLE_STORAGE_KEY = 'chakravyuh_role';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from sessionStorage on mount (SSR safe)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
        const storedRole = sessionStorage.getItem(ROLE_STORAGE_KEY);

        if (storedUser && storedRole) {
          const parsedUser: AuthUser = JSON.parse(storedUser);
          // Sync role in case of discrepancies
          parsedUser.role = storedRole as UserRole;
          setUser(parsedUser);
        }
      }
    } catch (err) {
      console.error('Failed to parse Chakravyuh session state:', err);
      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(ROLE_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSession = (authUser: AuthUser) => {
    try {
      sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      sessionStorage.setItem(ROLE_STORAGE_KEY, authUser.role);
    } catch (err) {
      console.error('Error saving Chakravyuh session to sessionStorage:', err);
    }
    setUser(authUser);
  };

  const login = async (serviceId: string, role: UserRole, _passkey?: string): Promise<boolean> => {
    const defaultName = role === 'Super Admin' 
      ? 'DIG Vikramaditya Sen, IPS' 
      : role === 'Admin'
      ? 'SP Alok Mathur' 
      : 'Inspector R. K. Singh';

    const defaultUnit = role === 'Super Admin'
      ? 'STF Directorate / Central Operations Command'
      : role === 'Admin'
      ? 'Special Cell / Cyber & Economic Offenses'
      : 'UP STF Cyber & Hawala Cell (Varanasi)';

    const defaultBadge = serviceId.trim() || (role === 'Super Admin' ? 'IPS-HQ-0102' : 'STF-VNS-4491');

    const authUser: AuthUser = {
      serviceId: defaultBadge,
      name: defaultName,
      role,
      badgeNumber: defaultBadge,
      unit: defaultUnit,
      sessionToken: `CKV-AUTH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      loginTime: new Date().toISOString(),
      clearanceLevel: role === 'Super Admin' ? 'LEVEL-4 TOP-SECRET // COMMAND EXCLUSIVE' : 'LEVEL-2 CONFIDENTIAL // INVESTIGATING OFFICER',
    };

    saveSession(authUser);
    return true;
  };

  const quickLogin = (targetRole: 'Analyst/IO' | 'Super Admin') => {
    if (targetRole === 'Super Admin') {
      login('IPS-HQ-0102', 'Super Admin');
    } else {
      login('STF-VNS-4491', 'Analyst/IO');
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(USER_STORAGE_KEY);
      sessionStorage.removeItem(ROLE_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing Chakravyuh session:', err);
    }
    setUser(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    if (user.role === 'Admin' && requiredRole !== 'Super Admin') return true;
    return user.role === requiredRole;
  };

  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        quickLogin,
        logout,
        hasRole,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
