
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { GraduationCap, Book, Users, Laptop, ArrowRight, BarChart, FileText } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-gradient-to-b from-white to-accent">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
              The open-source learning platform for modern educators
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Create beautiful online courses in minutes, not months. Complete control, zero coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="px-8">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8">
                <Link to="/courses">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Everything educators need, nothing they don't
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Course Builder</h3>
                <p className="text-muted-foreground">
                  Create beautiful, interactive lessons with our drag-and-drop editor. No coding required.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Management</h3>
                <p className="text-muted-foreground">
                  Invite students, track progress, and provide personalized feedback all in one place.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <Laptop className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-muted-foreground">
                  Your courses look great on any device, from desktop computers to mobile phones.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Track student engagement and performance with detailed analytics and reports.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assessments</h3>
                <p className="text-muted-foreground">
                  Create quizzes and assignments to test understanding and provide immediate feedback.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card flex flex-col items-center text-center animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Content Library</h3>
                <p className="text-muted-foreground">
                  Upload and organize your teaching materials, videos, and documents in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to transform your teaching?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are creating engaging learning experiences.
            </p>
            <Button size="lg" variant="secondary" className="px-8" asChild>
              <Link to="/signup" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
