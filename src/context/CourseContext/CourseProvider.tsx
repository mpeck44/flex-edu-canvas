
import React, { ReactNode } from "react";
import { CourseContext } from "./CourseContext";
import { useCourseLoader } from "./useCourseLoader";
import { useCourseActions } from "./useCourseActions";

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const {
    courseDetails,
    setCourseDetails,
    lessons,
    setLessons,
    activeLesson,
    setActiveLesson,
    contentBlocks,
    setContentBlocks,
    isExistingCourse
  } = useCourseLoader();

  const {
    updateCourseDetails,
    handleAddLesson,
    handleAddContentBlock,
    updateBlockContent,
    deleteBlock,
    updateLessonTitle,
    reorderLessons
  } = useCourseActions(
    courseDetails,
    setCourseDetails,
    lessons,
    setLessons,
    activeLesson,
    contentBlocks,
    setContentBlocks
  );

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
