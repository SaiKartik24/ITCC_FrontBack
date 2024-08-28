import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    console.log(newToken);
  };
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
