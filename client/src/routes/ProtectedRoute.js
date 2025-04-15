import { useAuth } from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
