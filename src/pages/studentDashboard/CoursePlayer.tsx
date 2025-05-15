
import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { getStudentEnrollment, updateLessonProgress } from "@/services/courseService";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null);

  // Check enrollment and lesson completion status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !courseId) return;
      
      try {
        const enrollment = await getStudentEnrollment(courseId, user.id);
        if (enrollment) {
          setEnrollmentId(enrollment.id);
          
          // Check if this lesson is already marked as completed
          if (enrollment.progress_json && enrollment.progress_json[lessonId!]) {
            setIsLessonCompleted(enrollment.progress_json[lessonId!].completed);
          }
        } else {
          // Not enrolled, redirect to course page
          toast({
            variant: "destructive",
            title: "Error",
            description: "You must be enrolled in this course to view lessons.",
          });
          navigate(`/courses/${courseId}`);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    };
    
    checkEnrollment();
  }, [courseId, lessonId, user, navigate]);

  // Fetch lesson details and navigation information
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lessonDetails', lessonId, courseId],
    queryFn: async () => {
      // Get the current lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      
      // Get all lessons for this course to determine next/prev
      const { data: allLessons, error: allLessonsError } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('course_id', courseId)
        .order('order_index');
        
      if (allLessonsError) throw allLessonsError;
      
      // Find current lesson index and determine next/prev
      const currentIndex = allLessons.findIndex(l => l.id === lessonId);
      const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
      const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
      
      return { 
        lesson, 
        navigation: { 
          prev: prevLesson,
          next: nextLesson,
          total: allLessons.length,
          current: currentIndex + 1
        }
      };
    }
  });

  // Update next/prev lesson IDs when data changes
  useEffect(() => {
    if (lessonData) {
      setNextLessonId(lessonData.navigation.next?.id || null);
      setPrevLessonId(lessonData.navigation.prev?.id || null);
    }
  }, [lessonData]);

  // Mutation to mark lesson as complete
  const markLessonCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!enrollmentId || !lessonId) throw new Error("Missing enrollment or lesson information");
      return await updateLessonProgress(enrollmentId, lessonId, true);
    },
    onSuccess: () => {
      setIsLessonCompleted(true);
      toast({
        title: "Success",
        description: "Lesson marked as complete!",
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

  const handleMarkComplete = () => {
    markLessonCompleteMutation.mutate();
  };

  const navigateToNextLesson = () => {
    if (nextLessonId) {
      navigate(`/course/${courseId}/lesson/${nextLessonId}`);
    }
  };
  
  const navigateToPrevLesson = () => {
    if (prevLessonId) {
      navigate(`/course/${courseId}/lesson/${prevLessonId}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!lessonData) return <div>Lesson not found</div>;

  const { lesson, navigation } = lessonData;
  const lessonContent = lesson.content || [];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
          </Button>
          <div className="text-sm text-muted-foreground">
            Lesson {navigation.current} of {navigation.total}
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{lesson.title}</h1>
              <Progress 
                value={(navigation.current / navigation.total) * 100} 
                className="h-2 mt-2 w-full max-w-md" 
              />
            </div>
            {isLessonCompleted && (
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle className="h-5 w-5" />
                <span>Completed</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="prose max-w-full mb-8">
              {lessonContent.map((block, index) => {
                switch(block.type) {
                  case 'text':
                    return <p key={index}>{block.content}</p>;
                  case 'image':
                    return <img key={index} src={block.content} alt="Lesson content" className="my-4" />;
                  case 'video':
                    return (
                      <div key={index} className="my-4">
                        <iframe 
                          width="100%" 
                          height="400" 
                          src={block.content} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  case 'link':
                    return (
                      <div key={index} className="my-2">
                        <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {block.content}
                        </a>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={navigateToPrevLesson}
                disabled={!prevLessonId}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              
              <div>
                {!isLessonCompleted && (
                  <Button 
                    onClick={handleMarkComplete}
                    className="mr-4"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
                
                {nextLessonId ? (
                  <Button onClick={navigateToNextLesson}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/courses/${courseId}`)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Finish Course
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CoursePlayer;
