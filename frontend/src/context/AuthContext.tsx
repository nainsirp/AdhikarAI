import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient, { setAccessToken } from '../api/client';

interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ status: string; message?: string }>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync token on boot
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('adhikarai_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          // Try to refresh token on startup
          const res = await apiClient.post('/auth/refresh');
          if (res.data?.status === 'success') {
            setAccessToken(res.data.accessToken);
            setUser(parsed);
          } else {
            localStorage.removeItem('adhikarai_user');
          }
        }
      } catch (err) {
        localStorage.removeItem('adhikarai_user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to global logout event
    const handleLogoutEvent = () => {
      setUser(null);
    };
    window.addEventListener('auth_logout', handleLogoutEvent);
    return () => window.removeEventListener('auth_logout', handleLogoutEvent);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data.status === 'success') {
      const { accessToken, user } = res.data;
      setAccessToken(accessToken);
      setUser(user);
      localStorage.setItem('adhikarai_user', JSON.stringify(user));
    }
    return res.data;
  };

  const register = async (email: string, password: string, name: string, role?: string) => {
    await apiClient.post('/auth/register', { email, password, name, role });
  };

  const verifyOtp = async (email: string, otp: string) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    const { accessToken, user } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem('adhikarai_user', JSON.stringify(user));
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setAccessToken('');
    setUser(null);
    localStorage.removeItem('adhikarai_user');
  };

  const forgotPassword = async (email: string) => {
    await apiClient.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    await apiClient.post('/auth/reset-password', { email, otp, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        forgotPassword,
        resetPassword
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
