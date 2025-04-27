
import { supabase } from "@/integrations/supabase/client";

export interface CourseDetails {
  title: string;
  description: string | null;
  category: string;
  level: string;
  featuredImage: string | null;
}

export const createCourse = async (courseDetails: CourseDetails, instructorId: string) => {
  // Use RPC to call a stored function instead of direct table access
  // This bypasses RLS policies that might be causing recursion issues
  const { data, error } = await supabase
    .rpc('create_course', {
      p_title: courseDetails.title,
      p_description: courseDetails.description,
      p_instructor_id: instructorId,
      p_category: courseDetails.category,
      p_level: courseDetails.level,
      p_is_published: false
    });

  if (error) {
    console.error("Error in create_course RPC:", error);
    throw error;
  }
  
  return data;
};

export const getCourseById = async (courseId: string) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
    
  if (error) throw error;
  return data;
};
