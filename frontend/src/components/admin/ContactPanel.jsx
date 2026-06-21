import React, { useState, useEffect } from 'react';
import { Mail, Check, MessageSquare, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const ContactPanel = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      toast.error('Failed to load contact submissions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReadClick = async (inquiry) => {
    setSelectedInquiry(inquiry);
    
    if (!inquiry.is_read) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ is_read: true })
          .eq('id', inquiry.id);

        if (error) throw error;
        
        // Update local state
        setInquiries(prev => 
          prev.map(item => item.id === inquiry.id ? { ...item, is_read: true } : item)
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
  };

  const handleToggleReadStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
      fetchInquiries();
      
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(prev => ({ ...prev, is_read: !currentStatus }));
      }
    } catch (err) {
      toast.error('Error toggling status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Message deleted.');
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6 text-left select-none">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Inquiries Inbox</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Read client form submissions, view messages details, and manage lead records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Messages list */}
        <div className="lg:col-span-7 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center">
            <Mail className="h-4.5 w-4.5 text-[var(--accent-color)] mr-2" /> Message Queue
          </h3>

          {loading ? (
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)] py-10 justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-color)]" />
              <span>Checking inbox queue...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 text-xs text-[var(--text-secondary)]">
              No inquiries found. When visitors use your contact form, messages will appear here.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {inquiries.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => handleReadClick(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative hover:bg-white/5 ${
                    selectedInquiry && selectedInquiry.id === item.id 
                      ? 'border-[var(--accent-color)]/40 bg-[var(--accent-color)]/5' 
                      : item.is_read 
                        ? 'border-white/5 bg-white/2' 
                        : 'border-white/10 bg-white/5 shadow-md shadow-[var(--accent-glow)]'
                  }`}
                >
                  {/* Unread dot indicator */}
                  {!item.is_read && (
                    <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`text-xs font-bold ${!item.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[var(--text-secondary)] font-mono">{item.email}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 line-clamp-1 truncate font-normal leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Message Details Viewer */}
        <div className="lg:col-span-5 glass border border-white/5 rounded-3xl p-6 sm:p-8 space-y-5 h-full min-h-[300px] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center">
              <MessageSquare className="h-4.5 w-4.5 text-[var(--accent-color)] mr-2" /> Message Details
            </h3>

            {selectedInquiry ? (
              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Sender
                  </div>
                  <div className="text-sm font-bold text-white leading-none">{selectedInquiry.name}</div>
                  <div className="text-xs text-[var(--text-secondary)] font-mono">{selectedInquiry.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Date Received
                  </div>
                  <div className="text-xs text-slate-300">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Message Body
                  </div>
                  <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed whitespace-pre-line bg-white/2 p-3.5 rounded-xl border border-white/5">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]/50 text-xs">
                <Mail className="h-10 w-10 mb-2 opacity-30 text-[var(--accent-color)]" />
                <span>Select a message to read details</span>
              </div>
            )}
          </div>

          {selectedInquiry && (
            <div className="flex space-x-3 pt-4 border-t border-white/5">
              <button
                onClick={() => handleToggleReadStatus(selectedInquiry.id, selectedInquiry.is_read)}
                className="flex-1 py-2 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-semibold text-white flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                {selectedInquiry.is_read ? (
                  <><EyeOff className="h-4 w-4 text-[var(--accent-color)]" /><span>Mark Unread</span></>
                ) : (
                  <><Check className="h-4 w-4 text-emerald-400" /><span>Mark Read</span></>
                )}
              </button>
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-455 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPanel;
