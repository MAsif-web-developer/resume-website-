import React, { useState, useEffect } from 'react';
import { FileText, Save, Loader2, Award, Briefcase, FolderGit2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const AboutPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bioNarrative1: '',
    bioNarrative2: '',
    yearsExp: 3,
    projectsCount: 2,
    deliveryRate: 100,
    resumeUrl: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            bioNarrative1: data.bio_narrative_1 || '',
            bioNarrative2: data.bio_narrative_2 || '',
            yearsExp: data.years_exp !== undefined ? data.years_exp : 3,
            projectsCount: data.projects_count !== undefined ? data.projects_count : 2,
            deliveryRate: data.delivery_rate !== undefined ? data.delivery_rate : 100,
            resumeUrl: data.resume_url || ''
          });
        }
      } catch (err) {
        toast.error('Failed to load biography metrics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'yearsExp' || name === 'projectsCount' || name === 'deliveryRate') 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: profileRow } = await supabase
        .from('profile')
        .select('id')
        .limit(1)
        .single();

      if (!profileRow) {
        throw new Error('Profile record not found.');
      }

      const { error } = await supabase
        .from('profile')
        .update({
          bio_narrative_1: formData.bioNarrative1,
          bio_narrative_2: formData.bioNarrative2,
          years_exp: formData.yearsExp,
          projects_count: formData.projectsCount,
          delivery_rate: formData.deliveryRate,
          resume_url: formData.resumeUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileRow.id);

      if (error) throw error;
      toast.success('Biography details saved!');
    } catch (err) {
      toast.error('Failed to save changes.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-color)] mb-4" />
        <p className="text-sm">Fetching biography details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Biography & Milestones</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Manage your personal biography narratives, career numeric milestones, and download resume links.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Biography Paragraphs
          </h3>

          {/* Bio 1 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Primary Paragraph
            </label>
            <textarea
              name="bioNarrative1"
              value={formData.bioNarrative1}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Primary introduction biography text..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all leading-relaxed"
            />
          </div>

          {/* Bio 2 */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Secondary Paragraph (Narrative details)
            </label>
            <textarea
              name="bioNarrative2"
              value={formData.bioNarrative2}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Secondary narrative details about programming code practices..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all leading-relaxed"
            />
          </div>
        </div>

        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Performance Metrics & Resume
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Years Experience */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
                <Briefcase className="h-3.5 w-3.5 mr-1.5 text-indigo-400" /> Years of Experience
              </label>
              <input
                type="number"
                name="yearsExp"
                value={formData.yearsExp}
                onChange={handleChange}
                min={0}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
              />
            </div>

            {/* Core Apps count */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
                <FolderGit2 className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Core Projects Count
              </label>
              <input
                type="number"
                name="projectsCount"
                value={formData.projectsCount}
                onChange={handleChange}
                min={0}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
              />
            </div>

            {/* Delivery Rate */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
                <Award className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Client Delivery Rate (%)
              </label>
              <input
                type="number"
                name="deliveryRate"
                value={formData.deliveryRate}
                onChange={handleChange}
                min={0}
                max={100}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
              />
            </div>
          </div>

          {/* Resume PDF Link */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              <LinkIcon className="h-3.5 w-3.5 mr-1.5 text-accentColor" /> Resume File URL (pdf / document path)
            </label>
            <input
              type="text"
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="e.g. /resume.pdf or https://..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all font-mono"
            />
            <p className="text-[10px] text-[var(--text-secondary)]/70">
              Tip: You can upload your resume file inside the **File Manager** panel and copy the generated link here!
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-[var(--accent-color)]/10"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving Edits...</span></>
            ) : (
              <><Save className="h-4 w-4" /><span>Save Biography Changes</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPanel;
