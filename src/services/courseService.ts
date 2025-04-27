
import { supabase } from "@/integrations/supabase/client";

export interface CourseDetails {
  title: string;
  description: string | null;
  category: string;
  level: string;
  featuredImage: string | null;
}

export const createCourse = async (courseDetails: CourseDetails, instructorId: string) => {
  const { data, error } = await supabase
    .from('courses')
    .insert([{
      title: courseDetails.title,
      description: courseDetails.description,
      instructor_id: instructorId,
      is_published: false
    }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};
