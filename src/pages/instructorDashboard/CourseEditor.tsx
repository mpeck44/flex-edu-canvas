
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CoursesSidebar from "@/components/layout/CoursesSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Save, Image, File, Plus, Trash2, Link as LinkIcon, Youtube, Pencil, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const CourseEditor = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  
  // Course details state
  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    featuredImage: null,
  });

  // Lessons state
  const [lessons, setLessons] = useState([
    { id: "1", title: "Introduction", content: "", order: 1 },
    { id: "2", title: "Lesson 1", content: "", order: 2 },
  ]);
  const [activeLesson, setActiveLesson] = useState("1");

  // Content blocks for the lesson editor
  const [contentBlocks, setContentBlocks] = useState([
    { id: "1", type: "text", content: "Welcome to the course! This is a sample lesson content.", order: 1 }
  ]);

  const handleSaveCourse = () => {
    // Validation
    if (!courseDetails.title) {
      toast({
        title: "Missing information",
        description: "Please provide a course title.",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to Supabase in a real implementation
    toast({
      title: "Course saved",
      description: "Your course has been saved successfully.",
    });
  };

  const addLesson = () => {
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: `Lesson ${lessons.length + 1}`,
      content: "",
      order: lessons.length + 1
    };
    setLessons([...lessons, newLesson]);
    setActiveLesson(newLesson.id);
  };

  const addContentBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: "",
      order: contentBlocks.length + 1
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const updateBlockContent = (id, content) => {
    setContentBlocks(
      contentBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      )
    );
  };

  const deleteBlock = (id) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== id));
  };

  return (
    <MainLayout showSidebar>
      <CoursesSidebar />
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/instructor">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Editor</h1>
            <p className="text-muted-foreground">Create and manage your course content</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Lessons & Content</TabsTrigger>
          </TabsList>

          {/* Course Details Tab */}
          <TabsContent value="details" className="space-y-6">
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
                    onChange={(e) => setCourseDetails({...courseDetails, title: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what students will learn"
                    rows={4}
                    value={courseDetails.description}
                    onChange={(e) => setCourseDetails({...courseDetails, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={courseDetails.category}
                      onValueChange={(value) => setCourseDetails({...courseDetails, category: value})}
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
                      onValueChange={(value) => setCourseDetails({...courseDetails, level: value})}
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
                <Button onClick={handleSaveCourse}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Course Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Lessons & Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lessons List */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Lessons</CardTitle>
                  <CardDescription>
                    Organize your course content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <Button 
                        key={lesson.id} 
                        variant={activeLesson === lesson.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveLesson(lesson.id)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        {lesson.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={addLesson}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Lesson
                  </Button>
                </CardFooter>
              </Card>

              {/* Lesson Editor */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">Lesson Title</Label>
                    <Input 
                      id="lesson-title" 
                      placeholder="Enter lesson title"
                      value={lessons.find(l => l.id === activeLesson)?.title || ""}
                      onChange={(e) => {
                        const updatedLessons = lessons.map(lesson => 
                          lesson.id === activeLesson 
                            ? { ...lesson, title: e.target.value }
                            : lesson
                        );
                        setLessons(updatedLessons);
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Content Blocks */}
                  {contentBlocks.map((block) => (
                    <div key={block.id} className="space-y-2 border rounded-lg p-4 relative">
                      <div className="absolute -top-3 left-3 bg-background px-2 text-xs text-muted-foreground">
                        {block.type === "text" ? "Text" : 
                         block.type === "image" ? "Image" : 
                         block.type === "video" ? "Video" : "Link"}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-2 right-2" 
                        onClick={() => deleteBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      
                      {block.type === "text" && (
                        <Textarea 
                          placeholder="Enter text content here..."
                          rows={4}
                          className="mt-2"
                          value={block.content}
                          onChange={(e) => updateBlockContent(block.id, e.target.value)}
                        />
                      )}
                      
                      {block.type === "image" && (
                        <div className="space-y-2 mt-2">
                          <Input 
                            placeholder="Image URL or upload an image"
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          />
                          <Button variant="outline" size="sm">
                            <Image className="h-4 w-4 mr-2" /> 
                            Upload Image
                          </Button>
                        </div>
                      )}
                      
                      {block.type === "video" && (
                        <div className="space-y-2 mt-2">
                          <Input 
                            placeholder="YouTube or Vimeo URL"
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          />
                        </div>
                      )}
                      
                      {block.type === "link" && (
                        <div className="space-y-2 mt-2">
                          <Input 
                            placeholder="https://example.com"
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Content Block Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => addContentBlock("text")}>
                      <File className="h-4 w-4 mr-2" />
                      Add Text
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addContentBlock("image")}>
                      <Image className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addContentBlock("video")}>
                      <Youtube className="h-4 w-4 mr-2" />
                      Add Video
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addContentBlock("link")}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveCourse}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Lesson
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </MainLayout>
  );
};

export default CourseEditor;
