
import React, { createContext, useState, useContext, ReactNode } from "react";
import { CourseDetails } from "@/services/courseService";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface ContentBlock {
  id: string;
  type: string;
  content: string;
  order: number;
}

interface CourseContextType {
  courseDetails: CourseDetails;
  updateCourseDetails: (field: keyof CourseDetails, value: any) => void;
  lessons: Lesson[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  activeLesson: string;
  setActiveLesson: React.Dispatch<React.SetStateAction<string>>;
  contentBlocks: ContentBlock[];
  setContentBlocks: React.Dispatch<React.SetStateAction<ContentBlock[]>>;
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
    { id: "1", title: "Introduction", content: "", order: 1 },
    { id: "2", title: "Lesson 1", content: "", order: 2 },
  ]);
  
  const [activeLesson, setActiveLesson] = useState("1");
  
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { id: "1", type: "text", content: "Welcome to the course! This is a sample lesson content.", order: 1 }
  ]);

  const updateCourseDetails = (field: keyof CourseDetails, value: any) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAddLesson = () => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${lessons.length + 1}`,
      content: "",
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
    setActiveLesson(newLesson.id);
  };

  const handleAddContentBlock = (type: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setContentBlocks(
      contentBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
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
