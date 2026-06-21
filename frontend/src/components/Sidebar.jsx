import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Github, Linkedin, MessageSquare, Home, User, UserPlus, 
  Server, FolderGit2, Mail, ChevronLeft, ChevronRight, 
  FileDown, FolderOpen, Loader2, LayoutDashboard, ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [filesList, setFilesList] = useState([]);
  const [profile, setProfile] = useState({
    fullName: 'Muhammad Asif',
    role: 'Full Stack Developer',
    location: 'Pakistan',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    whatsappUrl: 'https://wa.me/923344142777'
  });

  const navItems = [
    { label: 'Home', href: '#home', id: 'home', icon: <Home className="h-4 w-4" /> },
    { label: 'About', href: '#about', id: 'about', icon: <User className="h-4 w-4" /> },
    { label: 'Skills', href: '#skills', id: 'skills', icon: <Server className="h-4 w-4" /> },
    { label: 'Projects', href: '#projects', id: 'projects', icon: <FolderGit2 className="h-4 w-4" /> },
    { label: 'Contact', href: '#contact', id: 'contact', icon: <Mail className="h-4 w-4" /> },
  ];
  // Extend navigation with auth‑aware items
  const fullNavItems = [...navItems];
  if (!user) {
    fullNavItems.push(
      { label: 'Login', href: '/login', id: 'login', icon: <User className="h-4 w-4" /> },
      { label: 'Register', href: '/register', id: 'register', icon: <UserPlus className="h-4 w-4" /> }
    );
  } else {
    fullNavItems.push({ label: 'Control Panel', href: '/admin', id: 'admin', icon: <LayoutDashboard className="h-4 w-4" /> });
  }

  // Monitor dynamic scroll position for active navbar highlighters
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch dynamic resources files list & profile credentials
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_files')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true });
        
        if (!error && data && data.length > 0) {
          setFilesList(data);
        } else {
          setFilesList([{ id: 'resume', name: 'Resume CV', url: '/resume.pdf' }]);
        }
      } catch {
        setFilesList([{ id: 'resume', name: 'Resume CV', url: '/resume.pdf' }]);
      }
    };

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          setProfile({
            fullName: data.full_name,
            role: data.roles?.[0] || 'Full Stack Developer',
            location: data.location || 'Pakistan',
            githubUrl: data.github_url || 'https://github.com',
            linkedinUrl: data.linkedin_url || 'https://linkedin.com',
            whatsappUrl: data.whatsapp_url || 'https://wa.me/923344142777'
          });
        }
      } catch (err) {
        console.warn('Sidebar Profile fallback: using local defaults.');
      }
    };

    fetchResources();
    fetchProfile();
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
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
    setIsOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center text-center space-y-4 pt-4 lg:pt-2">
        {/* Profile Picture Frame with Glow Border */}
        <div className="relative group flex justify-center">
          <div className={`rounded-full overflow-hidden border-2 border-[var(--accent-color)] shadow-lg shadow-[var(--accent-glow)] transition-all duration-300 relative z-10 ${
            isCollapsed ? 'h-10 w-10' : 'h-28 w-28'
          }`}>
            <img 
              src="/profile.jpg" 
              alt={profile.fullName} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-full w-full bg-slate-800 flex items-center justify-center font-bold text-slate-350 text-xl">
              {profile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          {/* External blur spotlight */}
          {!isCollapsed && (
            <div className="absolute inset-0 rounded-full bg-[var(--accent-color)]/25 blur-md -z-10 scale-95 group-hover:scale-110 transition-transform duration-300 animate-pulse-slow" />
          )}
        </div>

        {/* Developer Branding Details */}
        {!isCollapsed && (
          <div className="space-y-1 transition-opacity duration-300">
            <h3 className="text-lg font-extrabold tracking-tight text-[var(--text-primary)] leading-snug">
              {profile.fullName}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest max-w-[210px] mx-auto">
              {profile.role}
            </p>
          </div>
        )}
      </div>

      {/* Center Navigations List */}
      <nav className={isCollapsed ? 'my-4' : 'my-8'}>
        <ul className="space-y-1.5 text-left">
          {fullNavItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`flex items-center rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 border border-transparent cursor-pointer group relative ${
                  isCollapsed ? 'justify-center py-3 px-0' : 'space-x-3.5 py-3 px-4'
                } ${
                  activeSection === item.id
                    ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] border-[var(--border-color)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                }`}
              >
                <span className={activeSection === item.id ? 'text-[var(--accent-color)]' : 'text-[var(--text-secondary)]'}>
                  {item.icon}
                </span>
                
                {/* Expanded Label */}
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:left-14 transition-all duration-200 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Resource Files Sync */}
      {filesList.length > 0 && (
        <div className={isCollapsed ? 'py-3 border-t border-[var(--border-color)]/50' : 'my-4 pt-4 border-t border-[var(--border-color)]/50'}>
          {isCollapsed ? (
            /* Collapsed Folder Popover */
            <div className="relative group flex justify-center py-2">
              <div className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all cursor-pointer">
                <FolderOpen className="h-4.5 w-4.5 text-[var(--accent-color)]" />
              </div>
              <div className="absolute left-16 bottom-0 w-52 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-3.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-250 z-50">
                <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2 pb-1 border-b border-[var(--border-color)]/60">
                  Resource files
                </span>
                <ul className="space-y-1">
                  {filesList.map(file => (
                    <li key={file.id}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 py-1.5 px-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)] transition-all"
                      >
                        <FileDown className="h-3.5 w-3.5 text-[var(--accent-color)] flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{file.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Expanded Resources List */
            <div className="text-left px-4">
              <span className="text-[9px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">
                Resource Downloads
              </span>
              <ul className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
                {filesList.map(file => (
                  <li key={file.id}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <FileDown className="h-3.5 w-3.5 text-[var(--accent-color)] flex-shrink-0 animate-pulse" />
                      <span className="truncate max-w-[180px]">{file.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Admin Control Panel Button */}
      <div className={`pt-3 pb-1 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          /* Collapsed: Icon-only with tooltip */
          <div className="relative group flex justify-center">
            <Link
              to={user ? '/admin' : '/login'}
              className="p-2.5 rounded-xl flex items-center justify-center bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Admin Control Panel"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Link>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-xl whitespace-nowrap z-50">
              Admin Panel
            </span>
          </div>
        ) : (
          /* Expanded: Full button with glow */
          <Link
            to={user ? '/admin' : '/login'}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[var(--accent-color)]/90 hover:bg-[var(--accent-color)] hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            style={{ boxShadow: '0 0 20px var(--accent-glow)' }}
          >
            <ShieldAlert className="h-4 w-4 animate-pulse" />
            <span>Admin Control Panel</span>
          </Link>
        )}
      </div>

      {/* Bottom Social Media Shortcuts */}
      <div className={`border-t border-[var(--border-color)] pt-5 pb-1 text-center ${isCollapsed ? 'space-y-2' : 'space-y-4'}`}>
        <div className={`flex justify-center ${isCollapsed ? 'flex-col items-center space-y-2' : 'space-x-2.5'}`}>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="GitHub Profile"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={profile.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl glass border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="WhatsApp Contact"
          >
            <MessageSquare className="h-4 w-4" />
          </a>
        </div>
        
        {!isCollapsed && (
          <p className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]/60 font-semibold transition-opacity duration-300">
            {profile.location}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Aside Sidebar (Expands/Collapses) */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-[var(--bg-color)] border-r border-[var(--border-color)] p-6 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20 px-3' : 'w-80'
      }`}>
        {/* Collapse Chevron Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute top-10 -right-3 h-6.5 w-6.5 rounded-full bg-[var(--accent-color)] text-white border border-[var(--border-color)] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
          style={{ boxShadow: '0 0 16px var(--accent-glow)' }}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile Fixed Top Banner */}
      <header className="lg:hidden fixed top-0 left-0 right-0 glass border-b border-[var(--border-color)] py-3.5 px-6 flex justify-between items-center z-40">
        <a href="#home" className="flex items-center space-x-2">
          <span className="text-base font-extrabold tracking-tight text-[var(--text-primary)]">
            Asif<span className="text-[var(--accent-color)]">.Dev</span>
          </span>
        </a>
        <div className="flex items-center space-x-2">
          <Link
            to={user ? '/admin' : '/login'}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--accent-color)]/15 border border-[var(--accent-color)]/30 text-[var(--accent-color)] hover:bg-[var(--accent-color)]/25 transition-all cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Admin</span>
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div 
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/45 backdrop-blur-sm" 
        />
        
        <div className={`absolute top-0 bottom-0 left-0 w-80 bg-[var(--bg-color)] border-r border-[var(--border-color)] p-6 flex flex-col justify-between transition-transform duration-300 ease-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-lg text-[var(--text-secondary)] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
