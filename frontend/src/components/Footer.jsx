import React from 'react';
import { Github, Linkedin, MessageSquare } from 'lucide-react';

const Footer = () => {
  const links = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const element = document.getElementById(href.replace('#', ''));
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative py-12 border-t border-slate-200/50 dark:border-white/5 bg-white dark:bg-darkBg transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left column: brand details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <span className="text-base font-extrabold tracking-tight text-slate-800 dark:text-white">
            Asif<span className="text-indigo-500 dark:text-cyan-400">.Dev</span>
          </span>
          <p className="text-xs text-slate-400">
            Building premium digital experiences.
          </p>
        </div>

        {/* Center column: navigation links */}
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-cyan-300 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right column: Social & Copyright */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-2">
          
          {/* Social Icons row */}
          <div className="flex space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-550 dark:hover:text-cyan-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/923344142777"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-500 transition-colors"
              aria-label="WhatsApp Contact"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>

          <p className="text-[10px] text-slate-450 dark:text-slate-500">
            © 2026 Muhammad Asif. All Rights Reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
