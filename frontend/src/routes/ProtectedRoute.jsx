import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "ROLE_ADMIN" && window.location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
