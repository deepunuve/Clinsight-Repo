import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as staticLogin, logout as staticLogout } from '../api/authService';
import { setToken, removeToken } from '../services/tokenService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Loading state

  // Check if there's a user in sessionStorage when the component mounts
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));  // Set the full user object
      setToken(storedToken);  // Set the token if it exists in sessionStorage
    }
    setLoading(false);  // Set loading to false after checking storage
  }, []);

  const loginHandler = async (username, password, navigate) => {
    try {
      const data = await staticLogin(username, password);
      setUser(data.user);  // Set full user object
      setToken(data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));  // Save the full user object
      sessionStorage.setItem('token', data.token);
      if (data.user.role == "admin")
        navigate('/adminDashboard');
      else
        navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logoutHandler = (navigate) => {
    staticLogout();
    setUser(null);
    removeToken();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  // Show a loading screen while the user data is being loaded from sessionStorage
  if (loading) {
    return <div>Loading...</div>;  // Replace this with a spinner or any loading indicator if desired
  }

  return (
    <AuthContext.Provider value={{ user, login: loginHandler, logout: logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
