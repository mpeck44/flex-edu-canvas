
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Save } from "lucide-react";

interface CourseDetails {
  title: string;
  description: string;
  category: string;
  level: string;
  featuredImage: string | null;
}

interface CourseDetailsFormProps {
  courseDetails: CourseDetails;
  onSave: () => void;
  onChange: (field: keyof CourseDetails, value: string) => void;
}

export const CourseDetailsForm = ({ courseDetails, onSave, onChange }: CourseDetailsFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Set the basic details of your course
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input 
            id="title" 
            placeholder="e.g., Introduction to Biology"
            value={courseDetails.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe what students will learn"
            rows={4}
            value={courseDetails.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={courseDetails.category}
              onValueChange={(value) => onChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="art">Art</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Difficulty Level</Label>
            <Select 
              value={courseDetails.level}
              onValueChange={(value) => onChange('level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="all-levels">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/40">
            <Image className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop an image, or click to browse
            </p>
            <Button variant="outline" size="sm">
              Upload Image
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Course Details
        </Button>
      </CardFooter>
    </Card>
  );
};
