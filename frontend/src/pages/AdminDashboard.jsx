import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, FileText, Server, FolderGit2, Mail, Settings, 
  FolderClosed, Eye, ArrowRight, Loader2, BarChart2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    views: 0,
    unreadInquiries: 0,
    projects: 0,
    skills: 0,
    files: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch views count
        const { count: viewsCount, error: vErr } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true });

        // Fetch unread messages
        const { count: unreadCount, error: cErr } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false);

        // Fetch projects count
        const { count: projectsCount, error: pErr } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        // Fetch skills count
        const { count: skillsCount, error: sErr } = await supabase
          .from('skills')
          .select('*', { count: 'exact', head: true });

        // Fetch files count
        const { count: filesCount, error: fErr } = await supabase
          .from('portfolio_files')
          .select('*', { count: 'exact', head: true });

        setStats({
          views: viewsCount || 0,
          unreadInquiries: unreadCount || 0,
          projects: projectsCount || 0,
          skills: skillsCount || 0,
          files: filesCount || 0
        });
      } catch (err) {
        console.warn('Could not retrieve database statistics, using fallback mock stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const panelCards = [
    {
      title: 'Hero & Profile Details',
      desc: 'Edit public name, WhatsApp details, email address, social links, and typing roles carousel.',
      icon: <User className="h-6 w-6 text-blue-400" />,
      path: '/admin/profile',
      statKey: 'Hero section settings'
    },
    {
      title: 'Biography Narratives',
      desc: 'Modify biography details, years of experience metrics, client delivery counts, and resume links.',
      icon: <FileText className="h-6 w-6 text-purple-400" />,
      path: '/admin/about',
      statKey: 'Biography stats'
    },
    {
      title: 'Skills & Proficiencies',
      desc: 'Add, update, or remove skill levels, categories icons, display orders, and percentage values.',
      icon: <Server className="h-6 w-6 text-emerald-400" />,
      path: '/admin/skills',
      statKey: `${stats.skills} skills registered`
    },
    {
      title: 'Projects Portfolio',
      desc: 'Add, remove, or modify featured portfolio project cards, demo URLs, source code paths, and stack lists.',
      icon: <FolderGit2 className="h-6 w-6 text-cyan-400" />,
      path: '/admin/projects',
      statKey: `${stats.projects} active projects`
    },
    {
      title: 'Inquiries Inbox',
      desc: 'Check contact form messages, read developer queries, and keep track of incoming client leads.',
      icon: <Mail className="h-6 w-6 text-rose-400" />,
      path: '/admin/contact',
      statKey: `${stats.unreadInquiries} unread messages`,
      alert: stats.unreadInquiries > 0
    },
    {
      title: 'Search Engine (SEO)',
      desc: 'Configure meta header tag settings, search descriptions, crawl keywords, author names, and robots policies.',
      icon: <Settings className="h-6 w-6 text-amber-400" />,
      path: '/admin/seo',
      statKey: 'Search parameters optimized'
    },
    {
      title: 'File Manager & Resources',
      desc: 'Upload files to Supabase cloud storage and sync resources instantly to the public sidebar downloads.',
      icon: <FolderClosed className="h-6 w-6 text-indigo-400" />,
      path: '/admin/files',
      statKey: `${stats.files} resource files`
    }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Greetings Block */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Control Panel <span className="text-gradient">Overview</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          Manage all content sections, resource links, database records, and SEO configurations from one central portal.
        </p>
      </div>

      {/* Overview Statistics Row */}
      {loading ? (
        <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] py-4">
          <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-color)]" />
          <span>Synchronizing portal stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Views */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Total Views
              </span>
              <span className="text-2xl font-black text-white">{stats.views}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Eye className="h-5 w-5" />
            </div>
          </div>

          {/* Card 2: Inquiries */}
          <div className={`glass border rounded-2xl p-5 flex items-center justify-between shadow-lg transition-all duration-300 ${
            stats.unreadInquiries > 0 ? 'border-rose-500/25 bg-rose-500/5' : 'border-white/5'
          }`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Inquiries Inbox
              </span>
              <span className={`text-2xl font-black ${stats.unreadInquiries > 0 ? 'text-rose-400' : 'text-white'}`}>
                {stats.unreadInquiries}
              </span>
            </div>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
              stats.unreadInquiries > 0 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse' 
                : 'bg-rose-500/15 text-rose-400 border-rose-500/20'
            }`}>
              <Mail className="h-5 w-5" />
            </div>
          </div>

          {/* Card 3: Projects */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Portfolio Projects
              </span>
              <span className="text-2xl font-black text-white">{stats.projects}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <FolderGit2 className="h-5 w-5" />
            </div>
          </div>

          {/* Card 4: Uploads */}
          <div className="glass border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Resource Downloads
              </span>
              <span className="text-2xl font-black text-white">{stats.files}</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <FolderClosed className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}

      {/* Core Management Deck */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          <BarChart2 className="h-4 w-4 text-[var(--accent-color)]" />
          <span>Section Management Panels</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {panelCards.map(panel => (
            <div 
              key={panel.title} 
              className="glass border border-white/5 hover:border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 relative group"
            >
              {/* Alert Indicator for unread messages */}
              {panel.alert && (
                <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 w-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  {panel.icon}
                </div>
                
                <h3 className="text-md font-bold text-white group-hover:text-[var(--accent-color)] transition-colors text-left">
                  {panel.title}
                </h3>
                
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed text-left font-normal h-[50px] overflow-hidden">
                  {panel.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                <span>{panel.statKey}</span>
                <button
                  onClick={() => navigate(panel.path)}
                  className="flex items-center space-x-1 text-[var(--accent-color)] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
