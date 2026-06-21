import React, { useEffect, useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';

const themes = [
  { id: 'cyber-teal', name: 'Cyber Teal', class: 'theme-cyber-teal' },
  { id: 'midnight-slate', name: 'Midnight Slate', class: 'theme-midnight-slate' },
  { id: 'warm-editorial', name: 'Warm Editorial', class: 'theme-warm-editorial' },
  { id: 'emerald-noir', name: 'Emerald Noir', class: 'theme-emerald-noir' },
  { id: 'royal-burgundy', name: 'Royal Burgundy', class: 'theme-royal-burgundy' },
  { id: 'arctic-glass', name: 'Arctic Glass', class: 'theme-arctic-glass' },
  { id: 'sunset-copper', name: 'Sunset Copper', class: 'theme-sunset-copper' },
  { id: 'mono-neon', name: 'Mono Neon', class: 'theme-mono-neon' },
];

const ThemeSelector = () => {
  const [activeTheme, setActiveTheme] = useState('cyber-teal');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'cyber-teal';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId) => {
    const htmlEl = document.documentElement;
    
    // Clean existing classes
    themes.forEach(t => htmlEl.classList.remove(t.class));
    htmlEl.classList.remove('theme-default');

    const selected = themes.find(t => t.id === themeId);
    if (selected) {
      htmlEl.classList.add(selected.class);
      setActiveTheme(themeId);
      localStorage.setItem('app-theme', themeId);
    } else {
      // Cyber Teal Default
      htmlEl.classList.add('theme-cyber-teal');
      setActiveTheme('cyber-teal');
      localStorage.setItem('app-theme', 'cyber-teal');
    }
  };

  const handleReset = () => {
    applyTheme('cyber-teal');
  };

  return (
    <div className="w-full glass border border-borderColor rounded-3xl p-5 mb-8 text-left relative overflow-hidden select-none">
      <div className="relative z-10 flex flex-col space-y-4">
        
        {/* Title row */}
        <div className="flex items-center space-x-2 text-sm font-bold text-accentColor">
          <Palette className="h-4 w-4" />
          <span>Try Theme (Temporary)</span>
        </div>

        {/* Buttons Grid */}
        <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                activeTheme === theme.id
                  ? 'bg-accentColor/10 border-accentColor text-accentColor shadow-sm shadow-accentColor/5'
                  : 'bg-white/5 border-borderColor text-textSecondary hover:border-textSecondary/30 hover:text-textPrimary'
              }`}
            >
              {theme.name}
            </button>
          ))}
          
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border bg-white/5 border-borderColor text-textSecondary hover:border-textSecondary/30 hover:text-textPrimary flex items-center space-x-1.5 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Default</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ThemeSelector;
