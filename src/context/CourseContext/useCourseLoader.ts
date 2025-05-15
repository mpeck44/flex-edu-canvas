
import { useState, useEffect } from "react";
import { CourseDetails, Lesson, LessonContent, transformToLessonContent, convertLessonContentToJson } from "@/types/course";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useCourseLoader = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isExistingCourse, setIsExistingCourse] = useState<boolean>(false);
  
  // Course details state
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    featuredImage: null,
    published: false
  });
  
  // Lessons state
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<string>("");
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([]);

  // Load course data if editing existing course
  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;

      try {
        // Load course details
        const { data: course, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        setCourseDetails({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "beginner",
          featuredImage: course.featured_image || null,
          published: course.is_published || false
        });

        // Load lessons
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_index");

        if (lessonError) throw lessonError;

        const formattedLessons: Lesson[] = lessonData.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          content: transformToLessonContent(lesson.content),
          order_index: lesson.order_index
        }));

        setLessons(formattedLessons);
        
        if (formattedLessons.length > 0) {
          setActiveLesson(formattedLessons[0].id);
          // Use the transformToLessonContent helper function for type safety
          setContentBlocks(transformToLessonContent(formattedLessons[0].content));
        }

        setIsExistingCourse(true);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load course data"
        });
      }
    };

    loadCourseData();
  }, [courseId]);

  // Update content blocks when active lesson changes
  useEffect(() => {
    if (activeLesson && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === activeLesson);
      if (lesson) {
        setContentBlocks(lesson.content || []);
      }
    }
  }, [activeLesson, lessons]);

  // Save content blocks back to lessons when they change
  useEffect(() => {
    if (activeLesson && contentBlocks) {
      setLessons(prev =>
        prev.map(lesson =>
          lesson.id === activeLesson
            ? { ...lesson, content: contentBlocks }
            : lesson
        )
      );
    }
  }, [contentBlocks, activeLesson]);

  return {
    courseDetails,
    setCourseDetails,
    lessons,
    setLessons,
    activeLesson,
    setActiveLesson,
    contentBlocks,
    setContentBlocks,
    isExistingCourse
  };
};
