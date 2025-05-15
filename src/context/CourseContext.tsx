
import React, { createContext, useState, useContext, ReactNode } from "react";
import { CourseDetails, Lesson as LessonType, LessonContent } from "@/services/courseService";

interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  position: number;
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
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    category: "",
    level: "",
    featuredImage: null,
  });

  const [lessons, setLessons] = useState<Lesson[]>([
    { 
      id: "1", 
      title: "Introduction", 
      content: [{ id: "block-1", type: "text", content: "Welcome to the course! This is a sample lesson content." }], 
      position: 1 
    },
  ]);
  
  const [activeLesson, setActiveLesson] = useState("1");
  
  const [contentBlocks, setContentBlocks] = useState<LessonContent[]>([
    { id: "block-1", type: "text", content: "Welcome to the course! This is a sample lesson content." }
  ]);

  const updateCourseDetails = (field: keyof CourseDetails, value: any) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLesson = () => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${lessons.length + 1}`,
      content: [{ id: `block-${Date.now()}`, type: "text", content: "" }],
      position: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
    setActiveLesson(newLesson.id);
    
    // Clear content blocks when switching to a new lesson
    setContentBlocks([{ 
      id: `block-${Date.now()}`, 
      type: "text", 
      content: "" 
    }]);
  };

  const handleAddContentBlock = (type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: ""
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    // Update the content blocks
    setContentBlocks(
      contentBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
    
    // Also update the lesson content
    const currentLesson = lessons.find(lesson => lesson.id === activeLesson);
    if (currentLesson) {
      const updatedLessons = lessons.map(lesson => 
        lesson.id === activeLesson 
          ? { ...lesson, content: contentBlocks.map(block => 
              block.id === id 
                ? { ...block, content } 
                : block
            )} 
          : lesson
      );
      setLessons(updatedLessons);
    }
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
          ? { ...lesson, content: lesson.content.filter(block => block.id !== id) } 
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
      updateLessonTitle
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
