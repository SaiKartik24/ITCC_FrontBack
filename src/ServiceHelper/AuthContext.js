import React, { createContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();
// Create a provider component
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const login = (newToken) => {
    if (typeof newToken === 'string') {
      setToken(newToken);
      console.log('Token set:', newToken);
    } else {
      console.error('Invalid token format');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    console.log('Logged out');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };