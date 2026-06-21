import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { supabase } from '../lib/supabase';

const Skills = () => {
  const fallbackCategories = [
    {
      title: "Frontend Development",
      iconName: "Layout",
      glowColor: "rgba(59, 130, 246, 0.12)",
      skills: [
        { name: "HTML & CSS", level: 95 },
        { name: "JavaScript", level: 90 },
        { name: "React.js", level: 90 },
        { name: "Tailwind CSS", level: 95 }
      ]
    },
    {
      title: "Backend Development",
      iconName: "Server",
      glowColor: "rgba(168, 85, 247, 0.12)",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 90 },
        { name: "REST APIs", level: 90 },
        { name: "MongoDB & MySQL", level: 80 }
      ]
    },
    {
      title: "Mobile App Development",
      iconName: "Smartphone",
      glowColor: "rgba(16, 185, 129, 0.12)",
      skills: [
        { name: "React Native", level: 80 },
        { name: "Flutter", level: 75 }
      ]
    },
    {
      title: "Tools & Utilities",
      iconName: "Wrench",
      glowColor: "rgba(245, 158, 11, 0.12)",
      skills: [
        { name: "Git & GitHub", level: 90 },
        { name: "Postman", level: 85 },
        { name: "VS Code", level: 95 }
      ]
    }
  ];

  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          // Group flat SQL list into categorized array
          const groups = {};
          data.forEach(item => {
            const cat = item.category || 'Other';
            if (!groups[cat]) {
              groups[cat] = {
                title: cat,
                iconName: item.category_icon || 'Wrench',
                glowColor: item.glow_color || 'rgba(99, 102, 241, 0.12)',
                skills: []
              };
            }
            groups[cat].skills.push({
              name: item.name,
              level: item.proficiency
            });
          });
          setCategories(Object.values(groups));
        }
      } catch (err) {
        console.warn('Skills load failed: using static fallbacks.');
      }
    };
    fetchSkills();
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Wrench;
    const iconColorMap = {
      Layout: 'text-blue-500',
      Server: 'text-purple-500',
      Smartphone: 'text-emerald-500',
      Wrench: 'text-amber-500',
    };
    const colorClass = iconColorMap[iconName] || 'text-indigo-500';
    return <IconComponent className={`h-6 w-6 ${colorClass}`} />;
  };

  return (
    <section 
      id="skills" 
      className="relative py-24 bg-lightBg dark:bg-darkBg transition-colors duration-300 overflow-hidden"
    >
      {/* Ambient Orbs */}
      <div className="glow-orb w-[250px] h-[250px] bg-indigo-500 top-[10%] right-[5%]" />
      <div className="glow-orb w-[250px] h-[250px] bg-emerald-500 bottom-[10%] left-[5%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My <span className="text-gradient">Skills</span>
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mt-3 dark:bg-cyan-400" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <ThreeDCard
              key={index}
              glowColor={category.glowColor}
              className="rounded-3xl glass border border-slate-200/60 dark:border-white/5 shadow-lg p-6 sm:p-8 flex flex-col justify-between"
            >
              {/* Category Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {renderIcon(category.iconName)}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {category.title}
                </h3>
              </div>

              {/* Skills List */}
              <div className="space-y-5">
                {category.skills.map((skill, sIndex) => (
                  <div key={sIndex} className="space-y-2 text-left">
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center">
                        <LucideIcons.CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500 dark:text-cyan-400" />
                        {skill.name}
                      </span>
                      <span className="text-xs text-slate-400">{skill.level}%</span>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className="h-2 w-full bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-cyan-400 dark:to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ThreeDCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
