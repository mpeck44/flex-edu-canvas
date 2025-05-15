
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CourseDetails, Lesson as LessonType, LessonContent } from "@/services/courseService";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { getCourseById, getLessonsByCourseId } from "@/services/courseService";
import { Json } from "@/integrations/supabase/types";

interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  order_index: number;
}

interface CourseContextType {
  courseDetails: CourseDetails;
  updateCourseDetails: (field: keyof CourseDetails, value: any) => void;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  activeLesson: string;
  setActiveLesson: React.Dispatch<React.SetStateAction<string>>;
  contentBlocks: LessonContent[];
  setContentBlocks: React.Dispatch<React.SetStateAction<LessonContent[]>>;
  handleAddLesson: () => void;
  handleAddContentBlock: (type: string) => void;
  updateBlockContent: (id: string, content: string) => void;
  deleteBlock: (id: string) => void;
  updateLessonTitle: (title: string) => void;
  reorderLessons: (sourceIndex: number, destinationIndex: number) => void;
  isExistingCourse: boolean;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

// Helper function to safely transform Json to LessonContent array
const transformToLessonContent = (content: Json | null): LessonContent[] => {
  if (!content) return [];
  
  // If content is an array, map each item to ensure it has the required structure
  if (Array.isArray(content)) {
    return content.map(item => {
      // Ensure each item has id, type, and content properties
      if (typeof item === 'object' && item !== null && 'id' in item && 'type' in item && 'content' in item) {
        return {
          id: String(item.id),
          type: String(item.type),
          content: String(item.content)
        };
      }
      // Fallback for any item that doesn't match our structure
      return {
        id: `block-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: typeof item === 'string' ? item : JSON.stringify(item)
      };
    });
  }
  
  // If it's not an array, return an empty array
  return [];
};

// Helper function to convert LessonContent to Json
const convertLessonContentToJson = (content: LessonContent[]): Json => {
  // Convert the array to a plain object array that matches Json type
  const jsonContent = content.map(item => ({
    id: item.id,
    type: item.type,
    content: item.content
  }));
  
  // Cast the result to Json type since we know the structure is compatible
  return jsonContent as unknown as Json;
};

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
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

  const updateCourseDetails = (field: keyof CourseDetails, value: any) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLesson = () => {
    const maxOrder = Math.max(...lessons.map(l => l.order_index), -1);
    const newLesson = {
      id: `temp-${Date.now()}`,
      title: `Lesson ${lessons.length + 1}`,
      content: [{ id: `block-${Date.now()}`, type: "text", content: "" }],
      order_index: maxOrder + 1
    };
    setLessons([...lessons, newLesson]);
    setActiveLesson(newLesson.id);
    setContentBlocks(newLesson.content);
  };

  const handleAddContentBlock = (type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: ""
    };
    setContentBlocks([...contentBlocks, newBlock]);
    
    // Update lesson content immediately
    const updatedLessons = lessons.map(lesson => 
      lesson.id === activeLesson 
        ? { 
            ...lesson, 
            content: [...contentBlocks, newBlock]
          } 
        : lesson
    );
    setLessons(updatedLessons);
  };

  const updateBlockContent = (id: string, content: string) => {
    // Update the content blocks
    const updatedBlocks = contentBlocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setContentBlocks(updatedBlocks);
    
    // Also update the lesson content
    const updatedLessons = lessons.map(lesson => 
      lesson.id === activeLesson 
        ? { ...lesson, content: updatedBlocks } 
        : lesson
    );
    setLessons(updatedLessons);
  };

  const deleteBlock = (id: string) => {
    if (contentBlocks.length <= 1) {
      // Don't delete the last block, just clear it
      const emptyBlock = { 
        id: contentBlocks[0].id, 
        type: "text", 
        content: "" 
      };
      setContentBlocks([emptyBlock]);
      
      // Update the lesson content
      const updatedLessons = lessons.map(lesson => 
        lesson.id === activeLesson 
          ? { ...lesson, content: [emptyBlock] } 
          : lesson
      );
      setLessons(updatedLessons);
    } else {
      // Filter out the deleted block
      const updatedBlocks = contentBlocks.filter(block => block.id !== id);
      setContentBlocks(updatedBlocks);
      
      // Update the lesson content
      const updatedLessons = lessons.map(lesson => 
        lesson.id === activeLesson 
          ? { ...lesson, content: updatedBlocks } 
          : lesson
      );
      setLessons(updatedLessons);
    }
  };

  const updateLessonTitle = (title: string) => {
    setLessons(lessons.map(lesson =>
      lesson.id === activeLesson ? { ...lesson, title } : lesson
    ));
  };

  const reorderLessons = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;
    
    const reorderedLessons = [...lessons];
    const [movedLesson] = reorderedLessons.splice(sourceIndex, 1);
    reorderedLessons.splice(destinationIndex, 0, movedLesson);
    
    // Update order indices
    const updatedLessons = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      order_index: index
    }));
    
    setLessons(updatedLessons);
  };

  return (
    <CourseContext.Provider value={{
      courseDetails,
      updateCourseDetails,
      lessons,
      setLessons,
      activeLesson,
      setActiveLesson,
      contentBlocks,
      setContentBlocks,
      handleAddLesson,
      handleAddContentBlock,
      updateBlockContent,
      deleteBlock,
      updateLessonTitle,
      reorderLessons,
      isExistingCourse
    }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
