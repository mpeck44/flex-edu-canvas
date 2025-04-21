
// Sidebar group handling group label and grouping logic
import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-6", className)} {...props} />
  )
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pl-2", className)} {...props} />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("text-xs font-semibold uppercase text-muted-foreground px-4 py-2 tracking-wide", className)} 
      {...props} 
    />
  )
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export { SidebarGroup, SidebarGroupContent, SidebarGroupLabel };
