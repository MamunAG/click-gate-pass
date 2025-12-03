import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/lib/auth-provider";

const PrivateRoute = () => {
  const user = useAuth();
  if (!user?.token) return <Navigate to="/login" />;
  return <Outlet />;
};

export default PrivateRoute;
