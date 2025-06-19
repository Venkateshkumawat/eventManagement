import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by calling /profile
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Login check failed:", err.message);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, [API_BASE_URL]);

  // Normal login
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
