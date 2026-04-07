'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Plus,
  Settings,
  CreditCard,
  FileClock,
  Zap,
  ChevronsUpDown,
} from 'lucide-react';
import { slideLeft } from '@/components/ui/motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
  { icon: Plus,        label: 'New Project', href: '/dashboard/new' },
];

const SETTINGS_ITEMS = [
  { icon: Settings,   label: 'Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing',  href: '/settings/billing' },
];

const RECENT_PROJECTS = [
  { label: 'Nexus Digital Rebrand', href: '#' },
  { label: 'Kirana Store App',      href: '#' },
  { label: 'SaaS MVP Backend',      href: '#' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      className="w-[240px] shrink-0 flex flex-col h-screen border-r border-[--border] relative overflow-hidden bg-[rgba(5,5,8,0.6)]"
      style={{ backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)' }}
      variants={slideLeft}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 200px 150px at 50% 0%, rgba(124,111,247,0.12), transparent)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Logo */}
      <div className="h-[52px] flex items-center px-4 border-b border-[--border] shrink-0 relative z-10">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 btn-premium"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </motion.div>
          <motion.span
            className="text-[14px] font-semibold text-[--text-primary] tracking-tight"
            whileHover={{ color: '#ffffff' }}
            transition={{ duration: 0.15 }}
          >
            LaunchForge
          </motion.span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6 relative z-10">
        <NavSection>
          {NAV_ITEMS.map((item, i) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              index={i}
            />
          ))}
        </NavSection>

        <NavSection label="Recent">
          {RECENT_PROJECTS.map((p, i) => (
            <RecentItem
              key={p.label}
              label={p.label}
              href={p.href}
              active={pathname === p.href}
              index={i}
            />
          ))}
        </NavSection>

        <NavSection label="Account">
          {SETTINGS_ITEMS.map((item, i) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              index={i}
            />
          ))}
        </NavSection>
      </nav>

      {/* User Menu */}
      <div className="shrink-0 p-3 border-t border-[--border] relative z-10">
        <UserDropdown />
      </div>
    </motion.aside>
  );
}

function UserDropdown() {
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    // Basic sign out
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="absolute bottom-full left-0 mb-2 w-full surface-card rounded-xl p-1 z-50 shadow-2xl origin-bottom"
            >
              <Link href="/settings" onClick={() => setOpen(false)}>
                <div className="px-3 py-2 text-[13px] text-[--text-primary] hover:bg-white/[0.04] rounded-lg cursor-pointer transition-colors">
                  View Profile
                </div>
              </Link>
              <Link href="/settings" onClick={() => setOpen(false)}>
                <div className="px-3 py-2 text-[13px] text-[--text-primary] hover:bg-white/[0.04] rounded-lg cursor-pointer transition-colors">
                  Settings
                </div>
              </Link>
              <div className="h-px bg-[--border] my-1" />
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-[13px] text-[--text-muted] hover:text-[#F87171] hover:bg-white/[0.04] rounded-lg cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-2 py-2 rounded-xl border border-transparent text-left relative z-50"
        whileHover={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.04)',
        }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 btn-premium"
          style={{ boxShadow: '0 0 12px rgba(139,126,248,0.2)' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.2 }}
        >
          S
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[--text-primary] truncate leading-tight">Sudhanshu</p>
          <p className="text-[11px] text-[--text-muted] truncate leading-tight mt-0.5">Pro Plan</p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <ChevronsUpDown className="w-4 h-4 text-[--text-muted]" />
        </motion.div>
      </motion.button>
    </div>
  );
}

function NavSection({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <p className="px-2 mb-1.5 text-[11px] font-semibold text-[--text-muted] uppercase tracking-[0.06em]">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  index,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: (index ?? 0) * 0.05 }}
    >
      <Link href={href} className="block">
        <motion.div
          className={cn(
            'relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13.5px] font-medium border border-transparent overflow-hidden cursor-pointer',
            active ? 'text-white' : 'text-[--text-muted]',
          )}
          whileHover={active ? {} : {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.04)',
            y: -0.5,
          }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
        >
          {/* Active background */}
          <AnimatePresence>
            {active && (
              <motion.div
                className="absolute inset-0 rounded-lg bg-[--accent-muted] border border-[rgba(124,111,247,0.25)]"
                style={{ boxShadow: '0 0 20px rgba(124,111,247,0.12), inset 0 1px 0 rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Active left indicator */}
          <AnimatePresence>
            {active && (
              <motion.div
                className="absolute left-0 top-1/2 rounded-r-full bg-[--accent-primary]"
                style={{ boxShadow: '0 0 8px var(--accent-primary)', width: 3 }}
                initial={{ height: 0, y: '-50%', opacity: 0 }}
                animate={{ height: 16, y: '-50%', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative z-10"
            whileHover={{ x: active ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <Icon
              className={cn(
                'w-[16px] h-[16px] shrink-0 transition-colors duration-200',
                active ? 'text-[--accent-primary]' : 'text-[--text-muted]',
              )}
            />
          </motion.div>
          <span className="relative z-10">{label}</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function RecentItem({
  label,
  href,
  active,
  index,
}: {
  label: string;
  href: string;
  active?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay: (index ?? 0) * 0.05 + 0.1 }}
    >
      <Link href={href} className="block">
        <motion.div
          className={cn(
            'flex items-center gap-3 px-2.5 py-2 rounded-lg text-[13px] border border-transparent cursor-pointer',
            active
              ? 'bg-[--accent-muted] text-[--text-primary] font-medium border-[rgba(124,111,247,0.25)]'
              : 'text-[--text-muted]',
          )}
          whileHover={active ? {} : {
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: 'rgba(255,255,255,0.04)',
            y: -0.5,
          }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
        >
          <FileClock
            className={cn(
              'w-[15px] h-[15px] shrink-0 transition-colors',
              active ? 'text-[--accent-primary]' : 'text-[--text-muted]',
            )}
          />
          <span className="truncate">{label}</span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
