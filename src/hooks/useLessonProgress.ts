
import { useState, useEffect } from 'react';
import { getStudentEnrollment, updateLessonProgress } from '@/services/courseService';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useLessonProgress = (
  courseId: string | undefined,
  lessonId: string | undefined,
  userId: string | undefined
) => {
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!userId || !courseId || !lessonId) return;
      
      try {
        const enrollment = await getStudentEnrollment(courseId, userId);
        if (enrollment) {
          setEnrollmentId(enrollment.id);
          
          // Check if this lesson is already marked as completed
          if (enrollment.progress_json && 
              typeof enrollment.progress_json === 'object' && 
              enrollment.progress_json !== null && 
              lessonId && 
              enrollment.progress_json[lessonId]) {
            setIsLessonCompleted(!!enrollment.progress_json[lessonId].completed);
          }
        } 
      } catch (error) {
        console.error("Error checking enrollment:", error);
      }
    };
    
    checkEnrollment();
  }, [courseId, lessonId, userId]);

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

  return {
    isLessonCompleted,
    enrollmentId,
    handleMarkComplete
  };
};
