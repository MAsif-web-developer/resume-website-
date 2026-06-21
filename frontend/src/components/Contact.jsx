import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Primary: Submit directly to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{ name: formData.name, email: formData.email, message: formData.message }]);

      if (error) {
        throw new Error(error.message);
      }

      // Success!
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', message: '' });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (supabaseErr) {
      console.warn('Supabase submission failed, trying backend API:', supabaseErr.message);

      // Fallback: try Express backend
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus({ type: 'success', message: 'Message sent successfully!' });
          setFormData({ name: '', email: '', message: '' });
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          setStatus({ type: 'error', message: data.error || 'Failed to submit form.' });
        }
      } catch (backendErr) {
        console.error('Both Supabase and backend failed:', backendErr);
        setStatus({
          type: 'error',
          message: 'Could not send your message. Please try again later.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative py-24 bg-lightBg dark:bg-darkBg transition-colors duration-300 overflow-hidden"
    >
      {/* Ambient backgrounds */}
      <div className="glow-orb w-[250px] h-[250px] bg-blue-500 bottom-[5%] left-[10%]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact <span className="text-gradient">Me</span>
          </h2>
          <div className="h-1 w-16 bg-indigo-500 rounded-full mt-3 dark:bg-cyan-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Get in Touch
            </h3>
            
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              I am open to collaborations, freelance gigs, or full-time opportunities. Drop a message and let's build something epic!
            </p>

            <div className="space-y-4 pt-4">
              
              {/* Phone item */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl glass border border-slate-200/50 dark:border-white/5">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400">Phone / WhatsApp</h4>
                  <a 
                    href="tel:03344142777" 
                    className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    0334-4142777
                  </a>
                </div>
              </div>

              {/* Email item */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl glass border border-slate-200/50 dark:border-white/5">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400">Email Address</h4>
                  <a 
                    href="mailto:m.asif.developer@gmail.com" // Placeholder email, standard format
                    className="text-base font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    asif.developer@gmail.com
                  </a>
                </div>
              </div>

              {/* Location item */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl glass border border-slate-200/50 dark:border-white/5">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400">Location</h4>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Pakistan
                  </span>
                </div>
              </div>

            </div>

            {/* Social channels */}
            <div className="flex space-x-3 pt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass border border-slate-200/50 dark:border-white/5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:scale-105 active:scale-95 transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass border border-slate-200/50 dark:border-white/5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:scale-105 active:scale-95 transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/923344142777"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass border border-slate-200/50 dark:border-white/5 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 hover:scale-105 active:scale-95 transition-all"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleSubmit}
              className="glass p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-xl flex flex-col space-y-5 text-left"
            >
              
              {/* Form Input Name */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="contact-name" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Form Input Email */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="contact-email" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Form Input Message */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  required
                  rows="4"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Form Submission Status Alert banner */}
              {status.message && (
                <div 
                  className={`px-4 py-3 rounded-xl text-xs font-semibold border ${
                    status.type === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Form Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 disabled:opacity-50 disabled:pointer-events-none transform active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
