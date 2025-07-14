import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // Toggle between light and dark (ignore system for simplicity)
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 600);
  };

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={`
        relative overflow-hidden border-2 
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:shadow-lg hover:shadow-primary/25
        active:scale-95
        ${isDark 
          ? "border-primary/30 bg-card/50 hover:border-primary/50" 
          : "border-primary/20 bg-card/80 hover:border-primary/40"
        }
        ${isAnimating ? "animate-bounce-gentle" : ""}
      `}
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div 
        className={`
          absolute inset-0 transition-opacity duration-500
          ${isDark 
            ? "bg-gradient-to-br from-primary/10 to-accent/5 opacity-100" 
            : "bg-gradient-to-br from-primary/5 to-accent/10 opacity-70"
          }
        `} 
      />
      
      {/* Sun Icon */}
      <Sun 
        className={`
          absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out
          ${isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100"
          }
          ${isAnimating && !isDark ? "animate-spin" : ""}
        `} 
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`
          absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out
          ${isDark 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
          }
          ${isAnimating && isDark ? "animate-pulse" : ""}
        `} 
      />
      
      {/* Ripple effect on click */}
      {isAnimating && (
        <div 
          className={`
            absolute inset-0 rounded-md
            ${isDark 
              ? "animate-ping bg-primary/20" 
              : "animate-ping bg-primary/15"
            }
          `} 
        />
      )}
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}