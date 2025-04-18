
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Award, GraduationCap, ArrowRight } from "lucide-react";

const StudentDashboard = () => {
  // Sample data
  const enrolledCourses = [
    {
      id: "1",
      title: "Introduction to Biology",
      instructor: "Dr. Jane Smith",
      progress: 75,
      nextLesson: "Cell Structure and Function",
      category: "Science",
      image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: "3",
      title: "Algebra Fundamentals",
      instructor: "Sarah Williams, M.Ed",
      progress: 45,
      nextLesson: "Solving Linear Equations",
      category: "Mathematics",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop"
    },
    {
      id: "4",
      title: "Creative Writing Workshop",
      instructor: "Emily Parker",
      progress: 10,
      nextLesson: "Character Development",
      category: "English",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop"
    }
  ];

  const achievements = [
    { title: "Fast Learner", description: "Complete 3 lessons in one day" },
    { title: "Perfect Score", description: "Get 100% on any quiz" },
    { title: "Course Completed", description: "Finish your first course" }
  ];

  return (
    <MainLayout showSidebar>
      <CoursesSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex-between flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Student!</p>
          </div>
          <Button asChild>
            <Link to="/courses">
              Browse All Courses
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          {/* Continue Learning Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex-between mb-1">
                      <Badge variant="outline">{course.category}</Badge>
                      <span className="text-sm text-muted-foreground">{course.progress}% complete</span>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>Instructor: {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Progress value={course.progress} className="h-2 mb-4" />
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Next: {course.nextLesson}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to={`/student/courses/${course.id}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Summary & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex-between">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/student/progress">
                    View Detailed Progress
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Achievements
                </CardTitle>
                <CardDescription>
                  Milestones you've reached
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.title} className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full flex items-center" asChild>
                  <Link to="/student/achievements">
                    View All Achievements
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default StudentDashboard;
