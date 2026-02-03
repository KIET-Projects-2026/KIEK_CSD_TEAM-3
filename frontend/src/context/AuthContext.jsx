import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage to avoid initial render flash
  // This ensures that on refresh, the state is immediately correct
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        console.error("Failed to parse auth_user", e);
        return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [role, setRole] = useState(() => localStorage.getItem('auth_role'));

  // Derived state for easier checking
  const isAuthenticated = !!token;

  const login = (userData, newToken, newRole) => {
    // 1. Update State
    setUser(userData);
    setToken(newToken);
    setRole(newRole);

    // 2. Persist to Storage
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_role', newRole);
  };

  const logout = () => {
    // 1. Clear State
    setUser(null);
    setToken(null);
    setRole(null);

    // 2. Clear Storage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  };

  const updateUser = (updatedData) => {
      setUser((prevUser) => {
          const newUser = { ...prevUser, ...updatedData };
          localStorage.setItem('auth_user', JSON.stringify(newUser));
          return newUser;
      });
  };

  // Optional: Sync with storage events (if multiple tabs need to sync logout, etc.)
  useEffect(() => {
      const handleStorageChange = (e) => {
          if (e.key === 'auth_token' && e.newValue === null) {
              logout();
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
