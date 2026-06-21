import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, ShieldCheck, ShoppingCart, Terminal, Code, Cpu } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { supabase } from '../lib/supabase';

const Projects = () => {
  // Pre-coded visual mockups matching the original design
  const hostelVisual = (
    <div className="w-full h-full bg-slate-950/80 rounded-2xl p-4 flex flex-col justify-between border border-white/5 font-mono text-[9px] text-left text-slate-300">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex space-x-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="h-2 w-2 rounded-full bg-green-500" />
        </div>
        <span className="text-[8px] text-indigo-400 font-semibold flex items-center">
          <ShieldCheck className="h-3 w-3 mr-1" /> ADMIN_PORTAL v1.0
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 my-2">
        <div className="bg-white/5 rounded p-1.5 border border-white/5">
          <div className="text-slate-500">Rooms</div>
          <div className="text-[11px] font-bold text-white">42 / 50</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
            <div className="bg-indigo-500 h-full w-[84%]" />
          </div>
        </div>
        <div className="bg-white/5 rounded p-1.5 border border-white/5">
          <div className="text-slate-500">Occupants</div>
          <div className="text-[11px] font-bold text-emerald-400">154</div>
          <div className="text-[7px] text-slate-400 mt-1">Active Students</div>
        </div>
        <div className="bg-white/5 rounded p-1.5 border border-white/5">
          <div className="text-slate-500">Defaulters</div>
          <div className="text-[11px] font-bold text-red-400">4</div>
          <div className="text-[7px] text-slate-400 mt-1">Pending Fees</div>
        </div>
      </div>

      <div className="space-y-1 text-slate-400">
        <div className="flex justify-between border-b border-white/5 pb-0.5 text-[7px] text-slate-500 uppercase font-bold">
          <span>Student</span>
          <span>Room</span>
          <span>Status</span>
        </div>
        <div className="flex justify-between">
          <span>Asif Khan</span>
          <span>B-204</span>
          <span className="text-emerald-400 font-semibold">PAID</span>
        </div>
        <div className="flex justify-between">
          <span>Ali Raza</span>
          <span>A-102</span>
          <span className="text-amber-400 font-semibold">PENDING</span>
        </div>
      </div>
    </div>
  );

  const groceryVisual = (
    <div className="w-full h-full bg-slate-950/80 rounded-2xl p-4 flex flex-col justify-between border border-white/5 font-mono text-[9px] text-left text-slate-300">
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div className="flex space-x-1">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="h-2 w-2 rounded-full bg-green-500" />
        </div>
        <span className="text-[8px] text-cyan-400 font-semibold flex items-center">
          <ShoppingCart className="h-3 w-3 mr-1" /> POINT_OF_SALE
        </span>
      </div>

      <div className="space-y-1.5 my-2">
        <div className="bg-white/5 rounded-lg p-2 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[7px] text-slate-500 font-semibold">CURRENT TRANSACTION</div>
            <div className="text-[10px] text-white font-bold">12 Items • Total: $142.50</div>
          </div>
          <div className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold text-[8px] border border-cyan-400/20">
            CHECKOUT
          </div>
        </div>
      </div>

      <div className="space-y-1 text-slate-400">
        <div className="flex justify-between border-b border-white/5 pb-0.5 text-[7px] text-slate-500 uppercase font-bold">
          <span>Item Description</span>
          <span>Stock Level</span>
          <span>Pricing</span>
        </div>
        <div className="flex justify-between">
          <span>Organic Milk (1L)</span>
          <span>180 Units</span>
          <span className="text-white font-semibold">$3.49</span>
        </div>
        <div className="flex justify-between">
          <span>Fresh Apples (1kg)</span>
          <span className="text-red-400 font-semibold">12kg (LOW)</span>
          <span className="text-white font-semibold">$2.99</span>
        </div>
      </div>
    </div>
  );

  // Dynamic generic mockup generator for newly uploaded/added CMS projects
  const createGenericVisual = (title, stack) => {
    return (
      <div className="w-full h-full bg-slate-950/90 rounded-2xl p-4 flex flex-col justify-between border border-white/5 font-mono text-[9px] text-left text-slate-350 select-none">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <div className="flex space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <span className="text-[8px] text-[var(--accent-color)] font-bold flex items-center">
            <Terminal className="h-3 w-3 mr-1" /> CONSOLE_LOG
          </span>
        </div>
        
        <div className="my-auto py-2 space-y-1 text-slate-400">
          <p className="text-[var(--accent-color)] font-semibold flex items-center">
            <Code className="h-3.5 w-3.5 mr-1" /> {title.toUpperCase()}
          </p>
          <div className="pl-3 space-y-0.5 text-[8px]">
            <p>status &nbsp;&nbsp;&nbsp;: <span className="text-emerald-400 font-bold">ONLINE</span></p>
            <p>framework: <span className="text-indigo-400">{stack[0] || 'React'}</span></p>
            <p>features &nbsp;: [REST_API, CRUD_DB]</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[7px] text-slate-500 font-bold uppercase">
          <span className="flex items-center"><Cpu className="h-3 w-3 mr-1 text-purple-400" /> system active</span>
          <span className="text-[var(--accent-color)]">v1.0.0</span>
        </div>
      </div>
    );
  };

  const getVisual = (project) => {
    const titleLower = project.title.toLowerCase();
    if (titleLower.includes('hostel')) {
      return hostelVisual;
    } else if (titleLower.includes('grocery') || titleLower.includes('store')) {
      return groceryVisual;
    } else {
      return createGenericVisual(project.title, project.techStack);
    }
  };

  const fallbackProjects = [
    {
      title: "Smart Hostel Management System",
      description: "A full stack web/mobile application designed to streamline hostel operations, featuring automated room allocation algorithms, digital student records, graphical fee tracking, and a robust administrator control panel.",
      techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
      demoLink: "https://example.com/hostel-demo",
      githubLink: "https://github.com",
      glowColor: "rgba(99, 102, 241, 0.15)"
    },
    {
      title: "Grocery Store Management Project",
      description: "An intuitive full stack enterprise system engineered to optimize retail activities. Integrates real-time inventory adjustments, barcode billing queues, automated stock level alerts, and comprehensive sales reports.",
      techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MySQL"],
      demoLink: "https://example.com/grocery-demo",
      githubLink: "https://github.com",
      glowColor: "rgba(6, 182, 212, 0.15)"
    }
  ];

  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(p => ({
            title: p.title,
            description: p.description,
            techStack: p.tech_stack || [],
            demoLink: p.demo_url || '#',
            githubLink: p.github_url || '#',
            glowColor: p.glow_color || 'rgba(99, 102, 241, 0.15)'
          }));
          setProjects(mapped);
        }
      } catch (err) {
        console.warn('Projects load failed: using static fallbacks.');
      }
    };
    fetchProjects();
  }, []);

  return (
    <section 
      id="projects" 
      className="relative py-24 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-300 overflow-hidden"
    >
      {/* Ambient Glow Orbs */}
      <div className="glow-orb w-[300px] h-[300px] bg-purple-500 top-[30%] left-[-10%]" />
      <div className="glow-orb w-[300px] h-[300px] bg-blue-500 bottom-[20%] right-[-10%]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recent <span className="text-gradient">Projects</span>
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mt-3 dark:bg-cyan-400" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <ThreeDCard
              key={index}
              glowColor={project.glowColor}
              className="rounded-3xl glass border border-slate-200/60 dark:border-white/5 shadow-xl flex flex-col overflow-hidden text-left"
            >
              {/* Top Custom Dashboard Simulation Visual */}
              <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-white/5 aspect-[16/9] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-cyan-500/5 dark:from-indigo-500/10 dark:to-cyan-500/10 opacity-100 group-hover:scale-105 transition-transform duration-700" />
                <div className="w-full max-w-sm relative z-10 transition-transform duration-500 group-hover:scale-[1.03]">
                  {getVisual(project)}
                </div>
              </div>

              {/* Bottom Information Details */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-5">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-450 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech) => (
                    <span 
                      key={tech}
                      className="text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-355 border border-slate-200/30 dark:border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Live Actions & Github link */}
                <div className="flex items-center space-x-4 pt-4 border-t border-slate-150 dark:border-white/5">
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-sm font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <ExternalLink className="h-4.5 w-4.5" />
                    <span>Live Demo</span>
                  </a>
                  
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <Github className="h-4.5 w-4.5" />
                    <span>GitHub Code</span>
                  </a>
                </div>
              </div>
            </ThreeDCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Projects;
