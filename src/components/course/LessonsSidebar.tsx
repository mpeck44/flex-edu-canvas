
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface LessonsSidebarProps {
  lessons: Lesson[];
  activeLesson: string;
  onLessonSelect: (id: string) => void;
  onAddLesson: () => void;
}

export const LessonsSidebar = ({ 
  lessons, 
  activeLesson, 
  onLessonSelect, 
  onAddLesson 
}: LessonsSidebarProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          {lessons.map((lesson) => (
            <Button 
              key={lesson.id} 
              variant={activeLesson === lesson.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onLessonSelect(lesson.id)}
            >
              {lesson.title}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={onAddLesson}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Lesson
        </Button>
      </CardFooter>
    </Card>
  );
};
