import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const ProfilePanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    tagline: '',
    email: '',
    phone: '',
    whatsappUrl: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    rolesText: '' // Newline-separated list of roles
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
            fullName: data.full_name || '',
            tagline: data.tagline || '',
            email: data.email || '',
            phone: data.phone || '',
            whatsappUrl: data.whatsapp_url || '',
            location: data.location || '',
            githubUrl: data.github_url || '',
            linkedinUrl: data.linkedin_url || '',
            rolesText: data.roles ? data.roles.join('\n') : ''
          });
        }
      } catch (err) {
        toast.error('Failed to load profile settings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const rolesArray = formData.rolesText
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    try {
      // Find the row ID first (singleton row)
      const { data: profileRow } = await supabase
        .from('profile')
        .select('id')
        .limit(1)
        .single();

      if (!profileRow) {
        throw new Error('Profile row not found.');
      }

      const { error } = await supabase
        .from('profile')
        .update({
          full_name: formData.fullName,
          tagline: formData.tagline,
          email: formData.email,
          phone: formData.phone,
          whatsapp_url: formData.whatsappUrl,
          location: formData.location,
          github_url: formData.githubUrl,
          linkedin_url: formData.linkedinUrl,
          roles: rolesArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileRow.id);

      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-color)] mb-4" />
        <p className="text-sm">Fetching profile details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Manage Hero & Profile</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Edit header names, WhatsApp values, geolocation markers, and active developer subtitles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Identity & Branding
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Muhammad Asif"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Branding Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                required
                placeholder="e.g. Consistency Makes a Man Perfect"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
              />
            </div>
          </div>

          {/* Typing Roles */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Typing Subtitle Roles (One per line)
            </label>
            <textarea
              name="rolesText"
              value={formData.rolesText}
              onChange={handleChange}
              rows={4}
              required
              placeholder="e.g.&#10;Full Stack Developer&#10;MERN Specialist&#10;Mobile App Expert"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all font-mono"
            />
          </div>
        </div>

        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Contact & Geolocation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Public Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0334-4142777"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
                />
              </div>
            </div>

            {/* Geolocation */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                Location Name
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Lahore, Pakistan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
            Social URLs & Integrations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* WhatsApp Link */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                WhatsApp API URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="whatsappUrl"
                  value={formData.whatsappUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://wa.me/92334..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all font-mono"
                />
              </div>
            </div>

            {/* GitHub URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                GitHub Profile URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://github.com/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all font-mono"
                />
              </div>
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                LinkedIn Profile URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  required
                  placeholder="https://linkedin.com/in/..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] text-sm transition-all font-mono"
                />
              </div>
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
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Saving Edits...</span></>
            ) : (
              <><Save className="h-4 w-4" /><span>Save Profile Changes</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePanel;
