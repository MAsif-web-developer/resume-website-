import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, User, FileText, Server, FolderGit2, 
  Mail, Settings, FolderClosed, LogOut, ArrowLeft, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

import AdminDashboard from '../../pages/AdminDashboard';
import ProfilePanel from './ProfilePanel';
import AboutPanel from './AboutPanel';
import SkillsPanel from './SkillsPanel';
import ProjectsPanel from './ProjectsPanel';
import ContactPanel from './ContactPanel';
import SEOPanel from './SEOPanel';
import FileManagerPanel from './FileManagerPanel';

const AdminLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { label: 'Hero Section', path: '/admin/profile', icon: <User className="h-4.5 w-4.5" /> },
    { label: 'About Biography', path: '/admin/about', icon: <FileText className="h-4.5 w-4.5" /> },
    { label: 'Skills Metrics', path: '/admin/skills', icon: <Server className="h-4.5 w-4.5" /> },
    { label: 'Projects Portfolio', path: '/admin/projects', icon: <FolderGit2 className="h-4.5 w-4.5" /> },
    { label: 'Inbox (Contact)', path: '/admin/contact', icon: <Mail className="h-4.5 w-4.5" /> },
    { label: 'SEO Settings', path: '/admin/seo', icon: <Settings className="h-4.5 w-4.5" /> },
    { label: 'File Manager', path: '/admin/files', icon: <FolderClosed className="h-4.5 w-4.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#08111e] text-[#f8fafc] flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="h-16 w-full glass border-b border-white/5 flex items-center justify-between px-6 z-30 fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-3.5">
          <ShieldAlert className="h-5 w-5 text-[var(--accent-color)] animate-pulse" />
          <span className="text-md font-black tracking-wider text-[var(--text-primary)]">
            ADMIN<span className="text-[var(--accent-color)]">_PORTAL</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/" 
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>View Portfolio</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 hover:text-white text-rose-455 transition-all text-xs font-bold cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Screen Core */}
      <div className="flex flex-1 pt-16 h-full min-h-screen">
        
        {/* Navigation Sidebar */}
        <aside className="w-64 bg-slate-950/40 border-r border-white/5 p-4 fixed top-16 bottom-0 left-0 hidden md:block overflow-y-auto z-20">
          <div className="mb-4 px-2 py-1">
            <p className="text-[10px] font-extrabold text-[var(--text-secondary)] uppercase tracking-widest">
              CMS Sections
            </p>
          </div>
          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all border border-transparent ${
                    isActive 
                      ? 'bg-[var(--accent-color)]/10 text-[var(--accent-color)] border-[var(--border-color)]' 
                      : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Viewport View */}
        <main className="flex-1 md:pl-64 p-6 sm:p-8 bg-[#0b1320] min-h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto py-2">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/profile" element={<ProfilePanel />} />
              <Route path="/about" element={<AboutPanel />} />
              <Route path="/skills" element={<SkillsPanel />} />
              <Route path="/projects" element={<ProjectsPanel />} />
              <Route path="/contact" element={<ContactPanel />} />
              <Route path="/seo" element={<SEOPanel />} />
              <Route path="/files" element={<FileManagerPanel />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
