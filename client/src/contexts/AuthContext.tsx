import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, isAuthenticated, logout as logoutApi } from '../api/authApi';

// Define the shape of context
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes auth object available
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    const authenticated = isAuthenticated();

    setUser(storedUser);
    setIsLoggedIn(authenticated);
  }, []);

  // Login function to update context state
  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Logout function to clear context state
  const logout = () => {
    logoutApi(); // Call the API logout function
    setUser(null);
    setIsLoggedIn(false);
  };

  // Value object that will be passed to provider
  const value = {
    user,
    isLoggedIn,
    setUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
