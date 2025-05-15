
import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from 'lucide-react';
import { useLessonQuery } from '@/hooks/useLessonQuery';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import ContentRenderer from '@/components/coursePlayer/ContentRenderer';
import LessonHeader from '@/components/coursePlayer/LessonHeader';
import LessonNavigation from '@/components/coursePlayer/LessonNavigation';

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Custom hooks for lesson data and progress tracking
  const { 
    lessonData,
    isLoading,
    lessonContent,
    nextLessonId,
    prevLessonId
  } = useLessonQuery(courseId, lessonId);

  const {
    isLessonCompleted,
    enrollmentId,
    handleMarkComplete
  } = useLessonProgress(courseId, lessonId, user?.id);

  // Navigation handlers
  const navigateToNextLesson = () => {
    if (nextLessonId && courseId) {
      navigate(`/course/${courseId}/lesson/${nextLessonId}`);
    }
  };
  
  const navigateToPrevLesson = () => {
    if (prevLessonId && courseId) {
      navigate(`/course/${courseId}/lesson/${prevLessonId}`);
    }
  };

  const navigateToCourse = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    }
  };

  // Handle enrollment check
  React.useEffect(() => {
    if (user && courseId && !enrollmentId && !isLoading) {
      // If we've checked and there's no enrollment, redirect
      if (lessonData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be enrolled in this course to view lessons.",
        });
        navigate(`/courses/${courseId}`);
      }
    }
  }, [user, courseId, enrollmentId, navigate, isLoading, lessonData]);

  if (isLoading) return <div>Loading...</div>;
  if (!lessonData) return <div>Lesson not found</div>;

  const { lesson, navigation } = lessonData;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={navigateToCourse}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Course
          </Button>
          <div className="text-sm text-muted-foreground">
            Lesson {navigation.current} of {navigation.total}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <LessonHeader
              title={lesson.title}
              currentLesson={navigation.current}
              totalLessons={navigation.total}
              isCompleted={isLessonCompleted}
            />
          </CardHeader>
          <CardContent>
            <ContentRenderer lessonContent={lessonContent} />
            
            <LessonNavigation
              prevLessonId={prevLessonId}
              nextLessonId={nextLessonId}
              isLessonCompleted={isLessonCompleted}
              onMarkComplete={handleMarkComplete}
              onNavigateToPrev={navigateToPrevLesson}
              onNavigateToNext={navigateToNextLesson}
              onFinishCourse={navigateToCourse}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CoursePlayer;
