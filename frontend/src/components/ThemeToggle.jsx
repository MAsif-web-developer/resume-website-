import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode for premium feel

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all duration-300 shadow-sm relative group overflow-hidden"
      aria-label="Toggle Theme"
      id="theme-toggle-btn"
    >
      <span className="relative z-10 block">
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="h-5 w-5 text-indigo-600 animate-float-medium" />
        )}
      </span>
      <span className="absolute inset-0 scale-0 group-hover:scale-100 bg-indigo-500/5 dark:bg-cyan-500/10 rounded-full transition-transform duration-300" />
    </button>
  );
};

export default ThemeToggle;
