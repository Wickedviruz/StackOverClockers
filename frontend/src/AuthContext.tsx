// frontend/src/AuthContext.tsx
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
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { access_token, username: fetchedUsername, role } = response.data;
  
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('username', fetchedUsername);
      localStorage.setItem('role', role);
  
      setUser({ username: fetchedUsername, role });
      console.log('Login successful, user set:', { username: fetchedUsername, role });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  

  const register = async (username: string, email: string, password: string) => {
    await axios.post(`${API_URL}/auth/register`, { username, email, password });
    await login(username, password); // Logga in automatiskt efter registrering
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
