
import { useAuth } from "@/context/AuthContext";
import AuthPage from "./AuthPage";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/expenses" replace /> : <AuthPage />;
};

export default Index;
