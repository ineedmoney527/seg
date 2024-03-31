// AuthContext.js

import React, { createContext, useContext, useState } from "react";

// Renamed context variable to AuthContextProvider
const AuthContextProvider = createContext();

const AuthContext = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    expiresIn: null,
    authState: null,
  });

  const signIn = ({ token, expiresIn, tokenType, authState }) => {
    setAuthState({
      isAuthenticated: true,
      token: `${tokenType} ${token}`,
      expiresIn,
      authState,
    });
  };

  const signOut = () => {
    setAuthState({
      isAuthenticated: false,
      token: null,
      expiresIn: null,
      authState: null,
    });
  };

  return (
    <AuthContextProvider.Provider value={{ authState, signIn, signOut }}>
      {children}
    </AuthContextProvider.Provider>
  );
};

export const useAuth = () => useContext(AuthContextProvider);
export default AuthContext;
