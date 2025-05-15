
// Re-export all service functions from their respective modules
export type { CourseDetails, Lesson, LessonContent } from "./course/types";
export { transformToLessonContent, convertLessonContentToJson } from "./course/types";

// Course creation and management
export { createCourse, updateCoursePublishStatus } from "./course/courseCreationService";

// Lesson management
export { 
  createLesson, 
  updateLesson, 
  getLessonsByCourseId 
} from "./course/lessonService";

// Course queries
export { 
  getCourseById, 
  getCoursesByInstructor 
} from "./course/courseQueryService";

// Enrollment services
export { 
  enrollStudentInCourse, 
  updateLessonProgress, 
  getStudentEnrollment 
} from "./course/enrollmentService";
