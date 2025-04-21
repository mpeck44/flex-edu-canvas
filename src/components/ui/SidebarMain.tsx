
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

// ---- Sidebar Container ----
const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();
    
    return (
      <aside
        ref={ref}
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-full w-64 flex-shrink-0 transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0",
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

// ---- Sidebar Content ----
const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
);
SidebarContent.displayName = "SidebarContent";

// ---- Sidebar Trigger ----
const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { toggle } = useSidebar();
    
    return (
      <button
        ref={ref}
        onClick={toggle}
        className={cn(
          "md:hidden text-sidebar-foreground bg-sidebar rounded shadow p-2 border border-sidebar-border",
          className
        )}
        aria-label="Toggle Sidebar"
        {...props}
      >
        <span className="sr-only">Toggle Sidebar</span>
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    );
  }
);
SidebarTrigger.displayName = "SidebarTrigger";

export { Sidebar, SidebarContent, SidebarTrigger };
