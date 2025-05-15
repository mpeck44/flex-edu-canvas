
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, GripVertical } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  content: any;
  order_index: number;
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
  // Sort lessons by order_index for display
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  return (
    <Card className="lg:col-span-1">
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          {sortedLessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-2">
              <div className="cursor-move text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <Button 
                variant={activeLesson === lesson.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onLessonSelect(lesson.id)}
              >
                {lesson.title}
              </Button>
            </div>
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
