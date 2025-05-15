
import { useState } from "react";
import { CourseDetails, Lesson, LessonContent } from "@/types/course";
import { convertLessonContentToJson } from "@/services/course/types";

export const useCourseActions = (
  courseDetails: CourseDetails,
  setCourseDetails: React.Dispatch<React.SetStateAction<CourseDetails>>,
  lessons: Lesson[],
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,
  activeLesson: string,
  contentBlocks: LessonContent[],
  setContentBlocks: React.Dispatch<React.SetStateAction<LessonContent[]>>
) => {
  const updateCourseDetails = (field: keyof CourseDetails, value: any) => {
    setCourseDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: `new-lesson-${Date.now()}`,
      title: "New Lesson",
      content: [],
      order_index: lessons.length
    };
    setLessons(prev => [...prev, newLesson]);
    // No need to call setActiveLesson here - it's passed as a prop and used directly
  };

  const handleAddContentBlock = (type: string) => {
    const newBlock: LessonContent = {
      id: `block-${Date.now()}`,
      type,
      content: type === "text" ? "Enter text here..." : "",
    };
    setContentBlocks(prev => [...prev, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    setContentBlocks(prev =>
      prev.map(block => (block.id === id ? { ...block, content } : block))
    );
  };

  const deleteBlock = (id: string) => {
    setContentBlocks(prev => prev.filter(block => block.id !== id));
  };

  const updateLessonTitle = (title: string) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === activeLesson ? { ...lesson, title } : lesson
      )
    );
  };

  const reorderLessons = (sourceIndex: number, destinationIndex: number) => {
    const reordered = Array.from(lessons);
    const [removed] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, removed);
    
    // Update order_index values
    const updatedLessons = reordered.map((lesson, idx) => ({
      ...lesson,
      order_index: idx
    }));
    
    setLessons(updatedLessons);
  };

  return {
    updateCourseDetails,
    handleAddLesson,
    handleAddContentBlock,
    updateBlockContent,
    deleteBlock,
    updateLessonTitle,
    reorderLessons,
  };
};
