
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const CourseEditorHeader = () => {
  return (
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
  );
};
