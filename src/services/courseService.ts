
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface CourseDetails {
  title: string;
  description: string | null;
  category: string;
  level: string;
  featuredImage: string | null;
  published: boolean;
}

export interface LessonContent {
  id: string;
  type: string;
  content: string;
}

export interface Lesson {
  id?: string;
  title: string;
  content: LessonContent[];
  order_index: number;
  course_id?: string;
}

// Helper function to convert LessonContent to JSON
const convertLessonContentToJson = (content: LessonContent[]): Json => {
  return content as unknown as Json;
};

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

export const createLesson = async (courseId: string, lesson: Lesson) => {
  try {
    console.log("Creating lesson for course:", courseId, lesson);
    
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        title: lesson.title,
        content: convertLessonContentToJson(lesson.content),
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
