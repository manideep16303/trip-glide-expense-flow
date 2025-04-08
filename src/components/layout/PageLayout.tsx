
import { ReactNode } from "react";
import Header from "./Header";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          &copy; {new Date().getFullYear()} TripGlide - A Travel Expense Management App
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
