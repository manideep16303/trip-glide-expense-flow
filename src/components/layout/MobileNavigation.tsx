
import { Home, FileText, User, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== "/expenses" && location.pathname.startsWith(path));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50 shadow-lg">
      <div className="flex justify-around items-center">
        <Link
          to="/expenses"
          className={`flex flex-col items-center p-2 ${
            isActive("/expenses") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Expenses</span>
        </Link>
        <Link
          to="/trips"
          className={`flex flex-col items-center p-2 ${
            isActive("/trips") ? "text-primary" : "text-gray-500"
          }`}
        >
          <Briefcase size={24} />
          <span className="text-xs mt-1">Trips</span>
        </Link>
        <Link
          to="/report"
          className={`flex flex-col items-center p-2 ${
            isActive("/report") ? "text-primary" : "text-gray-500"
          }`}
        >
          <FileText size={24} />
          <span className="text-xs mt-1">Report</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 ${
            isActive("/profile") ? "text-primary" : "text-gray-500"
          }`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
