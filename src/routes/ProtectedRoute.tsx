// components/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../redux/Features/Auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const pathname = useLocation().pathname;
  const user = useSelector(useCurrentUser) as any;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.assignedPages?.includes(pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
