
import { LessonsSidebar } from "@/components/course/LessonsSidebar";
import { LessonEditor } from "@/components/course/LessonEditor";
import { useCourseContext } from "@/context/CourseContext";

export const CourseContentTab = () => {
  const { 
    lessons, 
    activeLesson, 
    setActiveLesson, 
    contentBlocks,
    handleAddLesson,
    handleAddContentBlock,
    updateBlockContent,
    deleteBlock,
    updateLessonTitle
  } = useCourseContext();

  return (
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
        onSave={() => {}}
      />
    </div>
  );
};
