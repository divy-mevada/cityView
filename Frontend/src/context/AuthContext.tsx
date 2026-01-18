import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'citizen' | 'government') => Promise<boolean>;
  register: (username: string, password: string, name: string, email: string, role: 'citizen' | 'government') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'citizen' | 'government'): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Ensure role matches what was selected on landing page
        if (data.user.role !== role) {
          throw new Error(`Unauthorized role. Selected ${role} but user is ${data.user.role}`);
        }

        const newUser: User = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          name: data.user.name
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

    setIsLoading(false);
    return false;
  };

  const register = async (username: string, password: string, name: string, email: string, role: 'citizen' | 'government'): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, role }),
      });

      if (response.ok) {
        const data = await response.json();

        const newUser: User = {
          id: data.user.id,
          username: data.user.username,
          role: data.user.role,
          name: data.user.name
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};