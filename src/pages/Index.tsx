
import { useAuth } from "@/context/AuthContext";
import AuthPage from "./AuthPage";
import DashboardPage from "./DashboardPage";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <DashboardPage /> : <AuthPage />;
};

export default Index;
