
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleForm = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-md bg-primary p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M18 7V4H8a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10" />
              <path d="M18 22H6" />
              <path d="M18 14v4" />
              <path d="M15 18h6" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold">TripGlide</h1>
        <p className="text-gray-600 mt-1">Streamlined Travel Expense Management</p>
      </div>
      <div className="w-full max-w-md">
        {isLoginView ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
