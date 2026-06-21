import React, { useState } from 'react';
import CanvasBackground from '../components/CanvasBackground';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

function PortfolioPage() {
  // Lift collapse state to manage responsive layouts
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const newVal = !prev;
      localStorage.setItem('sidebar-collapsed', String(newVal));
      return newVal;
    });
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] transition-colors duration-300 overflow-x-hidden">
      {/* Dynamic SEO Meta Tags updater */}
      <SEO />

      {/* Background Interactive 3D particle mesh */}
      <CanvasBackground />

      {/* Sidebar navigation controls with collapse toggle */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main layouts wrapper: transitions padding dynamically based on sidebar state */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
      } pt-16 lg:pt-0 w-full relative z-10 grid-bg-pattern min-h-screen flex flex-col justify-between`}>
        
        {/* Sections layout list */}
        <main className="w-full px-4 sm:px-8 lg:px-12">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>

        {/* Footer details */}
        <Footer />
      </div>
    </div>
  );
}

export default PortfolioPage;
