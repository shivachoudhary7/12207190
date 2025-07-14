import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link2, BarChart3 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="relative text-center mb-8">
          {/* Theme Toggle - positioned in top right */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              URL Whisper
            </h1>
          </div>
          <p className="text-muted-foreground">
            Transform long URLs into short, shareable links with analytics
          </p>
        </div>

        {/* Navigation */}
        <Card className="mb-8 p-1 shadow-elegant">
          <div className="flex justify-center gap-1">
            <Button
              asChild
              variant={isActive("/") ? "default" : "ghost"}
              className={`flex-1 max-w-xs ${
                isActive("/") ? "bg-gradient-primary shadow-glow" : ""
              }`}
            >
              <Link to="/" className="flex items-center gap-2">
                <Link2 className="w-4 h-4" />
                URL Shortener
              </Link>
            </Button>
            <Button
              asChild
              variant={isActive("/statistics") ? "default" : "ghost"}
              className={`flex-1 max-w-xs ${
                isActive("/statistics") ? "bg-gradient-primary shadow-glow" : ""
              }`}
            >
              <Link to="/statistics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </Link>
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="text-center mt-12 text-muted-foreground text-sm">
          <p>Campus Hiring Evaluation - URL Shortener Demo</p>
        </footer>
      </div>
    </div>
  );
}