
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';

interface LessonNavigationProps {
  prevLessonId: string | null;
  nextLessonId: string | null;
  isLessonCompleted: boolean;
  onMarkComplete: () => void;
  onNavigateToPrev: () => void;
  onNavigateToNext: () => void;
  onFinishCourse: () => void;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  prevLessonId,
  nextLessonId,
  isLessonCompleted,
  onMarkComplete,
  onNavigateToPrev,
  onNavigateToNext,
  onFinishCourse
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline" 
        onClick={onNavigateToPrev}
        disabled={!prevLessonId}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Previous
      </Button>
      
      <div>
        {!isLessonCompleted && (
          <Button 
            onClick={onMarkComplete}
            className="mr-4"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        )}
        
        {nextLessonId ? (
          <Button onClick={onNavigateToNext}>
            Next <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onFinishCourse}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Finish Course
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonNavigation;
