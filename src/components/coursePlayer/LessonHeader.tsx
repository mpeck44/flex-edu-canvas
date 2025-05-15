
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from 'lucide-react';

interface LessonHeaderProps {
  title: string;
  currentLesson: number;
  totalLessons: number;
  isCompleted: boolean;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  currentLesson,
  totalLessons,
  isCompleted
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <Progress 
          value={(currentLesson / totalLessons) * 100} 
          className="h-2 mt-2 w-full max-w-md" 
        />
      </div>
      {isCompleted && (
        <div className="flex items-center gap-1 text-green-500">
          <CheckCircle className="h-5 w-5" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
};

export default LessonHeader;
