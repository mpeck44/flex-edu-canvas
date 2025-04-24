
import React, { useEffect, useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Plus, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const InstructorCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;

      try {
        setLoading(true);
        console.log("Fetching courses for instructor:", user.id);
        
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('instructor_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching courses:", error);
          throw error;
        }
        
        console.log("Fetched courses:", data);
        
        // Transform the data to match our UI format
        const formattedCourses = data.map(course => ({
          id: course.id,
          title: course.title,
          students: 0, // We'll need another query to count enrolled students
          modules: 0, // We'll need another query to count modules
          lessons: 0, // We'll need another query to count lessons
          published: course.is_published || false,
          lastUpdated: new Date(course.updated_at).toISOString().split('T')[0]
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, toast]);

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
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">You haven't created any courses yet</p>
                <Button asChild>
                  <Link to="/instructor/courses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Link>
                </Button>
              </div>
            ) : (
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
                  {courses.map((course) => (
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
            )}
          </CardContent>
        </Card>
      </main>
    </MainLayout>
  );
};

export default InstructorCourses;
