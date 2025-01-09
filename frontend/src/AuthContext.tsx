import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, acceptedPrivacyPolicy: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean; // Ny funktion för att kontrollera om användaren är autentiserad
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      setUser({ username, role });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    const { access_token, username: fetchedUsername, role } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('username', fetchedUsername);
    localStorage.setItem('role', role);

    setUser({ username: fetchedUsername, role });
  };

  const register = async (username: string, email: string, password: string, acceptedPrivacyPolicy: boolean) => {
    await axios.post(`${API_URL}/auth/register`, { username, email, password, accepted_privacy_policy: acceptedPrivacyPolicy });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  const checkAuth = (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
