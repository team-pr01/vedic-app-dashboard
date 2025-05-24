/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminPath?: string; // Path to redirect admins
  userPath?: string; // Path to redirect users
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminPath = "/admin/courses",
  userPath = "/dashboard",
}) => {
  const user = useSelector((state: any) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (user.role === "admin" && location.pathname.startsWith("/dashboard")) {
    return <Navigate to={adminPath} replace />;
  }

  if (user.role === "user" && location.pathname.startsWith("/admin")) {
    return <Navigate to={userPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
