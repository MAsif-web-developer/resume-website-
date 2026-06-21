import React, { useState, useEffect } from 'react';
import { Settings, Save, Loader2, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const SEOPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImageUrl: '',
    author: 'Muhammad Asif',
    robots: 'index, follow'
  });

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setFormData({
            metaTitle: data.meta_title || '',
            metaDescription: data.meta_description || '',
            metaKeywords: data.meta_keywords || '',
            ogImageUrl: data.og_image_url || '',
            author: data.author || 'Muhammad Asif',
            robots: data.robots || 'index, follow'
          });
        }
      } catch (err) {
        toast.error('Failed to load SEO settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSEO();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: seoRow } = await supabase
        .from('seo_settings')
        .select('id')
        .limit(1)
        .single();

      if (!seoRow) {
        throw new Error('SEO Settings record not found.');
      }

      const { error } = await supabase
        .from('seo_settings')
        .update({
          meta_title: formData.metaTitle,
          meta_description: formData.metaDescription,
          meta_keywords: formData.metaKeywords,
          og_image_url: formData.ogImageUrl,
          author: formData.author,
          robots: formData.robots,
          updated_at: new Date().toISOString()
        })
        .eq('id', seoRow.id);

      if (error) throw error;
      toast.success('SEO Settings saved! Refresh the portfolio to check.');
    } catch (err) {
      toast.error('Failed to update SEO settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-color)] mb-4" />
        <p className="text-sm">Fetching SEO configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left select-none">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Search Engine Optimization (SEO)</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Optimize search engine indexing, customize browser tabs, set crawl keywords, and control crawl robots.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Search Header Metadata
          </h3>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Meta Title (Browser Tab Title)
            </label>
            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              required
              placeholder="e.g. Muhammad Asif | Full Stack Developer Portfolio"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Meta Description (Search Snippet Description)
            </label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Description showing up on search engine results cards..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all leading-relaxed font-normal"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Search Keywords (Comma-separated search tags)
            </label>
            <input
              type="text"
              name="metaKeywords"
              value={formData.metaKeywords}
              onChange={handleChange}
              required
              placeholder="e.g. Muhammad Asif, Full Stack Developer, React, Node.js"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all font-sans"
            />
          </div>
        </div>

        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Search Indexing Policies & Authorship
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              />
            </div>

            {/* Robots */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Robots Indexing Directive
              </label>
              <select
                name="robots"
                value={formData.robots}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all"
              >
                <option value="index, follow">Index, Follow (Recommended)</option>
                <option value="noindex, nofollow">Noindex, Nofollow (Hide Site)</option>
                <option value="noindex, follow">Noindex, Follow</option>
              </select>
            </div>

            {/* OpenGraph Image URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                OG Sharing Image Link
              </label>
              <input
                type="text"
                name="ogImageUrl"
                value={formData.ogImageUrl}
                onChange={handleChange}
                placeholder="/sharing-card.jpg"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-sm transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-[var(--accent-color)]/10"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving configurations...</span></>
            ) : (
              <><Save className="h-4 w-4" /><span>Save SEO Configurations</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SEOPanel;
