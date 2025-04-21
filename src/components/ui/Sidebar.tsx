
import * as React from "react";
import { cn } from "@/lib/utils";

// ---- Sidebar Container ----
const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-full w-64 flex-shrink-0 hidden md:block",
        className
      )}
      {...props}
    />
  )
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
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "md:hidden text-sidebar-foreground bg-sidebar rounded shadow p-2 border border-sidebar-border",
        className
      )}
      aria-label="Open Sidebar"
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  )
);
SidebarTrigger.displayName = "SidebarTrigger";

export { Sidebar, SidebarContent, SidebarTrigger };
