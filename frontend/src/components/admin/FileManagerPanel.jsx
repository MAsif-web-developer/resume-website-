import React, { useState, useEffect } from 'react';
import { FolderClosed, Plus, Trash2, Link as LinkIcon, Upload, Loader2, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const FileManagerPanel = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Form State (For manual URL register fallback)
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    url: '',
    fileType: 'application/pdf',
    size: 0
  });

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_files')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      toast.error('Failed to load portfolio files.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleCopyLink = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('portfolio_files')
        .update({ is_visible: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(!currentStatus ? 'File is now visible in sidebar' : 'File hidden from sidebar');
      fetchFiles();
    } catch (err) {
      toast.error('Failed to toggle file visibility.');
    }
  };

  // Direct Cloud Storage File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: e.g. 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    try {
      // 1. Upload file to Supabase storage bucket
      const { data, error: storageErr } = await supabase.storage
        .from('portfolio-resources')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (storageErr) {
        throw new Error(`Storage upload error: ${storageErr.message}. Make sure your 'portfolio-resources' bucket exists and has public RLS select policies.`);
      }

      // 2. Fetch public download URL of uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-resources')
        .getPublicUrl(fileName);

      // 3. Register record inside database
      const { error: dbErr } = await supabase
        .from('portfolio_files')
        .insert([{
          name: file.name,
          url: publicUrl,
          file_type: file.type,
          size: file.size,
          is_visible: true,
          display_order: files.length + 1
        }]);

      if (dbErr) throw dbErr;

      toast.success(`${file.name} uploaded and linked to Sidebar downloads!`);
      fetchFiles();
    } catch (err) {
      toast.error(err.message || 'File upload failed. Try manual registration.');
      console.error(err);
    } finally {
      setUploading(false);
      // Reset input element
      e.target.value = '';
    }
  };

  // Manual URL Registration Submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.url.trim()) {
      toast.error('Name and URL link are required.');
      return;
    }
    setUploading(true);

    try {
      const { error } = await supabase
        .from('portfolio_files')
        .insert([{
          name: manualForm.name,
          url: manualForm.url,
          file_type: manualForm.fileType,
          size: parseInt(manualForm.size) || 0,
          is_visible: true,
          display_order: files.length + 1
        }]);

      if (error) throw error;
      toast.success('Resource registered manually!');
      setManualForm({ name: '', url: '', fileType: 'application/pdf', size: 0 });
      setShowManualForm(false);
      fetchFiles();
    } catch (err) {
      toast.error('Failed to register link.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileItem) => {
    if (!window.confirm(`Are you sure you want to delete ${fileItem.name}?`)) return;
    
    try {
      // 1. Delete from database
      const { error: dbErr } = await supabase
        .from('portfolio_files')
        .delete()
        .eq('id', fileItem.id);

      if (dbErr) throw dbErr;

      // 2. Try deleting from storage if it belongs to our bucket
      if (fileItem.url.includes('portfolio-resources')) {
        const urlParts = fileItem.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('portfolio-resources')
          .remove([fileName]);
      }

      toast.success('Resource file deleted successfully.');
      fetchFiles();
    } catch (err) {
      toast.error('Failed to delete file.');
      console.error(err);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, bytes === 0 ? 1 : i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 text-left select-none">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">File Management System</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Upload PDF/image resource documents to Supabase Storage, sync links instantly in Sidebar resources, or register external links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Direct Upload + Manual Fallback */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center justify-between">
              <span>Upload Resources File</span>
              {uploading && <Loader2 className="h-4.5 w-4.5 animate-spin text-[var(--accent-color)]" />}
            </h3>

            {/* Direct Upload Form */}
            <div className="border-2 border-dashed border-white/10 hover:border-[var(--accent-color)]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer relative group transition-all">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer disabled:pointer-events-none"
              />
              <Upload className="h-8 w-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors mb-3" />
              <span className="text-xs font-bold text-white group-hover:text-[var(--accent-color)] transition-colors">
                Click to upload resource file
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] mt-1">
                PDF, PNG, JPG, or DOC (Max 10MB)
              </span>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs text-[var(--text-secondary)] hover:text-white underline font-semibold transition-colors cursor-pointer"
              >
                {showManualForm ? 'Hide external links registry' : 'Or register external URL links instead'}
              </button>
            </div>

            {/* Manual URL link registry fallback */}
            {showManualForm && (
              <form onSubmit={handleManualSubmit} className="space-y-4 pt-3 border-t border-white/5 animate-fade-in">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[var(--accent-color)]">
                  Register External Link URL
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Resource Name
                  </label>
                  <input
                    type="text"
                    value={manualForm.name}
                    onChange={(e) => setManualForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g. Master Certificates React"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-xs transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    File Link / URL
                  </label>
                  <input
                    type="url"
                    value={manualForm.url}
                    onChange={(e) => setManualForm(prev => ({ ...prev, url: e.target.value }))}
                    required
                    placeholder="https://drive.google.com/..."
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-xs transition-all font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      Resource Type
                    </label>
                    <input
                      type="text"
                      value={manualForm.fileType}
                      onChange={(e) => setManualForm(prev => ({ ...prev, fileType: e.target.value }))}
                      placeholder="e.g. application/pdf"
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-xs transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      File Size (Bytes)
                    </label>
                    <input
                      type="number"
                      value={manualForm.size}
                      onChange={(e) => setManualForm(prev => ({ ...prev, size: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] text-xs transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-600 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Register Resource Link</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Active resources lists */}
        <div className="lg:col-span-7 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center">
            <FolderClosed className="h-4.5 w-4.5 text-[var(--accent-color)] mr-2" /> Active Resources Downloads
          </h3>

          {loading ? (
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] py-10 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-color)]" />
              <span>Fetching dynamic files registry...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-10 text-xs text-[var(--text-secondary)]">
              No resource files uploaded yet. Sidebar is showing static mock fallbacks.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[var(--text-secondary)] font-bold uppercase tracking-wider">
                    <th className="py-2.5">File Name</th>
                    <th className="py-2.5 text-center">Size</th>
                    <th className="py-2.5 text-center">Sidebar</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {files.map(item => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold text-white max-w-[200px] truncate" title={item.name}>
                        {item.name}
                      </td>
                      <td className="py-3 text-center text-slate-400 font-mono">
                        {item.size ? formatBytes(item.size) : 'External'}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleToggleVisibility(item.id, item.is_visible)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            item.is_visible 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                          }`}
                          title={item.is_visible ? 'Visible in Sidebar' : 'Hidden from Sidebar'}
                        >
                          {item.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleCopyLink(item.id, item.url)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/15 text-[var(--accent-color)] hover:text-white transition-all cursor-pointer"
                          title="Copy Link URL"
                        >
                          {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-455 transition-all cursor-pointer"
                          title="Delete File"
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

export default FileManagerPanel;
