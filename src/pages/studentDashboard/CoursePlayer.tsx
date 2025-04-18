
import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const CoursePlayer = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Fetch lesson details
  const { data: lessonDetails, isLoading } = useQuery({
    queryKey: ['lessonDetails', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Mutation to mark lesson as complete
  const markLessonCompleteMutation = useMutation({
    mutationFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('enrollments')
        .update({ completed_at: new Date().toISOString() })
        .eq('course_id', courseId)
        .eq('student_id', sessionData.session.user.id);

      if (error) throw error;
      setIsLessonCompleted(true);
      toast({
        title: "Success",
        description: "Lesson marked as complete!",
      });
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!lessonDetails) return <div>Lesson not found</div>;

  return (
    <MainLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">{lessonDetails.title}</h1>
            <Progress value={isLessonCompleted ? 100 : 0} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: lessonDetails.content || '' }} />
            
            {!isLessonCompleted && (
              <Button 
                onClick={() => markLessonCompleteMutation.mutate()}
                className="mt-4"
              >
                Mark Lesson Complete
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CoursePlayer;
