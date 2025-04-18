
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Book, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isInstructor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error logging out",
        description: error.message
      });
    }
  };

  return (
    <header className="w-full h-16 bg-white border-b border-border sticky top-0 z-50">
      <div className="container h-full flex-between">
        <Link to="/" className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">FlexLMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/courses" className="text-foreground/70 hover:text-foreground transition">
            Courses
          </Link>
          <Link to="/about" className="text-foreground/70 hover:text-foreground transition">
            About
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </Button>
                <Button size="sm" asChild>
                  <Link to={isInstructor ? "/instructor" : "/student"}>
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?signup=true">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-border z-50 py-4">
          <div className="container flex flex-col space-y-4">
            <Link
              to="/courses"
              className="px-4 py-2 hover:bg-accent rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 hover:bg-accent rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <hr className="my-2" />
            {user ? (
              <>
                <Link
                  to={isInstructor ? "/instructor" : "/student"}
                  className="px-4 py-2 hover:bg-accent rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 hover:bg-accent rounded-md transition flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Link>
                <Link to="/auth?signup=true" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
