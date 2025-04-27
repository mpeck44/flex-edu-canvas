import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseDetailsForm } from "@/components/course/CourseDetailsForm";
import { LessonsSidebar } from "@/components/course/LessonsSidebar";
import { LessonEditor } from "@/components/course/LessonEditor";
import { useAuth } from "@/hooks/useAuth";
import { createCourse } from "@/services/courseService";
import type { CourseDetails } from "@/services/courseService";

const CourseEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  
  // Course details state
  const [courseDetails, setCourseDetails] = useState<CourseDetails>({
    title: "",
    description: "",
    category: "",
    level: "",
    featuredImage: null,
  });

  // Lessons state
  const [lessons, setLessons] = useState([
    { id: "1", title: "Introduction", content: "", order: 1 },
    { id: "2", title: "Lesson 1", content: "", order: 2 },
  ]);
  const [activeLesson, setActiveLesson] = useState("1");

  // Content blocks state
  const [contentBlocks, setContentBlocks] = useState([
    { id: "1", type: "text", content: "Welcome to the course! This is a sample lesson content.", order: 1 }
  ]);

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

      const course = await createCourse(courseDetails, user.id);
      console.log("Course saved successfully:", course);
      
      toast({
        title: "Course saved",
        description: "Your course has been saved successfully.",
      });
      
      navigate('/instructor/courses');
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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

  const handleAddContentBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlockContent = (id, content) => {
    setContentBlocks(
      contentBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const deleteBlock = (id) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  const updateCourseDetails = (field, value) => {
    setCourseDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateLessonTitle = (title) => {
    setLessons(lessons.map(lesson =>
      lesson.id === activeLesson ? { ...lesson, title } : lesson
    ));
  };

  return (
    <MainLayout showSidebar>
      <CoursesSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/instructor/courses">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Editor</h1>
            <p className="text-muted-foreground">Create and manage your course content</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Lessons & Content</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <CourseDetailsForm 
              courseDetails={courseDetails}
              onChange={updateCourseDetails}
              onSave={handleSaveCourse}
            />
          </TabsContent>

          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <LessonsSidebar
                lessons={lessons}
                activeLesson={activeLesson}
                onLessonSelect={setActiveLesson}
                onAddLesson={handleAddLesson}
              />
              
              <LessonEditor
                lessonTitle={lessons.find(l => l.id === activeLesson)?.title || ""}
                onTitleChange={updateLessonTitle}
                contentBlocks={contentBlocks}
                onAddBlock={handleAddContentBlock}
                onUpdateBlock={updateBlockContent}
                onDeleteBlock={deleteBlock}
                onSave={handleSaveCourse}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSaveCourse} 
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Course'}
          </Button>
        </div>
      </main>
    </MainLayout>
  );
};

export default CourseEditor;
