
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface ContentBlockProps {
  block: {
    id: string;
    type: string;
    content: string;
  };
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ContentBlock = ({ block, onUpdate, onDelete }: ContentBlockProps) => {
  return (
    <div className="space-y-2 border rounded-lg p-4 relative">
      <div className="absolute -top-3 left-3 bg-background px-2 text-xs text-muted-foreground">
        {block.type === "text" ? "Text" : 
         block.type === "image" ? "Image" : 
         block.type === "video" ? "Video" : "Link"}
      </div>
      <Button 
        size="icon" 
        variant="ghost" 
        className="absolute top-2 right-2" 
        onClick={() => onDelete(block.id)}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
      </Button>
      
      {block.type === "text" && (
        <Textarea 
          placeholder="Enter text content here..."
          rows={4}
          className="mt-2"
          value={block.content}
          onChange={(e) => onUpdate(block.id, e.target.value)}
        />
      )}
      
      {(block.type === "image" || block.type === "video" || block.type === "link") && (
        <div className="space-y-2 mt-2">
          <Input 
            placeholder={
              block.type === "image" ? "Image URL or upload an image" :
              block.type === "video" ? "YouTube or Vimeo URL" :
              "https://example.com"
            }
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
