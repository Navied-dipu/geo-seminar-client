import React from "react";

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivetRouts({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  // console.log(location);
  if (loading) {
    <span className="loading loading-spinner loading-xl"></span>;
  }
  if (!user) {
    return <Navigate state={{from: location.pathname}} to="/login"></Navigate>;
  }
  return children;
}
