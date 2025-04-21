
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

export { SidebarGroup, SidebarGroupContent };
