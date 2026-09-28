import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error?: { message: string } }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AUTH_STORAGE_KEY = 'glass-notes:auth:user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Provide a default active user session for instant seamless access
        const defaultUser: User = {
          id: 'user-default',
          email: 'student@glassnotes.io',
          user_metadata: {
            username: 'Student',
            full_name: 'Student',
          },
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    // In browser client without remote supabase credentials, provide immediate simulated sign in
    const googleUser: User = {
      id: `user-g-${Date.now().toString(36)}`,
      email: 'alex.chen@gmail.com',
      user_metadata: {
        username: 'Alex Chen',
        full_name: 'Alex Chen',
      },
    };
    setUser(googleUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    return {};
  };

  const signInWithPassword = async (email: string, password: string) => {
    if (!email || !password) {
      return { error: { message: 'Please provide email and password.' } };
    }
    const username = email.split('@')[0] || 'User';
    const loggedUser: User = {
      id: `user-${Date.now().toString(36)}`,
      email,
      user_metadata: {
        username,
        full_name: username,
      },
    };
    setUser(loggedUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
    return {};
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (!email || !password || !username) {
      return { error: { message: 'All fields are required.' } };
    }
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      email,
      user_metadata: {
        username: username.trim(),
        full_name: username.trim(),
      },
    };
    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    return {};
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'guest-' + Math.random().toString(36).slice(2, 7),
      email: 'guest@glassnotes.io',
      user_metadata: {
        username: 'Guest Explorer',
        full_name: 'Guest Explorer',
      },
    };
    setUser(guestUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(guestUser));
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signInWithPassword,
      signUp,
      signOut,
      continueAsGuest,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
