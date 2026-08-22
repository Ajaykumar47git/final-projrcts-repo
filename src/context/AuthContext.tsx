import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import { auth } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, fullName: string, role: 'resident' | 'administrator') => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await auth.signIn(email, password);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: 'resident' | 'administrator') => {
    const u = await auth.signUp(email, password, fullName, role);
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await auth.resetPassword(email);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    const u = await auth.updateProfile(user.id, updates);
    setUser(u);
    return u;
  }, [user]);

  const refreshUser = useCallback(() => {
    const currentUser = auth.currentUser();
    setUser(currentUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, resetPassword, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
