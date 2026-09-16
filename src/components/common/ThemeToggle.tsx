"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9 sm:h-10 sm:w-10",
    lg: "h-11 w-11",
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5",
  }[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo día" : "Cambiar a modo noche"}
      title={isDark ? "Modo oscuro activo. Clic para modo claro" : "Modo claro activo. Clic para modo oscuro"}
      className={`${sizeClasses} rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-90 hover:scale-105 ${
        isDark
          ? "bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-800 shadow-sm"
          : "bg-white hover:bg-zinc-100 text-slate-700 border border-zinc-200 shadow-sm"
      } ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSizes} transition-transform duration-300 rotate-0 hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSizes} transition-transform duration-300 -rotate-12 hover:rotate-0`} />
      )}
    </button>
  );
}
