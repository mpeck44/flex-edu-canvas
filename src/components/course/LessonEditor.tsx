
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Image, Link as LinkIcon, Save, Youtube } from "lucide-react";
import { ContentBlock } from "./ContentBlock";

interface ContentBlock {
  id: string;
  type: string;
  content: string;
}

interface LessonEditorProps {
  lessonTitle: string;
  onTitleChange: (title: string) => void;
  contentBlocks: ContentBlock[];
  onAddBlock: (type: string) => void;
  onUpdateBlock: (id: string, content: string) => void;
  onDeleteBlock: (id: string) => void;
  onSave: () => void;
}

export const LessonEditor = ({
  lessonTitle,
  onTitleChange,
  contentBlocks,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onSave,
}: LessonEditorProps) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="space-y-2">
          <Label htmlFor="lesson-title">Lesson Title</Label>
          <Input 
            id="lesson-title" 
            placeholder="Enter lesson title"
            value={lessonTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Content Blocks */}
        {contentBlocks.map((block) => (
          <ContentBlock
            key={block.id}
            block={block}
            onUpdate={onUpdateBlock}
            onDelete={onDeleteBlock}
          />
        ))}

        {/* Add Content Block Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onAddBlock("text")}>
            <File className="h-4 w-4 mr-2" />
            Add Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock("image")}>
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock("video")}>
            <Youtube className="h-4 w-4 mr-2" />
            Add Video
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock("link")}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Lesson
        </Button>
      </CardFooter>
    </Card>
  );
};
