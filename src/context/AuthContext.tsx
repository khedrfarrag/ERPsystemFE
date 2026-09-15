import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthResponse } from '../types';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE_URL } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  clearMustChangePassword: () => void;
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

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refreshToken');
  });

  // Synchronize state when tokens are refreshed in the background by Axios interceptor
  useEffect(() => {
    const handleTokenRefreshed = (event: CustomEvent<{ accessToken: string; refreshToken: string }>) => {
      if (event.detail) {
        setToken(event.detail.accessToken);
        setRefreshToken(event.detail.refreshToken);
      }
    };

    window.addEventListener('retailos:token-refreshed' as any, handleTokenRefreshed);
    return () => {
      window.removeEventListener('retailos:token-refreshed' as any, handleTokenRefreshed);
    };
  }, []);

  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.accessToken);
    setRefreshToken(authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
    localStorage.setItem('token', authData.accessToken);
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }
    toast.success('مرحباً بك، ' + authData.user.firstName);
  };

  const logout = () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    const currentToken = localStorage.getItem('token');

    // Notify backend to revoke refresh token (best-effort)
    if (currentRefreshToken && currentToken) {
      axios.post(
        `${API_BASE_URL}/auth/logout`,
        { refreshToken: currentRefreshToken },
        { headers: { Authorization: `Bearer ${currentToken}` } }
      ).catch(() => {
        // Ignore network or token errors on logout
      });
    }

    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast('تم تسجيل الخروج بنجاح', { icon: '👋' });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearMustChangePassword = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isOwnerOrManager = user?.role === 'Owner' || user?.role === 'Manager';
  const isMerchant = user?.role === 'Merchant';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        login,
        logout,
        updateUser,
        clearMustChangePassword,
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
