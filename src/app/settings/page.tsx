"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, ChevronRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import { fadeUp, btnTap } from '@/components/ui/motion';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function SettingsPage() {
  const { toast } = useToast();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState('Sudhanshu');
  const [email, setEmail] = useState('sudhanshu@launchforge.ai');
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const [toggles, setToggles] = useState({
    emailNotifs: true,
    projectUpdates: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    // Load preferences from local storage as a mock for user_preferences
    const saved = localStorage.getItem('user_prefs');
    if (saved) {
      try {
        setToggles(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleToggle = (key: keyof typeof toggles) => {
    const newValue = !toggles[key];
    const newToggles = { ...toggles, [key]: newValue };
    setToggles(newToggles);
    localStorage.setItem('user_prefs', JSON.stringify(newToggles));
    toast("Saved", "success");
  };

  const handleEdit = (field: string, val: string) => {
    setEditingField(field);
    setTempValue(val);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleSave = async (field: 'displayName' | 'email') => {
    setLoadingField(field);
    
    // Simulate Supabase call
    if (field === 'displayName') {
      // Mock save to users table
      await new Promise(r => setTimeout(r, 600));
      setDisplayName(tempValue);
      toast("Profile updated successfully", "success");
    } else if (field === 'email') {
      const { error } = await supabase.auth.updateUser({ email: tempValue });
      if (error) {
        toast(error.message, "error");
      } else {
        setEmail(tempValue);
        toast("Confirmation sent to new email", "success");
      }
    }
    
    setLoadingField(null);
    setEditingField(null);
  };

  return (
    <motion.div
      className="flex flex-col gap-10"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-[28px] font-bold text-[--text-primary] tracking-tight leading-none mb-2">
          Settings
        </h1>
        <p className="text-[14px] text-[--text-muted]">
          Manage your account, preferences, and workspace.
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div className="surface-card rounded-xl overflow-hidden" variants={fadeUp}>
        <div className="px-6 py-4 border-b border-[--border] flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[--accent-muted]">
            <User className="w-4 h-4 text-[--accent-primary]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[--text-primary] tracking-tight">Profile</h2>
            <p className="text-[12px] text-[--text-muted]">Manage your name, email, and avatar</p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Display Name */}
          <div className="flex items-center justify-between min-h-[44px]">
            {editingField === 'displayName' ? (
              <div className="flex-1 flex items-center gap-3 pr-4">
                <input
                  type="text"
                  value={tempValue}
                  onChange={e => setTempValue(e.target.value)}
                  className="flex-1 h-9 bg-[--bg-surface] border border-[--border] rounded-lg px-3 text-[13px] text-[--text-primary] focus:border-[--accent-primary] outline-none"
                  autoFocus
                />
                <button onClick={() => handleSave('displayName')} disabled={loadingField === 'displayName'} className="h-8 px-3 rounded-md bg-[--accent-primary] text-white text-[12px] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleCancel} disabled={loadingField === 'displayName'} className="h-8 px-3 rounded-md border border-[--border] text-[--text-muted] text-[12px] font-semibold">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[12px] font-semibold text-[--text-muted] uppercase tracking-[0.05em] mb-1.5">Display name</p>
                  <p className="text-[14px] text-[--text-primary]">{displayName}</p>
                </div>
                <motion.button
                  onClick={() => handleEdit('displayName', displayName)}
                  className="h-8 px-4 text-[12px] font-semibold text-[--text-muted] rounded-lg border border-[--border] hover:border-[rgba(255,255,255,0.10)] hover:text-[--text-primary] transition-all duration-200"
                  style={{ background: 'rgba(10,10,15,0.4)' }}
                  whileTap={btnTap}
                >
                  Edit
                </motion.button>
              </>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between min-h-[44px]">
            {editingField === 'email' ? (
              <div className="flex-1 flex items-center gap-3 pr-4">
                <input
                  type="email"
                  value={tempValue}
                  onChange={e => setTempValue(e.target.value)}
                  className="flex-1 h-9 bg-[--bg-surface] border border-[--border] rounded-lg px-3 text-[13px] text-[--text-primary] focus:border-[--accent-primary] outline-none"
                  autoFocus
                />
                <button onClick={() => handleSave('email')} disabled={loadingField === 'email'} className="h-8 px-3 rounded-md bg-[--accent-primary] text-white text-[12px] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleCancel} disabled={loadingField === 'email'} className="h-8 px-3 rounded-md border border-[--border] text-[--text-muted] text-[12px] font-semibold">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-[12px] font-semibold text-[--text-muted] uppercase tracking-[0.05em] mb-1.5">Email</p>
                  <p className="text-[14px] text-[--text-primary]">{email}</p>
                </div>
                <motion.button
                  onClick={() => handleEdit('email', email)}
                  className="h-8 px-4 text-[12px] font-semibold text-[--text-muted] rounded-lg border border-[--border] hover:border-[rgba(255,255,255,0.10)] hover:text-[--text-primary] transition-all duration-200"
                  style={{ background: 'rgba(10,10,15,0.4)' }}
                  whileTap={btnTap}
                >
                  Edit
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div className="surface-card rounded-xl overflow-hidden" variants={fadeUp}>
        <div className="px-6 py-4 border-b border-[--border] flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[--accent-muted]">
            <Bell className="w-4 h-4 text-[--accent-primary]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[--text-primary] tracking-tight">Notifications</h2>
            <p className="text-[12px] text-[--text-muted]">Control how you receive updates</p>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => handleToggle('emailNotifs')}>
            <p className="text-[14px] text-[--text-muted]">Email notifications</p>
            <motion.button
              className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${
                toggles.emailNotifs ? 'bg-[--accent-primary]' : 'bg-[--bg-surface]'
              }`}
            >
              <motion.div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] shadow-sm"
                animate={{ left: toggles.emailNotifs ? 20 : 2 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => handleToggle('projectUpdates')}>
            <p className="text-[14px] text-[--text-muted]">Project updates</p>
            <motion.button
              className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${
                toggles.projectUpdates ? 'bg-[--accent-primary]' : 'bg-[--bg-surface]'
              }`}
            >
              <motion.div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] shadow-sm"
                animate={{ left: toggles.projectUpdates ? 20 : 2 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => handleToggle('weeklyDigest')}>
            <p className="text-[14px] text-[--text-muted]">Weekly digest</p>
            <motion.button
              className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 ${
                toggles.weeklyDigest ? 'bg-[--accent-primary]' : 'bg-[--bg-surface]'
              }`}
            >
              <motion.div
                className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px] shadow-sm"
                animate={{ left: toggles.weeklyDigest ? 20 : 2 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={fadeUp} className="flex flex-col gap-2">
        <h2 className="text-[13px] font-semibold text-[--text-muted] uppercase tracking-[0.06em] mb-2">More settings</h2>
        <motion.div whileHover={{ y: -1 }} whileTap={btnTap}>
          <Link
            href="/settings/billing"
            className="surface-card flex items-center gap-4 px-5 py-4 rounded-xl group"
          >
            <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.05] transition-colors">
              <Shield className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-primary] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[--text-primary] group-hover:text-white transition-colors">Billing & Plans</p>
              <p className="text-[12px] text-[--text-muted]">Manage subscription and payment methods</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-muted] transition-colors" />
          </Link>
        </motion.div>

        <motion.div whileHover={{ y: -1 }} whileTap={btnTap} onClick={() => toast("Appearance panel coming soon", "info")}>
          <div className="surface-card flex items-center gap-4 px-5 py-4 rounded-xl group cursor-pointer">
            <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.05] transition-colors">
              <Palette className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-primary] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[--text-primary] group-hover:text-white transition-colors">Appearance</p>
              <p className="text-[12px] text-[--text-muted]">Theme and display preferences</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-muted] transition-colors" />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -1 }} whileTap={btnTap} onClick={() => toast("Language panel coming soon", "info")}>
          <div className="surface-card flex items-center gap-4 px-5 py-4 rounded-xl group cursor-pointer">
            <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.05] transition-colors">
              <Globe className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-primary] transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[--text-primary] group-hover:text-white transition-colors">Language & Region</p>
              <p className="text-[12px] text-[--text-muted]">Timezone, locale, and date formats</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-muted] transition-colors" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
