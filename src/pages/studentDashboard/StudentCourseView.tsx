
import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { enrollStudentInCourse, getStudentEnrollment } from "@/services/courseService";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2 } from 'lucide-react';

const StudentCourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, any>>({});

  // Check if the user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !courseId) return;
      
      try {
        const enrollment = await getStudentEnrollment(courseId, user.id);
        if (enrollment) {
          setEnrolled(true);
          setEnrollmentId(enrollment.id);
          setProgress(enrollment.progress_json || {});
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    };
    
    checkEnrollment();
  }, [courseId, user]);

  // Fetch course details and lessons
  const { data: courseDetails, isLoading } = useQuery({
    queryKey: ['courseLessons', courseId],
    queryFn: async () => {
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      
      // Fetch lessons separately
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
        
      if (lessonsError) throw lessonsError;
      
      return { ...course, lessons };
    }
  });

  // Handle course enrollment
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to enroll");
      if (!courseId) throw new Error("Invalid course");
      
      return await enrollStudentInCourse(courseId, user.id);
    },
    onSuccess: (data) => {
      setEnrolled(true);
      setEnrollmentId(data.id);
      setProgress(data.progress_json || {});
      toast({
        title: "Success",
        description: "You have successfully enrolled in this course!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  const handleEnroll = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to enroll in a course.",
      });
      return;
    }
    
    enrollMutation.mutate();
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (!courseDetails?.lessons || courseDetails.lessons.length === 0) return 0;
    
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    return (completedLessons / courseDetails.lessons.length) * 100;
  };

  if (isLoading) return <div>Loading...</div>;
  if (!courseDetails) return <div>Course not found</div>;

  return (
    <MainLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>{courseDetails.title}</CardTitle>
            {enrolled && (
              <Progress value={calculateProgress()} className="h-2 mt-2" />
            )}
          </CardHeader>
          <CardContent>
            <p className="mb-6">{courseDetails.description}</p>
            
            {!enrolled ? (
              <Button onClick={handleEnroll} className="mt-4">
                Enroll in Course
              </Button>
            ) : (
              <div className="space-y-4 mt-4">
                {courseDetails.lessons && courseDetails.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {courseDetails.lessons
                      .sort((a, b) => a.order_index - b.order_index)
                      .map((lesson) => {
                        const isCompleted = progress[lesson.id]?.completed;
                        
                        return (
                          <Card key={lesson.id} className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {isCompleted && (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              <Button asChild>
                                <Link to={`/course/${courseId}/lesson/${lesson.id}`}>
                                  {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                                </Link>
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                ) : (
                  <p>This course doesn't have any lessons yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default StudentCourseView;
