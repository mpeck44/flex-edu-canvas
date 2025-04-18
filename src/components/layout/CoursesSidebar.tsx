
import { Home, BookOpen, Users, Settings, BarChart, Plus, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const CoursesSidebar = () => {
  const { isInstructor } = useAuth();

  const instructorMenuItems = [
    {
      title: "Dashboard",
      url: "/instructor",
      icon: Home,
    },
    {
      title: "My Courses",
      url: "/instructor/courses",
      icon: BookOpen,
    },
    {
      title: "Students",
      url: "/instructor/students",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/instructor/analytics",
      icon: BarChart,
    },
    {
      title: "Settings",
      url: "/instructor/settings",
      icon: Settings,
    },
  ];

  const studentMenuItems = [
    {
      title: "Dashboard",
      url: "/student",
      icon: Home,
    },
    {
      title: "My Courses",
      url: "/student/courses",
      icon: BookOpen,
    },
    {
      title: "Profile",
      url: "/student/profile",
      icon: User,
    },
  ];

  const menuItems = isInstructor ? instructorMenuItems : studentMenuItems;

  return (
    <>
      <Sidebar>
        <SidebarContent>
          {isInstructor && (
            <div className="p-4">
              <Button className="w-full flex items-center justify-center" asChild>
                <Link to="/instructor/courses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Course
                </Link>
              </Button>
            </div>
          )}
          
          <SidebarGroup>
            <SidebarGroupLabel>{isInstructor ? "Instructor" : "Student"}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="hidden md:block absolute top-4 left-4 z-40">
        <SidebarTrigger />
      </div>
    </>
  );
};

export default CoursesSidebar;
