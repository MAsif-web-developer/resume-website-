import React, { useState, useEffect } from 'react';
import { Server, Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const SkillsPanel = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    category: 'Frontend Development',
    name: '',
    proficiency: 80,
    categoryIcon: 'Layout',
    glowColor: 'rgba(59, 130, 246, 0.12)',
    displayOrder: 0
  });

  const categoriesList = [
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'Tools & Utilities'
  ];

  const iconOptions = [
    { label: 'Layout (Frontend)', value: 'Layout' },
    { label: 'Server (Backend)', value: 'Server' },
    { label: 'Smartphone (Mobile)', value: 'Smartphone' },
    { label: 'Wrench (Tools)', value: 'Wrench' }
  ];

  const colorPresets = [
    { label: 'Blue (Frontend)', value: 'rgba(59, 130, 246, 0.12)' },
    { label: 'Purple (Backend)', value: 'rgba(168, 85, 247, 0.12)' },
    { label: 'Green (Mobile)', value: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Amber (Tools)', value: 'rgba(245, 158, 11, 0.12)' }
  ];

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      toast.error('Failed to load skills.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: (name === 'proficiency' || name === 'displayOrder') ? parseInt(value) || 0 : value 
    }));
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setForm({
      category: skill.category,
      name: skill.name,
      proficiency: skill.proficiency,
      categoryIcon: skill.category_icon || 'Wrench',
      glowColor: skill.glow_color || 'rgba(59, 130, 246, 0.12)',
      displayOrder: skill.display_order || 0
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({
      category: 'Frontend Development',
      name: '',
      proficiency: 80,
      categoryIcon: 'Layout',
      glowColor: 'rgba(59, 130, 246, 0.12)',
      displayOrder: 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Please enter a skill name.');
      return;
    }
    setSubmitting(true);

    try {
      if (editingId) {
        // Update mode
        const { error } = await supabase
          .from('skills')
          .update({
            category: form.category,
            name: form.name,
            proficiency: form.proficiency,
            category_icon: form.categoryIcon,
            glow_color: form.glowColor,
            display_order: form.displayOrder
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Skill updated successfully!');
      } else {
        // Insert mode
        const { error } = await supabase
          .from('skills')
          .insert([{
            category: form.category,
            name: form.name,
            proficiency: form.proficiency,
            category_icon: form.categoryIcon,
            glow_color: form.glowColor,
            display_order: form.displayOrder
          }]);

        if (error) throw error;
        toast.success('New skill added!');
      }
      handleCancel();
      fetchSkills();
    } catch (err) {
      toast.error(err.message || 'Error saving skill.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Skill deleted successfully.');
      fetchSkills();
    } catch (err) {
      toast.error('Failed to delete skill.');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left select-none">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Manage Skills Progress</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Add, edit, or delete skills categories, proficiencies, display orders, and cards glow styling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: CRUD Form */}
        <div className="lg:col-span-5 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            {editingId ? 'Edit Skill Level' : 'Add New Skill'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Skill Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Skill Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. React.js"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              />
            </div>

            {/* Proficiency slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                <span>Proficiency Level</span>
                <span className="text-[var(--accent-color)]">{form.proficiency}%</span>
              </div>
              <input
                type="range"
                name="proficiency"
                min="0"
                max="100"
                value={form.proficiency}
                onChange={handleChange}
                className="w-full accent-[var(--accent-color)] bg-slate-800 rounded-lg cursor-pointer py-1"
              />
            </div>

            {/* Icon selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Lucide Icon
              </label>
              <select
                name="categoryIcon"
                value={form.categoryIcon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              >
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Glow Color selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Card Accent Color
              </label>
              <select
                name="glowColor"
                value={form.glowColor}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              >
                {colorPresets.map(preset => (
                  <option key={preset.value} value={preset.value}>{preset.label}</option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Display Order Number
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
                  <><Save className="h-4 w-4" /><span>Save Skill</span></>
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

        {/* Right Side: Skill items list */}
        <div className="lg:col-span-7 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center">
            <Server className="h-4 w-4 text-[var(--accent-color)] mr-2" /> Current Skills Registry
          </h3>

          {loading ? (
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] py-10 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-color)]" />
              <span>Fetching dynamic skills list...</span>
            </div>
          ) : skills.length === 0 ? (
            <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
              No skills registered in database. The website is using static fallbacks.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-center">Level</th>
                    <th className="py-2.5 text-center">Order</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {skills.map(skill => (
                    <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white">{skill.name}</td>
                      <td className="py-3 text-[var(--text-secondary)]">{skill.category}</td>
                      <td className="py-3 text-center text-[var(--accent-color)] font-bold">{skill.proficiency}%</td>
                      <td className="py-3 text-center text-slate-400">{skill.display_order}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-[var(--accent-color)] hover:text-white transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
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

export default SkillsPanel;
