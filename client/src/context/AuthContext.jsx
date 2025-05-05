import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    // Make sure we're storing the token
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    // Set default authorization header for all axios requests
    if (userData && userData.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
