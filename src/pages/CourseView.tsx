
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { BookOpen, Users, Clock, User, ChevronLeft, ChevronRight, Check, PlayCircle, FileText } from "lucide-react";

// Sample course data
const COURSE_DATA = {
  id: "1",
  title: "Introduction to Biology",
  description: "Learn the fundamentals of biology, from cells to ecosystems. This comprehensive course covers the essential concepts every biology student needs to understand the living world around us.",
  instructor: "Dr. Jane Smith",
  level: "Beginner",
  category: "Science",
  lessons: [
    { id: "1", title: "Introduction to the Course", duration: "10 min", completed: true },
    { id: "2", title: "The Cell: Basic Unit of Life", duration: "25 min", completed: false },
    { id: "3", title: "Cell Structure and Function", duration: "30 min", completed: false },
    { id: "4", title: "Cell Division and Reproduction", duration: "35 min", completed: false },
    { id: "5", title: "Genetics and Inheritance", duration: "40 min", completed: false },
    { id: "6", title: "DNA and Protein Synthesis", duration: "45 min", completed: false },
  ],
  students: 156,
  reviews: 4.8,
  image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=500&auto=format&fit=crop",
  progress: 15,
};

const CourseView = () => {
  const { courseId } = useParams();
  const [activeLesson, setActiveLesson] = useState("1");
  const [enrolled, setEnrolled] = useState(false);
  
  // In a real app, we would fetch the course based on courseId
  const course = COURSE_DATA;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/courses">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
          </Button>
        </div>
        
        {/* Course Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Instructor: {course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span>{course.lessons.length} lessons</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant="secondary">{course.level}</Badge>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video rounded-md overflow-hidden mb-6">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {enrolled ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex-between">
                        <span className="text-sm font-medium">Your progress</span>
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button className="w-full" asChild>
                      <Link to={`/student/courses/${course.id}`}>
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => setEnrolled(true)}>
                    Enroll in Course
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Course Content */}
        <Tabs defaultValue="curriculum" className="space-y-6">
          <TabsList>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculum">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                <div className="space-y-2">
                  {course.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className={`border rounded-md p-4 cursor-pointer transition-colors ${lesson.id === activeLesson ? 'border-primary bg-primary/5' : 'hover:bg-accent'} ${lesson.completed ? 'border-green-200' : ''}`}
                      onClick={() => setActiveLesson(lesson.id)}
                    >
                      <div className="flex-between">
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <div className="h-7 w-7 rounded-full bg-green-100 flex-center">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-primary/10 flex-center">
                              <PlayCircle className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{lesson.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.duration}
                          </span>
                          {lesson.id === activeLesson && (
                            <ChevronRight className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">About this course</h2>
                  <p className="text-muted-foreground">
                    This comprehensive introduction to biology covers all the essential concepts students need to understand the living world. From cells to ecosystems, you'll learn about the building blocks of life and how they work together to create the incredible diversity we see on Earth.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">What you'll learn</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Understand the fundamental structure and function of cells</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Explain the processes of cell division and reproduction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Describe the basic principles of genetics and inheritance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Identify the key molecules of life and their functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Apply scientific thinking to biological problems</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">Prerequisites</h2>
                  <p className="text-muted-foreground">
                    No prior knowledge of biology is required. This course is designed for beginners who are interested in learning about the basics of biology.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CourseView;
