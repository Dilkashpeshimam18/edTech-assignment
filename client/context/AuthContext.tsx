"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types/types';

type AuthContextValue = {
  user: User;
  login: (user: NonNullable<User>) => void; 
  logout: () => void;
  loading :boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
        setLoading(false);

    
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (u: NonNullable<User>) => setUser(u);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('enrollments');
  };

  return <AuthContext.Provider value={{ user, login, logout,loading  }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
