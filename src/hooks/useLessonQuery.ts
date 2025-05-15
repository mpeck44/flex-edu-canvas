
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LessonNavigation {
  prev: {
    id: string;
    title: string;
  } | null;
  next: {
    id: string;
    title: string;
  } | null;
  total: number;
  current: number;
}

export interface ContentBlock {
  type: string;
  content: string;
  id: string;
}

// Helper function to safely transform Json to ContentBlock array
const transformToContentBlocks = (content: any): ContentBlock[] => {
  if (!content) return [];
  
  // If content is an array, map each item to ensure it has the required structure
  if (Array.isArray(content)) {
    return content.map(item => {
      // Ensure each item has id, type, and content properties
      if (typeof item === 'object' && item !== null && 'id' in item && 'type' in item && 'content' in item) {
        return {
          id: String(item.id),
          type: String(item.type),
          content: String(item.content)
        };
      }
      // Fallback for any item that doesn't match our structure
      return {
        id: `block-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: typeof item === 'string' ? item : JSON.stringify(item)
      };
    });
  }
  
  // If it's not an array, return an empty array
  return [];
};

export const useLessonQuery = (courseId: string | undefined, lessonId: string | undefined) => {
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null);

  // Fetch lesson details and navigation information
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['lessonDetails', lessonId, courseId],
    queryFn: async () => {
      if (!lessonId || !courseId) {
        throw new Error("Missing lesson or course ID");
      }

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
    },
    enabled: !!lessonId && !!courseId
  });

  // Update next/prev lesson IDs when data changes
  useEffect(() => {
    if (lessonData) {
      setNextLessonId(lessonData.navigation.next?.id || null);
      setPrevLessonId(lessonData.navigation.prev?.id || null);
    }
  }, [lessonData]);

  // Transform the lesson content to a more structured format
  const lessonContent = lessonData?.lesson?.content 
    ? transformToContentBlocks(lessonData.lesson.content) 
    : [];

  return {
    lessonData,
    isLoading,
    lessonContent,
    nextLessonId,
    prevLessonId
  };
};
