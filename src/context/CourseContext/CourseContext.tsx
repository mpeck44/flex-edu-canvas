
import React, { createContext, ReactNode, useContext } from "react";
import { CourseDetails, Lesson, LessonContent } from "@/types/course";

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

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
