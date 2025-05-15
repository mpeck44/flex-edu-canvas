
import { useState } from "react";
import { CourseDetails, Lesson, LessonContent } from "@/types/course";

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

  return {
    updateCourseDetails,
    handleAddLesson,
    handleAddContentBlock,
    updateBlockContent,
    deleteBlock,
    updateLessonTitle,
    reorderLessons
  };
};
