
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getCourseById } from "@/services/courseService";
import { CourseDetails, Lesson, transformToLessonContent } from "@/types/course";

export const useCourseLoader = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const isExistingCourse = !!courseId && courseId !== 'new';
  
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    category: "",
    level: "",
    featuredImage: null,
    published: false
  });

  const [lessons, setLessons] = useState<Lesson[]>([
    { 
      id: "temp-1", 
      title: "Introduction", 
      content: [{ id: "block-1", type: "text", content: "Welcome to the course! This is a sample lesson content." }], 
      order_index: 0
    },
  ]);
  
  const [activeLesson, setActiveLesson] = useState("temp-1");
  
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([
    { id: "block-1", type: "text", content: "Welcome to the course! This is a sample lesson content." }
  ]);

  // Load existing course data if editing
  useEffect(() => {
    if (isExistingCourse) {
      const loadCourseData = async () => {
        try {
          const courseData = await getCourseById(courseId);
          
          setCourseDetails({
            title: courseData.title,
            description: courseData.description || "",
            category: courseData.category || "",
            level: courseData.level || "",
            featuredImage: courseData.featured_image,
            published: courseData.is_published
          });
          
          if (courseData.lessons && courseData.lessons.length > 0) {
            // Format lessons data from the API
            const formattedLessons = courseData.lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              content: transformToLessonContent(lesson.content),
              order_index: lesson.order_index
            }));
            
            setLessons(formattedLessons);
            setActiveLesson(formattedLessons[0].id);
            setContentBlocks(transformToLessonContent(formattedLessons[0].content));
          }
        } catch (error) {
          console.error("Error loading course:", error);
          toast({
            title: "Error",
            description: "Failed to load course data",
            variant: "destructive"
          });
        }
      };
      
      loadCourseData();
    }
  }, [courseId, isExistingCourse]);

  // Update content blocks when active lesson changes
  useEffect(() => {
    const lesson = lessons.find(l => l.id === activeLesson);
    if (lesson) {
      setContentBlocks(lesson.content || []);
    }
  }, [activeLesson, lessons]);

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
