
import { ReactNode } from "react";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6">
        {children}
      </main>
      <MobileNavigation />
      <div className="pb-16">
        {/* Space for mobile navigation */}
      </div>
    </div>
  );
};

export default PageLayout;
