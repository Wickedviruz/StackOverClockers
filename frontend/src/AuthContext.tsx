// frontend/src/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    const profile = await axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${response.data.access_token}` }
    });
    setUser(profile.data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    await axios.post('/api/register', { username, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
