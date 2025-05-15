
import { supabase } from "@/integrations/supabase/client";

export const getCourseById = async (courseId: string) => {
  try {
    // Get the course first
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
      
    if (courseError) {
      console.error("Error fetching course by ID:", courseError);
      throw courseError;
    }
    
    // Then get the lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');
    
    if (lessonsError) {
      console.error("Error fetching course lessons:", lessonsError);
      throw lessonsError;
    }
    
    return {
      ...course,
      lessons: lessons || []
    };
  } catch (error) {
    console.error("Failed to get course by ID:", error);
    throw error;
  }
};

export const getCoursesByInstructor = async (instructorId: string) => {
  try {
    console.log("Fetching courses for instructor:", instructorId);
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching instructor courses:", error);
      throw error;
    }
    
    // Get lessons count for each course
    const coursesWithLessonCount = await Promise.all(
      (data || []).map(async (course) => {
        const { count, error } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id);
        
        if (error) {
          console.error("Error counting lessons:", error);
          return { ...course, lessons_count: 0 };
        }
        
        return { ...course, lessons_count: count || 0 };
      })
    );
    
    return coursesWithLessonCount;
  } catch (error) {
    console.error("Failed to fetch instructor courses:", error);
    throw error;
  }
};
