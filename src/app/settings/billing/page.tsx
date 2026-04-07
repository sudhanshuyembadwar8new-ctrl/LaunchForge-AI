"use client";

import { motion } from 'framer-motion';
import { CreditCard, Check, Sparkles, Zap, ArrowUpRight } from 'lucide-react';
import { fadeUp, btnTap, btnHover } from '@/components/ui/motion';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For side projects and experimentation',
    features: ['3 projects', 'Basic AI generation', 'Community support'],
    current: false,
    cta: 'Downgrade',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For freelancers and solo agencies',
    features: ['Unlimited projects', 'Advanced AI models', 'Priority support', 'Custom branding', 'Export to PDF'],
    current: true,
    cta: 'Current Plan',
    accent: true,
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    description: 'For growing agencies and teams',
    features: ['Everything in Pro', 'Team workspaces', 'Role-based access', 'Analytics dashboard', 'API access', 'SSO'],
    current: false,
    cta: 'Upgrade',
  },
];

export default function BillingPage() {
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
          Billing & Plans
        </h1>
        <p className="text-[14px] text-[--text-muted]">
          Manage your subscription and payment methods.
        </p>
      </motion.div>

      {/* Current Plan Summary */}
      <motion.div variants={fadeUp} className="surface-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[--accent-muted]">
              <Zap className="w-4 h-4 text-[--accent-primary]" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[--text-primary]">Pro Plan</p>
              <p className="text-[12px] text-[--text-muted]">Renews on May 6, 2026</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[24px] font-bold text-[--text-primary] tracking-tight">$19<span className="text-[14px] text-[--text-muted] font-medium">/mo</span></p>
          </div>
        </div>
        <div className="flex gap-3 pt-4 border-t border-[--border]">
          <motion.button
            className="h-8 px-4 text-[12px] font-semibold text-[--text-muted] rounded-lg border border-[--border] hover:border-[rgba(255,255,255,0.10)] hover:text-[--text-primary] transition-all duration-200"
            style={{ background: 'rgba(10,10,15,0.4)' }}
            whileTap={btnTap}
          >
            Cancel plan
          </motion.button>
          <motion.button
            className="h-8 px-4 text-[12px] font-semibold rounded-lg text-white btn-premium flex items-center gap-1.5"
            whileHover={btnHover}
            whileTap={btnTap}
          >
            <ArrowUpRight className="w-3 h-3" />
            Upgrade to Team
          </motion.button>
        </div>
      </motion.div>

      {/* Plans */}
      <motion.div variants={fadeUp}>
        <h2 className="text-[13px] font-semibold text-[--text-muted] uppercase tracking-[0.06em] mb-4">Available plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan,) => (
            <motion.div
              key={plan.name}
              className={`surface-card rounded-xl p-5 flex flex-col relative ${plan.accent ? 'ring-1 ring-[rgba(124,111,247,0.25)]' : ''}`}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
              }}
              whileHover={{ y: -2 }}
            >
              {plan.accent && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-16 bg-[--accent-primary] rounded-b-full"
                  style={{ boxShadow: '0 0 12px rgba()' }}
                />
              )}
              <div className="flex items-center gap-2 mb-3">
                {plan.accent && <Sparkles className="w-3.5 h-3.5 text-[--accent-primary]" />}
                <h3 className="text-[15px] font-bold text-[--text-primary]">{plan.name}</h3>
              </div>
              <div className="mb-1">
                <span className="text-[28px] font-bold text-[--text-primary] tracking-tight">{plan.price}</span>
                <span className="text-[13px] text-[--text-muted]">{plan.period}</span>
              </div>
              <p className="text-[12px] text-[--text-muted] mb-5">{plan.description}</p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-[--text-muted]">
                    <Check className="w-3.5 h-3.5 text-[--accent-secondary] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                className={`h-9 w-full rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                  plan.current
                    ? 'bg-[--accent-muted] text-[--accent-primary] border border-[rgba(124,111,247,0.25)] cursor-default'
                    : plan.accent
                    ? 'btn-premium text-white'
                    : 'border border-[--border] text-[--text-muted] hover:border-[rgba(255,255,255,0.10)] hover:text-[--text-primary]'
                }`}
                style={!plan.current && !plan.accent ? { background: 'rgba(10,10,15,0.4)' } : {}}
                whileTap={plan.current ? {} : btnTap}
                whileHover={plan.current ? {} : btnHover}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div variants={fadeUp} className="surface-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/[0.03]">
              <CreditCard className="w-4 h-4 text-[--text-muted]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[--text-primary]">Payment method</p>
              <p className="text-[12px] text-[--text-muted]">Visa ending in 4242</p>
            </div>
          </div>
          <motion.button
            className="h-8 px-4 text-[12px] font-semibold text-[--text-muted] rounded-lg border border-[--border] hover:border-[rgba(255,255,255,0.10)] hover:text-[--text-primary] transition-all duration-200"
            style={{ background: 'rgba(10,10,15,0.4)' }}
            whileTap={btnTap}
          >
            Update
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
