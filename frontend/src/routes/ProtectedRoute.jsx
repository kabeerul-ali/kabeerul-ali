
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Verifying admin access..." fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
