
import { supabase } from "@/integrations/supabase/client";

export const enrollStudentInCourse = async (courseId: string, studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({ 
        course_id: courseId, 
        student_id: studentId,
        progress_json: {} 
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error enrolling student:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to enroll student:", error);
    throw error;
  }
};

export const updateLessonProgress = async (enrollmentId: string, lessonId: string, completed: boolean) => {
  try {
    // First get the current progress
    const { data: enrollment, error: getError } = await supabase
      .from('enrollments')
      .select('progress_json')
      .eq('id', enrollmentId)
      .single();
    
    if (getError) {
      console.error("Error fetching enrollment:", getError);
      throw getError;
    }
    
    // Update the progress JSON
    const progressJson = enrollment.progress_json || {};
    progressJson[lessonId] = { completed, completed_at: completed ? new Date().toISOString() : null };
    
    // Save the updated progress
    const { data, error } = await supabase
      .from('enrollments')
      .update({ progress_json: progressJson })
      .eq('id', enrollmentId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating lesson progress:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to update lesson progress:", error);
    throw error;
  }
};

export const getStudentEnrollment = async (courseId: string, studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', courseId)
      .eq('student_id', studentId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error("Error fetching student enrollment:", error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error("Failed to get student enrollment:", error);
    throw error;
  }
};
