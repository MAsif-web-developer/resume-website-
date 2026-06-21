import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus, Edit2, Trash2, Save, X, Loader2, Globe, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const ProjectsPanel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStackText: '', // Comma-separated tech terms
    demoUrl: '',
    githubUrl: '',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    displayOrder: 0,
    isFeatured: true
  });

  const glowPresets = [
    { label: 'Indigo glow', value: 'rgba(99, 102, 241, 0.15)' },
    { label: 'Cyan glow', value: 'rgba(6, 182, 212, 0.15)' },
    { label: 'Violet glow', value: 'rgba(168, 85, 247, 0.15)' },
    { label: 'Emerald glow', value: 'rgba(16, 185, 129, 0.15)' }
  ];

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      toast.error('Failed to load projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' 
        ? checked 
        : name === 'displayOrder' 
          ? parseInt(value) || 0 
          : value 
    }));
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      techStackText: project.tech_stack ? project.tech_stack.join(', ') : '',
      demoUrl: project.demo_url || '',
      githubUrl: project.github_url || '',
      glowColor: project.glow_color || 'rgba(99, 102, 241, 0.15)',
      displayOrder: project.display_order || 0,
      isFeatured: project.is_featured !== undefined ? project.is_featured : true
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      techStackText: '',
      demoUrl: '',
      githubUrl: '',
      glowColor: 'rgba(99, 102, 241, 0.15)',
      displayOrder: 0,
      isFeatured: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in title and description.');
      return;
    }
    setSubmitting(true);

    const techArray = form.techStackText
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      if (editingId) {
        // Update mode
        const { error } = await supabase
          .from('projects')
          .update({
            title: form.title,
            description: form.description,
            tech_stack: techArray,
            demo_url: form.demoUrl,
            github_url: form.githubUrl,
            glow_color: form.glowColor,
            display_order: form.displayOrder,
            is_featured: form.isFeatured,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Project updated!');
      } else {
        // Insert mode
        const { error } = await supabase
          .from('projects')
          .insert([{
            title: form.title,
            description: form.description,
            tech_stack: techArray,
            demo_url: form.demoUrl,
            github_url: form.githubUrl,
            glow_color: form.glowColor,
            display_order: form.displayOrder,
            is_featured: form.isFeatured
          }]);

        if (error) throw error;
        toast.success('New project created!');
      }
      handleCancel();
      fetchProjects();
    } catch (err) {
      toast.error(err.message || 'Error saving project.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully.');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left select-none">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Manage Projects Portfolio</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Add, edit, or delete featured projects, tech tags, demo links, display weights, and glow colors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            {editingId ? 'Edit Project Details' : 'Create New Project'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Smart Hostel Portal"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Detailed project summary..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all leading-relaxed font-normal"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Tech Stack (Comma-separated)
              </label>
              <input
                type="text"
                name="techStackText"
                value={form.techStackText}
                onChange={handleChange}
                required
                placeholder="e.g. React.js, Tailwind CSS, Node.js"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Demo URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  name="demoUrl"
                  value={form.demoUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all font-mono"
                />
              </div>

              {/* GitHub URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Glow Preset */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Glow Style Color
                </label>
                <select
                  name="glowColor"
                  value={form.glowColor}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
                >
                  {glowPresets.map(preset => (
                    <option key={preset.value} value={preset.value}>{preset.label}</option>
                  ))}
                </select>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Sort Order Weight
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min={0}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
                />
              </div>
            </div>

            {/* Is Featured */}
            <div className="flex items-center space-x-2.5 py-1.5">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded bg-slate-900 border border-white/10 text-[var(--accent-color)] focus:ring-[var(--accent-color)] cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-350 cursor-pointer">
                Display on public portfolio (Featured project)
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Save className="h-4 w-4" /><span>Save Project</span></>
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right List Panel */}
        <div className="lg:col-span-7 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center">
            <FolderGit2 className="h-4 w-4 text-[var(--accent-color)] mr-2" /> Current Projects Registry
          </h3>

          {loading ? (
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] py-10 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-color)]" />
              <span>Fetching dynamic project records...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
              No project records stored in database. Using static mock project fallbacks.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Title</th>
                    <th className="py-2.5 text-center">Featured</th>
                    <th className="py-2.5 text-center">Sort Weight</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white max-w-[200px] truncate">{project.title}</td>
                      <td className="py-3 text-center">
                        {project.is_featured ? (
                          <span className="inline-flex items-center justify-center p-1 rounded-full text-emerald-400 bg-emerald-500/10">
                            <Eye className="h-4.5 w-4.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center p-1 rounded-full text-slate-500 bg-white/5">
                            <EyeOff className="h-4.5 w-4.5" />
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-center text-slate-400 font-bold">{project.display_order}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-[var(--accent-color)] hover:text-white transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-455 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPanel;
