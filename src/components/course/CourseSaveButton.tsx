
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createCourse } from "@/services/courseService";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "@/context/CourseContext";

export const CourseSaveButton = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseDetails } = useCourseContext();

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

      const course = await createCourse(courseDetails, user.id);
      console.log("Course saved successfully:", course);
      
      toast({
        title: "Course saved",
        description: "Your course has been saved successfully.",
      });
      
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
