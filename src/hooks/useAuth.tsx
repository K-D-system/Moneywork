import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Define user type
interface User {
  id: number;
  email: string;
  name: string;
  familyId: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, familyId?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// API base URL - you might want to move this to a config file
const API_URL = 'https://your-api-url.com'; // Replace with your actual API URL

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userJson = await SecureStore.getItemAsync('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Přihlášení selhalo');
      }

      const userData = await response.json();
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      Alert.alert('Chyba přihlášení', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string, familyId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, familyId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registrace selhala');
      }

      const userData = await response.json();
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      Alert.alert('Chyba registrace', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
      });
      await SecureStore.deleteItemAsync('user');
      setUser(null);
      queryClient.clear(); // Clear all query cache on logout
    } catch (err) {
      const error = err as Error;
      setError(error);
      Alert.alert('Chyba odhlášení', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};