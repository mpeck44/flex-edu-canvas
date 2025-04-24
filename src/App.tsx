
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseView from "./pages/CourseView";
import Auth from "./pages/Auth";
import InstructorDashboard from "./pages/instructorDashboard/InstructorDashboard";
import InstructorCourses from "./pages/instructorDashboard/InstructorCourses";
import CourseEditor from "./pages/instructorDashboard/CourseEditor";
import StudentDashboard from "./pages/studentDashboard/StudentDashboard";
import StudentCourseView from "./pages/studentDashboard/StudentCourseView";
import CoursePlayer from "./pages/studentDashboard/CoursePlayer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseView />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Instructor Routes */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorCourses />} />
          <Route path="/instructor/courses/new" element={<CourseEditor />} />
          <Route path="/instructor/courses/:courseId" element={<CourseEditor />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/courses/:courseId" element={<StudentCourseView />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<CoursePlayer />} />
          
          {/* Catch-all Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
