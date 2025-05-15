
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { CourseDetailsForm } from "@/components/course/CourseDetailsForm";
import { CourseProvider } from "@/context/CourseContext/CourseProvider";
import { CourseEditorHeader } from "@/components/course/CourseEditorHeader";
import { CourseContentTab } from "@/components/course/CourseContentTab";
import { CourseSaveButton } from "@/components/course/CourseSaveButton";

const CourseEditor = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  
  return (
    <CourseProvider>
      <MainLayout showSidebar>
        <CoursesSidebar />
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          <CourseEditorHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="content">Lessons & Content</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <CourseDetailsForm />
            </TabsContent>

            <TabsContent value="content">
              <CourseContentTab />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <CourseSaveButton />
          </div>
        </main>
      </MainLayout>
    </CourseProvider>
  );
};

export default CourseEditor;
