
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const StudentCourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrolled, setEnrolled] = useState(false);

  // Fetch course details and lessons
  const { data: courseDetails, isLoading } = useQuery({
    queryKey: ['courseLessons', courseId],
    queryFn: async () => {
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
          id, 
          title, 
          description, 
          lessons:modules(
            id, 
            title, 
            lessons(id, title, order_index)
          )
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      return course;
    }
  });

  // Handle course enrollment
  const handleEnroll = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to enroll in a course.",
        });
        return;
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({ 
          course_id: courseId, 
          student_id: sessionData.session.user.id 
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        return;
      }

      setEnrolled(true);
      toast({
        title: "Success",
        description: "You have successfully enrolled in this course!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!courseDetails) return <div>Course not found</div>;

  return (
    <MainLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>{courseDetails.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{courseDetails.description}</p>
            
            {!enrolled ? (
              <Button onClick={handleEnroll} className="mt-4">
                Enroll in Course
              </Button>
            ) : (
              <div className="space-y-4 mt-4">
                {courseDetails.lessons.map((module) => (
                  <div key={module.id} className="space-y-2">
                    <h3 className="font-semibold">{module.title}</h3>
                    {module.lessons.map((lesson) => (
                      <Card key={lesson.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <span>{lesson.title}</span>
                          <Button asChild>
                            <Link to={`/course/${courseId}/lesson/${lesson.id}`}>
                              Start Lesson
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudentCourseView;
