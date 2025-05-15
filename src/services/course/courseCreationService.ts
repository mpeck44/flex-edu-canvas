
import { supabase } from "@/integrations/supabase/client";
import { CourseDetails, Lesson, convertLessonContentToJson } from "./types";

export const createCourse = async (courseDetails: CourseDetails, instructorId: string) => {
  console.log("Creating course with details:", courseDetails);
  
  try {
    // Creating an empty course shell first
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: courseDetails.title,
        description: courseDetails.description,
        instructor_id: instructorId,
        category: courseDetails.category,
        level: courseDetails.level,
        is_published: courseDetails.published,
        status: courseDetails.published ? 'published' : 'draft'
      })
      .select('id')
      .single();

    if (error) {
      console.error("Error in create_course:", error);
      throw error;
    }
    
    console.log("Course created successfully with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw error;
  }
};

export const updateCoursePublishStatus = async (courseId: string, isPublished: boolean) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update({ 
        is_published: isPublished,
        status: isPublished ? 'published' : 'draft'
      })
      .eq('id', courseId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating course publish status:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update course publish status:", error);
    throw error;
  }
};
