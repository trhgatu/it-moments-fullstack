import React from "react";
import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
  const isAuthenticated = () => {
    return localStorage.getItem("client_token") !== null;
  };

  if (isAuthenticated()) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;
