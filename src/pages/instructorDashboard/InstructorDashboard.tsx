
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, Users, BookOpen, Plus, ArrowRight, Clock, Settings } from "lucide-react";

const InstructorDashboard = () => {
  // Sample data for demonstration
  const stats = [
    { 
      title: "Total Courses", 
      value: "5", 
      change: "+1 this month", 
      icon: <BookOpen className="h-5 w-5 text-blue-500" />
    },
    { 
      title: "Active Students", 
      value: "357", 
      change: "+24 this week", 
      icon: <Users className="h-5 w-5 text-green-500" />
    },
    { 
      title: "Quiz Completion", 
      value: "76%", 
      change: "+3% from last month", 
      icon: <BarChart className="h-5 w-5 text-purple-500" />
    },
    { 
      title: "Avg. Session Time", 
      value: "26m", 
      change: "+2m from last week", 
      icon: <Clock className="h-5 w-5 text-orange-500" />
    },
  ];

  const recentCourses = [
    { id: "1", title: "Introduction to Biology", students: 156, progress: 85 },
    { id: "2", title: "World History: Ancient Civilizations", students: 94, progress: 65 },
    { id: "3", title: "Algebra Fundamentals", students: 210, progress: 90 },
  ];

  return (
    <MainLayout showSidebar>
      <CoursesSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex-between flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Professor!</p>
          </div>
          <Button asChild>
            <Link to="/instructor/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>
                Your most active courses from the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.students} enrolled students
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/instructor/courses/${course.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/instructor/courses/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Course
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/instructor/students">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Students
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/instructor/analytics">
                  <BarChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/instructor/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </MainLayout>
  );
};

export default InstructorDashboard;
