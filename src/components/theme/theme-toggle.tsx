"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // next-themes has applied the persisted/system class before this runs.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);
  const dark = isDark === true;
  const label = dark ? "Switch to light theme" : "Switch to dark theme";

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    setIsDark(nextIsDark);
    setTheme(nextIsDark ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
