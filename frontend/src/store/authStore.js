import { create } from 'zustand';

// Helper to get user from local storage safely
const getUserFromStorage = () => {
    try {
        const stored = localStorage.getItem('auth_user');
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        return null; // Invalid JSON
    }
}

export const useAuthStore = create((set) => ({
  user: getUserFromStorage(),
  token: localStorage.getItem('auth_token') || null,
  role: localStorage.getItem('auth_role') || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),

  login: (userData, token, role) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_role', role);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    set({
      user: userData,
      token,
      role,
      isAuthenticated: true,
    });
  },

  // Register action (updates state similar to login)
  register: (userData, token, role) => {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_role', role);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      set({
        user: userData,
        token,
        role,
        isAuthenticated: true,
      });
  },

  updateUser: (updatedData) => {
    set((state) => {
        const newUser = { ...state.user, ...updatedData };
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        return { user: newUser };
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_user');
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
    });
  },
}));
