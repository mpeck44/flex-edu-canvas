
import { Json } from "@/integrations/supabase/types";

export interface CourseDetails {
  title: string;
  description: string | null;
  category: string;
  level: string;
  featuredImage: string | null;
  published: boolean;
}

export interface LessonContent {
  id: string;
  type: string;
  content: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: LessonContent[];
  order_index: number;
  course_id?: string;
}

// Helper function to safely transform Json to LessonContent array
export const transformToLessonContent = (content: Json | null): LessonContent[] => {
  if (!content) return [];
  
  // If content is an array, map each item to ensure it has the required structure
  if (Array.isArray(content)) {
    return content.map(item => {
      // Ensure each item has id, type, and content properties
      if (typeof item === 'object' && item !== null && 'id' in item && 'type' in item && 'content' in item) {
        return {
          id: String(item.id),
          type: String(item.type),
          content: String(item.content)
        };
      }
      // Fallback for any item that doesn't match our structure
      return {
        id: `block-${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
        type: 'text',
        content: typeof item === 'string' ? item : JSON.stringify(item)
      };
    });
  }
  
  // If it's not an array, return an empty array
  return [];
};

// Helper function to convert LessonContent to Json
export const convertLessonContentToJson = (content: LessonContent[]): Json => {
  // Convert the array to a plain object array that matches Json type
  const jsonContent = content.map(item => ({
    id: item.id,
    type: item.type,
    content: item.content
  }));
  
  // Cast the result to Json type since we know the structure is compatible
  return jsonContent as Json;
};
