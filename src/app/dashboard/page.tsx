"use client";

import {
  motion,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowUpRight,
  FileText,
  Plus,
  TrendingUp,
  Clock,
  Sparkles,
  FolderOpen,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import {
  fadeUp,
  cardHover,
  btnTap,
  btnHover,
  StaggerContainer,
  Skeleton,
} from '@/components/ui/motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function DashboardPage() {
  const hasProjects = true;

  return (
    <motion.div
      className="flex flex-col gap-8 sm:gap-10"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
      }}
    >
      {/* ── Header ─── */}
      <motion.div
        className="flex flex-col sm:flex-row items-start justify-between gap-4"
        variants={fadeUp}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] sm:text-[28px] font-bold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Good evening, Sudhanshu
          </h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[--accent-primary] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[--accent-primary]" />
            </span>
            <p className="text-[14px] text-[--text-muted]">Your workspace is ready.</p>
          </div>
        </div>

        <motion.div whileHover={btnHover} whileTap={btnTap}>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 h-9 px-5 rounded-lg text-[13px] font-semibold text-white btn-premium min-h-[44px] sm:min-h-0"
          >
            <motion.span
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="flex"
            >
              <Plus className="w-[15px] h-[15px]" />
            </motion.span>
            New Project
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Stats ─── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={fadeUp}
      >
        <StatCard
          label="Active Projects"
          value="3"
          sub="+1 this month"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          label="Revenue Est."
          value="$14,250"
          sub="+$2,400 this week"
          icon={<ArrowUpRight className="w-4 h-4" />}
          positive
        />
        <StatCard
          label="Proposals Sent"
          value="12"
          sub="8 pending review"
          icon={<Clock className="w-4 h-4" />}
        />
      </motion.div>

      {/* ── Projects Table ─── */}
      <motion.div variants={fadeUp}>
        <AnimatePresence mode="wait">
          {hasProjects ? (
            <motion.div
              key="projects"
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-[--text-primary] tracking-tight flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Activity className="w-4 h-4 text-[--accent-primary]" />
                  </motion.span>
                  Recent Activity
                </h2>
                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                  <Link
                    href="/dashboard/projects"
                    className="text-[13px] font-medium text-[--text-muted] hover:text-[--accent-primary] transition-colors duration-200"
                  >
                    View all →
                  </Link>
                </motion.div>
              </div>

              {/* Table - desktop */}
              <motion.div
                className="rounded-xl surface-card p-1 hidden sm:block"
                whileHover={{
                  boxShadow: 'var(--shadow-card-hover), var(--shadow-glow-accent)',
                }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(10,10,15,0.4)' }}>
                  {/* Header */}
                  <div className="grid grid-cols-12 px-5 py-3 border-b border-[--border]">
                    <div className="col-span-5 text-[11px] font-semibold text-[--text-muted] uppercase tracking-[0.06em]">Project</div>
                    <div className="col-span-3 text-[11px] font-semibold text-[--text-muted] uppercase tracking-[0.06em]">Status</div>
                    <div className="col-span-2 text-[11px] font-semibold text-[--text-muted] uppercase tracking-[0.06em]">Date</div>
                    <div className="col-span-2 text-[11px] font-semibold text-[--text-muted] uppercase tracking-[0.06em] text-right">Amount</div>
                  </div>

                  {/* Rows */}
                  <StaggerContainer delay={150}>
                    <ProjectRow title="Nexus Digital Rebrand" client="Nexus Core"    status="active" date="Today"     amount="$8,500" href="/dashboard/nexus" />
                    <ProjectRow title="Kirana Store App"      client="S-M Supermart" status="review" date="Yesterday" amount="$3,250" href="/dashboard/kirana" />
                    <ProjectRow title="SaaS MVP Backend"      client="CloudSync"     status="draft"  date="Oct 12"    amount="$2,500" href="/dashboard/saas-mvp" />
                  </StaggerContainer>
                </div>
              </motion.div>

              {/* Cards - mobile */}
              <div className="sm:hidden flex flex-col gap-3">
                <MobileProjectCard title="Nexus Digital Rebrand" client="Nexus Core"    status="active" date="Today"     amount="$8,500" href="/dashboard/nexus" />
                <MobileProjectCard title="Kirana Store App"      client="S-M Supermart" status="review" date="Yesterday" amount="$3,250" href="/dashboard/kirana" />
                <MobileProjectCard title="SaaS MVP Backend"      client="CloudSync"     status="draft"  date="Oct 12"    amount="$2,500" href="/dashboard/saas-mvp" />
              </div>
            </motion.div>
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <motion.div
      className="surface-card flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[rgba(255,255,255,0.10)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      style={{
        background: 'radial-gradient(ellipse 400px 300px at 50% 50%, rgba(), transparent)',
      }}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
        style={{
          background: 'var(--accent-muted)',
          border: '1px solid rgba()',
          boxShadow: '0 0 40px rgba()',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: EASE_OUT }}
        whileHover={{ scale: 1.08 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl bg-[--accent-primary] blur-xl"
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <FolderOpen className="w-7 h-7 text-[--accent-primary] relative z-10" />
        </motion.div>
      </motion.div>

      <motion.h3
        className="text-[18px] font-bold text-[--text-primary] mb-2 tracking-tight"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: EASE_OUT }}
      >
        No projects yet
      </motion.h3>
      <motion.p
        className="text-[14px] text-[--text-muted] mb-8 max-w-[320px] text-center leading-relaxed px-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.27, duration: 0.4, ease: EASE_OUT }}
      >
        Paste a client message to generate your first proposal, scope, and pricing in seconds.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34, duration: 0.4, ease: EASE_OUT }}
        whileHover={btnHover}
        whileTap={btnTap}
      >
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 h-10 px-6 rounded-lg text-[14px] font-semibold text-white btn-premium min-h-[44px]"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="flex"
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
          Create your first project
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <motion.div
      className="surface-card flex flex-col gap-4 p-5 rounded-xl cursor-default"
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
        rest:  {},
        hover: {
          y: -3,
          transition: { duration: 0.25, ease: EASE_OUT },
        },
      }}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="flex justify-between items-start">
        <p className="text-[12px] font-semibold text-[--text-muted] uppercase tracking-[0.06em]">
          {label}
        </p>
        <motion.div
          className={`p-1.5 rounded-md ${positive ? 'bg-[rgba(79,209,197,0.1)] text-[--accent-secondary]' : 'bg-white/[0.03] text-[--text-muted]'}`}
          whileHover={{ scale: 1.15, rotate: positive ? 0 : 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
      <div className="flex flex-col gap-1.5 mt-1">
        <motion.p
          className="text-[28px] sm:text-[32px] font-bold text-[--text-primary] tracking-tight leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {value}
        </motion.p>
        <div className={`flex items-center gap-1.5 text-[13px] font-medium ${positive ? 'text-[--accent-secondary]' : 'text-[--text-muted]'}`}>
          {sub}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Project Row (desktop) ── */
type Status = 'active' | 'review' | 'draft';

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string; ring: string }> = {
  active: {
    bg: 'rgba(79, 209, 197, 0.1)',
    text: 'var(--accent-secondary)',
    dot: 'var(--accent-secondary)',
    ring: 'rgba(79, 209, 197, 0.12)',
  },
  review: {
    bg: 'rgba(251,191,36,0.1)',
    text: '#fbbf24',
    dot: '#fbbf24',
    ring: 'rgba(251,191,36,0.2)',
  },
  draft: {
    bg: 'rgba(255,255,255,0.03)',
    text: 'var(--text-muted)',
    dot: 'var(--text-muted)',
    ring: 'rgba(255,255,255,0.05)',
  },
};

const STATUS_LABELS: Record<Status, string> = {
  active: 'Active',
  review: 'In Review',
  draft: 'Draft',
};

function ProjectRow({
  title,
  client,
  status,
  date,
  amount,
  href,
}: {
  title: string;
  client: string;
  status: Status;
  date: string;
  amount: string;
  href: string;
}) {
  const s = STATUS_STYLES[status];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE_OUT } },
      }}
    >
      <motion.div
        className="relative"
        initial={false}
        whileHover={{
          backgroundColor: 'rgba(255,255,255,0.018)',
        }}
        transition={{ duration: 0.15 }}
      >
        <Link
          href={href}
          className="grid grid-cols-12 items-center px-5 py-4 group"
        >
          {/* Project */}
          <div className="col-span-5 flex items-center gap-3.5">
            <motion.div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[--bg-surface] border border-[--border]"
              whileHover={{
                borderColor: 'rgba()',
                backgroundColor: 'rgba(255,255,255,0.04)',
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              <FileText className="w-4 h-4 text-[--text-muted] group-hover:text-[--text-primary] transition-colors duration-200" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-[--text-muted] group-hover:text-white transition-colors duration-200 truncate pr-4">
                {title}
              </p>
              <p className="text-[12.5px] text-[--text-muted] truncate">{client}</p>
            </div>
          </div>

          {/* Status */}
          <div className="col-span-3">
            <motion.span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
              style={{
                background: s.bg,
                color: s.text,
                boxShadow: `0 0 0 1px ${s.ring}, inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.15 }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}` }}
                animate={status === 'active' ? { opacity: [1, 0.4, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {STATUS_LABELS[status]}
            </motion.span>
          </div>

          {/* Date */}
          <div className="col-span-2 text-[13.5px] font-medium text-[--text-muted]">{date}</div>

          {/* Amount */}
          <motion.div
            className="col-span-2 text-right text-[14px] font-semibold text-[--text-muted] tabular-nums"
            whileHover={{ color: '#ffffff' }}
            transition={{ duration: 0.15 }}
          >
            {amount}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Mobile Project Card ── */
function MobileProjectCard({
  title,
  client,
  status,
  date,
  amount,
  href,
}: {
  title: string;
  client: string;
  status: Status;
  date: string;
  amount: string;
  href: string;
}) {
  const s = STATUS_STYLES[status];
  return (
    <Link href={href} className="surface-card rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[--bg-surface] border border-[--border]">
            <FileText className="w-4 h-4 text-[--text-muted]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-medium text-[--text-primary] truncate">{title}</p>
            <p className="text-[12px] text-[--text-muted] truncate">{client}</p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0"
          style={{
            background: s.bg,
            color: s.text,
            boxShadow: `0 0 0 1px ${s.ring}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
          {STATUS_LABELS[status]}
        </span>
      </div>
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[--text-muted]">{date}</span>
        <span className="font-semibold text-[--text-primary] tabular-nums">{amount}</span>
      </div>
    </Link>
  );
}

/* ── Skeleton ── */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-card p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
