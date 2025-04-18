
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Sample course data
const COURSES = [
  {
    id: "1",
    title: "Introduction to Biology",
    description: "Learn the fundamentals of biology, from cells to ecosystems.",
    instructor: "Dr. Jane Smith",
    level: "Beginner",
    category: "Science",
    lessons: 12,
    students: 156,
    image: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "World History: Ancient Civilizations",
    description: "Explore the rise and fall of great ancient civilizations around the world.",
    instructor: "Prof. Michael Johnson",
    level: "Intermediate",
    category: "History",
    lessons: 18,
    students: 94,
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Algebra Fundamentals",
    description: "Master the core concepts of algebra with interactive exercises and problem-solving.",
    instructor: "Sarah Williams, M.Ed",
    level: "Beginner",
    category: "Mathematics",
    lessons: 15,
    students: 210,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Creative Writing Workshop",
    description: "Develop your storytelling skills and learn techniques for effective creative writing.",
    instructor: "Emily Parker",
    level: "All Levels",
    category: "English",
    lessons: 8,
    students: 67,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Chemistry in Everyday Life",
    description: "Discover the chemistry behind everyday phenomena and household products.",
    instructor: "Dr. Robert Chen",
    level: "Intermediate",
    category: "Science",
    lessons: 10,
    students: 89,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Digital Citizenship & Online Safety",
    description: "Essential skills for navigating the digital world safely and responsibly.",
    instructor: "Alex Thompson",
    level: "Beginner",
    category: "Technology",
    lessons: 6,
    students: 123,
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=500&auto=format&fit=crop"
  }
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredCourses = COURSES.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex-between flex-col md:flex-row gap-4 mb-8">
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex-between mb-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="secondary">{course.level}</Badge>
                </div>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                <div className="flex-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons} lessons
                  </span>
                  <span className="text-muted-foreground">{course.students} students</span>
                </div>
              </CardContent>
              <CardFooter className="flex-between">
                <p className="text-sm text-muted-foreground">By {course.instructor}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/courses/${course.id}`}>View Course</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Courses;
