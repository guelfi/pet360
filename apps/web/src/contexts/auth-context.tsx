'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  businessId: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const requestOtp = async (phone: string) => {
    await api.post('/auth/otp/request', { phone });
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    const response = await api.post('/auth/otp/verify', { phone, otp });
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithOtp, requestOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
