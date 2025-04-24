
import React from 'react';
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Plus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Sample data for demonstration
const INSTRUCTOR_COURSES = [
  {
    id: "1",
    title: "Introduction to Biology",
    students: 156,
    modules: 8,
    lessons: 24,
    published: true,
    lastUpdated: "2025-03-15"
  },
  {
    id: "2",
    title: "World History: Ancient Civilizations",
    students: 94,
    modules: 6,
    lessons: 18,
    published: true,
    lastUpdated: "2025-02-28"
  },
  {
    id: "3",
    title: "Algebra Fundamentals",
    students: 210,
    modules: 12,
    lessons: 36,
    published: true,
    lastUpdated: "2025-04-10"
  },
  {
    id: "4",
    title: "Creative Writing Workshop",
    students: 67,
    modules: 4,
    lessons: 12,
    published: false,
    lastUpdated: "2025-04-22"
  },
];

const InstructorCourses = () => {
  return (
    <MainLayout showSidebar>
      <CoursesSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex-between flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Manage your course catalog</p>
          </div>
          <Button asChild>
            <Link to="/instructor/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>
              View and manage all your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Students</TableHead>
                  <TableHead className="text-center">Modules</TableHead>
                  <TableHead className="text-center">Lessons</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INSTRUCTOR_COURSES.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>
                      {course.published ? (
                        <Badge className="bg-green-500 hover:bg-green-700">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{course.students}</TableCell>
                    <TableCell className="text-center">{course.modules}</TableCell>
                    <TableCell className="text-center">{course.lessons}</TableCell>
                    <TableCell>{course.lastUpdated}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/instructor/courses/${course.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </MainLayout>
  );
};

export default InstructorCourses;
