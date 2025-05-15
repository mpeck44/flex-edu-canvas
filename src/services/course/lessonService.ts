
import { supabase } from "@/integrations/supabase/client";
import { Lesson, convertLessonContentToJson } from "./types";

export const createLesson = async (courseId: string, lesson: Partial<Lesson>) => {
  try {
    console.log("Creating lesson for course:", courseId, lesson);
    
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        title: lesson.title,
        content: lesson.content ? convertLessonContentToJson(lesson.content) : null,
        order_index: lesson.order_index
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to create lesson:", error);
    throw error;
  }
};

export const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
  try {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.order_index !== undefined) updateData.order_index = updates.order_index;
    if (updates.content) updateData.content = convertLessonContentToJson(updates.content);
    
    const { data, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', lessonId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update lesson:", error);
    throw error;
  }
};

export const getLessonsByCourseId = async (courseId: string) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
      
    if (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    throw error;
  }
};
