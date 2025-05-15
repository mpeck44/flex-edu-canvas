import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createCourse, createLesson, updateLesson, updateCoursePublishStatus } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";

export const CourseSaveButton = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    courseDetails, 
    lessons, 
    isExistingCourse 
  } = useCourseContext();

  const handleSaveCourse = async () => {
    if (!courseDetails.title) {
      toast({
        title: "Missing information",
        description: "Please provide a course title.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to save a course.",
          variant: "destructive",
        });
        return;
      }

      console.log("Attempting to save course with details:", {
        title: courseDetails.title,
        category: courseDetails.category,
        level: courseDetails.level,
        published: courseDetails.published
      });

      if (isExistingCourse) {
        // For existing courses, only update the lessons
        // We'll handle course updates separately
        // TODO: Implement update course details functionality
        
        // Save each lesson
        const savedLessonsPromises = lessons.map(lesson => {
          if (lesson.id.startsWith('temp-')) {
            // New lesson - create it
            const newLesson = {
              id: lesson.id,
              title: lesson.title,
              content: lesson.content,
              order_index: lesson.order_index
            };
            return createLesson(window.location.pathname.split('/').pop()!, newLesson);
          } else {
            // Existing lesson - update it
            return updateLesson(lesson.id, {
              title: lesson.title,
              content: lesson.content,
              order_index: lesson.order_index
            });
          }
        });
        
        await Promise.all(savedLessonsPromises);
        console.log("All lessons saved successfully");
        
      } else {
        // Step 1: Create the course
        const courseId = await createCourse(courseDetails, user.id);
        console.log("Course saved successfully with ID:", courseId);
        
        // Step 2: Create each lesson for the course
        const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);
        
        const savedLessonsPromises = sortedLessons.map((lesson) => {
          const newLesson = {
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            order_index: lesson.order_index
          };
          return createLesson(courseId, newLesson);
        });
        
        await Promise.all(savedLessonsPromises);
        console.log("All lessons saved successfully");
      }
      
      toast({
        title: "Course saved",
        description: "Your course has been saved successfully.",
      });
      
      // Navigate to the course list
      navigate('/instructor/courses');
    } catch (error) {
      console.error("Error saving course:", error);
      let errorMessage = "Failed to save course. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={handleSaveCourse} 
      disabled={isSaving}
      className="w-full md:w-auto"
    >
      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {isSaving ? 'Saving...' : 'Save Course'}
    </Button>
  );
};
