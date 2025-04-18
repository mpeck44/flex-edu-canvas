
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = false }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {showSidebar ? (
          <SidebarProvider>
            <div className="min-h-[calc(100vh-4rem)] flex w-full">
              {children}
            </div>
          </SidebarProvider>
        ) : (
          <main className="flex-1">{children}</main>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
