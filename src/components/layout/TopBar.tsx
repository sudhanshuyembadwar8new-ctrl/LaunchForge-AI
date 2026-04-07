'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Command, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface TopBarProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export function TopBar({ breadcrumbs = [{ label: 'Dashboard' }] }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      className="h-[52px] shrink-0 sticky top-0 z-20 flex items-center justify-between px-5 border-b border-[--border]"
      style={{
        background: 'rgba(5,5,8,0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[13px]">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <motion.span
              key={crumb.label}
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT, delay: i * 0.06 }}
            >
              {i > 0 && <ChevronRight className="w-3 h-3 text-[--text-muted]" />}
              {crumb.href && !isLast ? (
                <motion.div whileHover={{ color: 'var(--text-primary)' }} transition={{ duration: 0.15 }}>
                  <Link href={crumb.href} className="text-[--text-muted] transition-colors duration-200">
                    {crumb.label}
                  </Link>
                </motion.div>
              ) : (
                <span className={isLast ? 'text-[--text-primary] font-medium' : 'text-[--text-muted]'}>
                  {crumb.label}
                </span>
              )}
            </motion.span>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <motion.button
          className="h-8 flex items-center gap-2 border border-[--border] rounded-lg px-3 text-[13px] text-[--text-muted] w-52 group"
          style={{ background: 'rgba(10,10,15,0.4)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
          whileHover={{
            borderColor: 'rgba(255,255,255,0.10)',
            backgroundColor: 'rgba(16,16,22,0.6)',
          }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <motion.kbd
            className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded border border-[--border] text-[--text-muted] font-mono"
            style={{ background: 'rgba(20,20,28,0.5)' }}
            whileHover={{ borderColor: 'rgba(255,255,255,0.10)' }}
            transition={{ duration: 0.15 }}
          >
            <Command className="w-2.5 h-2.5" />K
          </motion.kbd>
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-[--text-muted]"
            whileHover={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderColor: 'rgba(255,255,255,0.04)',
              color: 'var(--text-primary)',
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              animate={{ rotate: showNotifications ? 0 : [0, -15, 15, -10, 10, 0] }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <Bell className="w-4 h-4" />
            </motion.div>
            <motion.span
              className="absolute top-[6px] right-[6px] w-[6px] h-[6px] rounded-full ring-2 ring-[--bg-base]"
              style={{ background: 'var(--accent-primary)' }}
              animate={{ boxShadow: ['0 0 4px var(--accent-primary)', '0 0 10px var(--accent-primary)', '0 0 4px var(--accent-primary)'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="absolute right-0 top-full mt-2 w-80 surface-card rounded-xl p-0 overflow-hidden shadow-2xl z-50 origin-top-right"
              >
                <div className="p-3 border-b border-[--border] flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[--text-primary]">Notifications</span>
                  <button className="text-[11px] font-semibold text-[--accent-primary] hover:brightness-125 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-3 border-b border-[--border] hover:bg-white/[0.02] cursor-pointer transition-colors">
                      <p className="text-[13px] text-[--text-primary] font-medium leading-tight mb-1">New project draft generated</p>
                      <p className="text-[11px] text-[--text-muted]">Nexus Digital Rebrand is ready for review.</p>
                      <p className="text-[10px] text-[--text-muted] mt-2">2 hours ago</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[--border] text-center">
                  <button className="text-[12px] font-medium text-[--text-muted] hover:text-[--text-primary]">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
