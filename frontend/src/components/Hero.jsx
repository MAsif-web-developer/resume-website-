import React, { useState, useEffect } from 'react';
import { Github, Linkedin, MessageSquare, ArrowRight, User, Mail, Phone } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import { supabase } from '../lib/supabase';

const Hero = () => {
  const [profile, setProfile] = useState({
    fullName: 'Muhammad Asif',
    tagline: 'Consistency Makes a Man Perfect in Their Skill Set.',
    email: 'asif.developer@gmail.com',
    phone: '0334-4142777',
    whatsappUrl: 'https://wa.me/923344142777',
    roles: [
      "Full Stack Web & Mobile App Developer",
      "MERN Stack Specialist",
      "React Native & Flutter Expert"
    ]
  });
  
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

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
            tagline: data.tagline || 'Consistency Makes a Man Perfect in Their Skill Set.',
            email: data.email || 'asif.developer@gmail.com',
            phone: data.phone || '0334-4142777',
            whatsappUrl: data.whatsapp_url || 'https://wa.me/923344142777',
            roles: data.roles && data.roles.length > 0 ? data.roles : [
              "Full Stack Web & Mobile App Developer",
              "MERN Stack Specialist",
              "React Native & Flutter Expert"
            ]
          });
        }
      } catch (err) {
        console.warn('Hero Profile load failed: using static fallbacks.');
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const activeRole = profile.roles[currentRoleIndex];
    if (!activeRole) return;
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeRole.substring(0, currentText.length - 1));
        setTypingSpeed(40);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeRole.substring(0, currentText.length + 1));
        setTypingSpeed(100);
      }, typingSpeed);
    }

    if (!isDeleting && currentText === activeRole) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % profile.roles.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, profile.roles]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen pt-24 pb-16 overflow-hidden flex flex-col justify-start text-left"
    >
      {/* Ambient background blur */}
      <div className="glow-orb w-[280px] h-[280px] bg-accentColor/10 top-[20%] left-[10%]" />

      {/* Dynamic theme selector panel */}
      <ThemeSelector />

      {/* Main profile and intro wrapper */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-6">
        
        {/* Profile Picture circular visual frame */}
        <div className="lg:col-span-4 flex justify-center lg:justify-start">
          <div className="relative group">
            {/* Glowing ring animation */}
            <div className="absolute inset-0 rounded-full bg-accentColor/30 blur-xl scale-105 group-hover:scale-115 transition-all duration-500 animate-pulse-slow" />
            
            {/* Circular picture box */}
            <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-full overflow-hidden border-4 border-accentColor shadow-2xl z-10 flex items-center justify-center">
              <img 
                src="/profile.jpg" 
                alt={`${profile.fullName} Headshot`} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-full w-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-5xl">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="lg:col-span-8 space-y-5">
          {/* AssalamuAlikum rounded badge */}
          <div className="inline-block px-4 py-1.5 rounded-xl bg-accentColor/15 border border-accentColor/30 text-xs font-bold text-accentColor shadow-sm uppercase tracking-wide">
            AssalamuAlikum
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-textPrimary leading-none">
              {profile.fullName}
            </h1>
            
            {/* Tagline matching style */}
            <p className="text-base sm:text-xl font-semibold text-textSecondary leading-relaxed">
              {profile.tagline}
            </p>

            {/* Typing subtitle */}
            <h2 className="text-xs sm:text-sm font-extrabold text-accentColor flex items-center tracking-widest uppercase pt-1 min-h-[25px]">
              <span className="typing-cursor border-r-2 border-accentColor pr-1 leading-none">
                {currentText}
              </span>
            </h2>
          </div>

          {/* Socials connections row */}
          <div className="flex space-x-3.5 pt-2">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-5 py-3 rounded-xl text-xs font-bold text-white bg-accentColor hover:shadow-lg hover:shadow-accentColor/20 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
            >
              <span>View Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-3 rounded-xl text-xs font-bold glass border border-borderColor text-textPrimary hover:bg-white/5 transition-all duration-300 cursor-pointer"
            >
              Contact Me
            </button>
          </div>
        </div>

      </div>

      {/* Info contact cards at bottom matching screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full">
        
        {/* Card 1: Full Name */}
        <div className="glass border border-borderColor rounded-3xl p-5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-accentColor/10 border border-accentColor/20 flex items-center justify-center text-accentColor flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">
              Full Name:
            </h4>
            <p className="text-sm font-extrabold text-textPrimary mt-0.5">
              {profile.fullName}
            </p>
          </div>
        </div>

        {/* Card 2: Email Address */}
        <div className="glass border border-borderColor rounded-3xl p-5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-accentColor/10 border border-accentColor/20 flex items-center justify-center text-accentColor flex-shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div className="text-left overflow-hidden">
            <h4 className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">
              Email Address:
            </h4>
            <a 
              href={`mailto:${profile.email}`} 
              className="text-sm font-extrabold text-textPrimary hover:text-accentColor transition-colors mt-0.5 block truncate"
            >
              {profile.email}
            </a>
          </div>
        </div>

        {/* Card 3: WhatsApp Number */}
        <div className="glass border border-borderColor rounded-3xl p-5 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-accentColor/10 border border-accentColor/20 flex items-center justify-center text-accentColor flex-shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h4 className="text-[10px] uppercase font-bold text-textSecondary tracking-wider">
              WhatsApp / Call:
            </h4>
            <a 
              href={profile.whatsappUrl} 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-sm font-extrabold text-textPrimary hover:text-accentColor transition-colors mt-0.5 block"
            >
              {profile.phone}
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;
