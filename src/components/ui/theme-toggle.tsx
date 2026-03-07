"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light"); // Default to light
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || "light"; // Default to light mode
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("light", initialTheme === "light");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 relative overflow-hidden group"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun 
        className={`h-4 w-4 absolute transition-all duration-300 ${
          theme === "dark" 
            ? "rotate-0 scale-100 opacity-100" 
            : "rotate-90 scale-0 opacity-0"
        }`} 
      />
      <Moon 
        className={`h-4 w-4 absolute transition-all duration-300 ${
          theme === "light" 
            ? "rotate-0 scale-100 opacity-100" 
            : "-rotate-90 scale-0 opacity-0"
        }`} 
      />
    </Button>
  );
}
