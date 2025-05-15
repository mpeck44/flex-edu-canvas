
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

interface Block {
  id: string;
  type: string;
  content: string;
}

interface ContentBlockProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export const ContentBlock = ({ block, onUpdate, onDelete }: ContentBlockProps) => {
  const [content, setContent] = useState(block.content);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(block.id, newContent);
  };
  
  const renderBlock = () => {
    switch (block.type) {
      case "text":
        return (
          <Textarea
            value={content}
            onChange={handleChange}
            placeholder="Enter text content"
            rows={5}
            className="mb-2"
          />
        );
        
      case "image":
        return (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={handleChange}
              placeholder="Enter image URL"
              rows={2}
              className="mb-2"
            />
            {content && (
              <div className="border border-border rounded-md p-2 overflow-hidden mt-2">
                <img
                  src={content}
                  alt="Preview"
                  className="max-h-48 rounded object-cover mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
          </div>
        );
        
      case "video":
        return (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={handleChange}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              rows={2}
              className="mb-2"
            />
            {content && (
              <div className="border border-border rounded-md p-2 bg-muted/40">
                <p className="text-xs text-muted-foreground">Video preview not available in editor</p>
              </div>
            )}
          </div>
        );
        
      case "link":
        return (
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={handleChange}
              placeholder="Enter URL with optional description (e.g., https://example.com - Example Site)"
              rows={2}
              className="mb-2"
            />
            {content && content.includes('http') && (
              <div className="border border-border rounded-md p-2 bg-muted/40">
                <a 
                  href={content.split(' - ')[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  {content.includes(' - ') ? content.split(' - ')[1] : content}
                </a>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <Textarea
            value={content}
            onChange={handleChange}
            placeholder="Enter content"
            rows={5}
            className="mb-2"
          />
        );
    }
  };

  return (
    <div className="relative border border-border rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium capitalize">{block.type} Block</div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete(block.id)}
          className="h-8 w-8 p-0"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete block</span>
        </Button>
      </div>
      {renderBlock()}
    </div>
  );
};
