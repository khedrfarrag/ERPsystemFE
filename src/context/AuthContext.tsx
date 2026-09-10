import React, { createContext, useContext, useState } from 'react';
import type { User, AuthResponse } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isOwnerOrManager: boolean;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.accessToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('token', authData.accessToken);
    toast.success('مرحباً بك، ' + authData.user.firstName);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast('تم تسجيل الخروج بنجاح', { icon: '👋' });
  };

  const isOwnerOrManager = user?.role === 'Owner' || user?.role === 'Manager';
  const isMerchant = user?.role === 'Merchant';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isOwnerOrManager,
        isMerchant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
