
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  userType: "patient" | "doctor";
}

const PrivateRoute = ({ children, userType }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.userType !== userType) {
    return <Navigate to={`/${currentUser.userType}-dashboard`} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
