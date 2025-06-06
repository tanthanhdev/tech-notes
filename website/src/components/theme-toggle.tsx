"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="cursor-pointer h-8 w-8 sm:h-9 sm:w-9"
      aria-label="Toggle theme"
    >
      {theme === "dark" ?
        <Sun size={16} className="sm:h-[18px] sm:w-[18px]" /> :
        <Moon size={16} className="sm:h-[18px] sm:w-[18px]" />
      }
    </Button>
  );
}
