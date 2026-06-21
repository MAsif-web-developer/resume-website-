import React, { useState, useEffect } from 'react';
import { Download, Briefcase, Award, FolderGit2 } from 'lucide-react';
import ThreeDCard from './ThreeDCard';
import { supabase } from '../lib/supabase';

const About = () => {
  const [profile, setProfile] = useState({
    fullName: 'Muhammad Asif',
    yearsExp: 3,
    projectsCount: 2,
    deliveryRate: 100,
    bio1: 'Muhammad Asif is a Full Stack Developer specializing in both web and mobile application development, skilled in building end-to-end solutions — from responsive frontend interfaces to scalable backend systems and databases.',
    bio2: 'With a passion for clean code and performance, I design, code, and deploy solutions that solve real-world problems. Whether building responsive dashboards using React + Tailwind CSS, robust microservices in Node.js, or portable mobile clients using React Native and Flutter, my goal is always to deliver modern, stable, and user-centric systems.',
    resumeUrl: '/resume.pdf'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          setProfile({
            fullName: data.full_name || 'Muhammad Asif',
            yearsExp: data.years_exp !== undefined ? data.years_exp : 3,
            projectsCount: data.projects_count !== undefined ? data.projects_count : 2,
            deliveryRate: data.delivery_rate !== undefined ? data.delivery_rate : 100,
            bio1: data.bio_narrative_1 || 'Muhammad Asif is a Full Stack Developer specializing in both web and mobile application development, skilled in building end-to-end solutions — from responsive frontend interfaces to scalable backend systems and databases.',
            bio2: data.bio_narrative_2 || 'With a passion for clean code and performance, I design, code, and deploy solutions that solve real-world problems. Whether building responsive dashboards using React + Tailwind CSS, robust microservices in Node.js, or portable mobile clients using React Native and Flutter, my goal is always to deliver modern, stable, and user-centric systems.',
            resumeUrl: data.resume_url || '/resume.pdf'
          });
        }
      } catch (err) {
        console.warn('About Profile load failed: using static fallbacks.');
      }
    };
    fetchProfile();
  }, []);

  return (
    <section 
      id="about" 
      className="relative py-24 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mt-3 dark:bg-cyan-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3D Tech Card / Image Placeholder */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <ThreeDCard 
              className="w-full max-w-sm aspect-[4/5] rounded-3xl glass border border-slate-200/60 dark:border-white/5 shadow-2xl p-6 flex flex-col justify-between overflow-hidden group"
              glowColor="rgba(6, 182, 212, 0.2)"
            >
              {/* Card Header styling */}
              <div className="flex justify-between items-center w-full">
                <div className="flex space-x-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  developer.json
                </span>
              </div>

              {/* Central Code Graphics / Avatar simulation */}
              <div className="my-auto py-6 font-mono text-xs text-left text-slate-600 dark:text-slate-300 space-y-3">
                <p className="text-indigo-500 dark:text-cyan-400">
                  const <span className="text-slate-800 dark:text-white">developer</span> = &#123;
                </p>
                <div className="pl-4 space-y-1">
                  <p>name: <span className="text-amber-600 dark:text-amber-400">"{profile.fullName}"</span>,</p>
                  <p>role: <span className="text-amber-600 dark:text-amber-400">"Full Stack Developer"</span>,</p>
                  <p>languages: [</p>
                  <p className="pl-4 text-emerald-600 dark:text-emerald-400">
                    "JavaScript", "Dart", "HTML/CSS"
                  </p>
                  <p>],</p>
                  <p>databases: [<span className="text-rose-500">"MongoDB"</span>, <span className="text-blue-500">"MySQL"</span>],</p>
                  <p>lovesCoding: <span className="text-indigo-500 dark:text-cyan-400">true</span></p>
                </div>
                <p className="text-indigo-500 dark:text-cyan-400">&#125;;</p>
              </div>

              {/* Decorative base row */}
              <div className="w-full pt-4 border-t border-slate-200/50 dark:border-white/5 flex justify-around text-center text-slate-500 dark:text-slate-400">
                <div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center">
                    <FolderGit2 className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{profile.projectsCount}+</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold">Core Apps</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center">
                    <Briefcase className="h-4 w-4 mr-1 text-indigo-500" />
                    <span>{profile.yearsExp}+</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold">Years Exp</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center">
                    <Award className="h-4 w-4 mr-1 text-emerald-500" />
                    <span>{profile.deliveryRate}%</span>
                  </div>
                  <div className="text-[10px] uppercase font-semibold">Delivery</div>
                </div>
              </div>
            </ThreeDCard>
          </div>

          {/* Right Column: Narrative Biography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 order-1 lg:order-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Who is {profile.fullName}?
            </h3>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal text-base sm:text-lg">
              {profile.bio1}
            </p>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal text-sm sm:text-base">
              {profile.bio2}
            </p>

            {/* Quick Feature Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-800/20">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Web Development</h4>
                  <p className="text-xs text-slate-500">MERN Stack, RESTful APIs</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-slate-800/20">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Mobile Development</h4>
                  <p className="text-xs text-slate-500">React Native, Flutter cross-platform</p>
                </div>
              </div>
            </div>

            {/* Resume CV Download Button */}
            <div className="pt-4">
              <a
                href={profile.resumeUrl}
                download={`${profile.fullName.replace(/\s+/g, '_')}_Resume.pdf`}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Download className="h-4.5 w-4.5" />
                <span>Download Resume</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
