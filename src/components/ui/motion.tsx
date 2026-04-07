'use client';

import {
  motion,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';
import { forwardRef } from 'react';

/* ─── Easing presets ─── */
export const ease = {
  spring: { type: 'spring', stiffness: 400, damping: 30 },
  springSnappy: { type: 'spring', stiffness: 500, damping: 35 },
  out: [0.16, 1, 0.3, 1] as const,
  outCubic: [0.33, 1, 0.68, 1] as const,
} as const;

/* ─── Variant presets ─── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.4, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1,   transition: { duration: 0.35, ease: ease.out } },
};

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: ease.out } },
};

/* ─── Card hover motion values ─── */
export const cardHover = {
  rest:  { y: 0, boxShadow: 'var(--shadow-card)' },
  hover: {
    y: -3,
    boxShadow: 'var(--shadow-card-hover), var(--shadow-glow-accent)',
    transition: { duration: 0.25, ease: ease.out },
  },
};

/* ─── Button tap ─── */
export const btnTap = { scale: 0.97 };
export const btnHover = { y: -1 };

/* ─── MotionCard wrapper ─── */
export const MotionCard = forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  (props, ref) => (
    <motion.div
      ref={ref}
      initial="rest"
      whileHover="hover"
      animate="rest"
      {...props}
    />
  ),
);
MotionCard.displayName = 'MotionCard';

/* ─── FadeUp section wrapper ─── */
export function FadeUpSection({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{ transitionDelay: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger container ─── */
export function StaggerContainer({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.07, delayChildren: delay / 1000 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Skeleton shimmer ─── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-lg bg-[--bg-elevated] relative overflow-hidden ${className ?? ''}`}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
}
