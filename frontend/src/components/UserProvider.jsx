// src/components/UserProvider.jsx
import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.userInfo);
  const userId = user?._id || null;

  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
};

export const useUserId = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserId must be used within UserProvider");
  }
  return context;
};
