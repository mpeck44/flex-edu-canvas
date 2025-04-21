
import * as React from "react";
import { cn } from "@/lib/utils";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("space-y-1", className)} {...props} />
  )
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("flex items-center", className)} {...props} />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef<HTMLButtonElement & React.AnchorHTMLAttributes<HTMLButtonElement>, any>(
  ({ className, asChild, ...props }, ref) => {
    // Allow both <button> and asChild (for <Link>)
    const Comp = asChild ? React.Fragment : "button";
    return asChild ? (
      <>{props.children}</>
    ) : (
      <button ref={ref} className={cn("w-full text-left px-4 py-2 hover:bg-sidebar-accent rounded transition", className)} {...props} />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export { SidebarMenu, SidebarMenuItem, SidebarMenuButton };
