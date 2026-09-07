import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string, university?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  switchDemoUser: (role: 'student' | 'admin') => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to demo student user for instant interactivity
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('notenest_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    // Default initial user for instant seamless experience
    return SEED_USERS[0]; // Alex Chen
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('notenest_user', JSON.stringify(user));
      localStorage.setItem('notenest_token', `demo-token-${user.id}`);
    } else {
      localStorage.removeItem('notenest_user');
      localStorage.removeItem('notenest_token');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string, university?: string) => {
    setLoading(true);
    try {
      const res = await api.register(name, email, password, university);
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await api.loginWithGoogle();
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const switchDemoUser = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      const adminUser = SEED_USERS.find(u => u.role === 'admin') || SEED_USERS[1];
      setUser(adminUser);
    } else {
      setUser(SEED_USERS[0]); // Alex Chen
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const res = await api.updateUserProfile(updates);
    setUser(res.user);
  };

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        loginWithGoogle,
        switchDemoUser,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
