
import { supabase } from "@/integrations/supabase/client";

export interface CourseDetails {
  title: string;
  description: string | null;
  category: string;
  level: string;
  featuredImage: string | null;
}

export const createCourse = async (courseDetails: CourseDetails, instructorId: string) => {
  console.log("Creating course with details:", courseDetails);
  
  try {
    // Use RPC to call a stored function that bypasses RLS policies
    const { data, error } = await supabase.rpc(
      'create_course',
      {
        p_title: courseDetails.title,
        p_description: courseDetails.description,
        p_instructor_id: instructorId,
        p_category: courseDetails.category,
        p_level: courseDetails.level,
        p_is_published: false
      }
    );

    if (error) {
      console.error("Error in create_course RPC:", error);
      throw error;
    }
    
    console.log("Course created successfully with ID:", data);
    return data;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw error;
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    // Use the direct table access with RLS policies applied
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
      
    if (error) {
      console.error("Error fetching course by ID:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get course by ID:", error);
    throw error;
  }
};

export const getCoursesByInstructor = async (instructorId: string) => {
  try {
    console.log("Fetching courses for instructor:", instructorId);
    
    // Directly fetch instructor's courses using the RLS policy
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching instructor courses:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch instructor courses:", error);
    throw error;
  }
};
