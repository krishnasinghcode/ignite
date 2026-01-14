import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { accessToken, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!accessToken) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
