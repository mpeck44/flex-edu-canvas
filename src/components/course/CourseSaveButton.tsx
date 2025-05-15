
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createCourse, createLesson } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";

export const CourseSaveButton = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseDetails, lessons } = useCourseContext();

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
        level: courseDetails.level
      });

      // Step 1: Create the course
      const courseId = await createCourse(courseDetails, user.id);
      console.log("Course saved successfully with ID:", courseId);
      
      // Step 2: Create each lesson for the course
      const savedLessonsPromises = lessons.map(lesson => 
        createLesson(courseId, {
          title: lesson.title,
          content: lesson.content,
          position: lesson.position
        })
      );
      
      await Promise.all(savedLessonsPromises);
      console.log("All lessons saved successfully");
      
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
