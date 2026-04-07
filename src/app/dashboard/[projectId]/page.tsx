"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  AlignLeft, DollarSign, ScrollText,
  CheckSquare, MessageSquare, Edit3, Check, Download, Loader2, Layers, Copy, Share, Trash2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DeliverableKey = "brief" | "scope" | "pricing" | "proposal" | "tasks" | "followup";

const TABS: { key: DeliverableKey; label: string; icon: React.ElementType }[] = [
  { key: "brief",    label: "Brief",     icon: AlignLeft      },
  { key: "scope",    label: "Scope",     icon: Layers         },
  { key: "pricing",  label: "Pricing",   icon: DollarSign     },
  { key: "proposal", label: "Proposal",  icon: ScrollText     },
  { key: "tasks",    label: "Tasks",     icon: CheckSquare    },
  { key: "followup", label: "Follow-up", icon: MessageSquare  },
];

type ProjectData = Record<DeliverableKey, string>;

export default function DeliverablesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const [data, setData]           = useState<ProjectData | null>(null);
  const [title, setTitle]         = useState("");
  const [activeTab, setActiveTab] = useState<DeliverableKey>("brief");
  const [editing, setEditing]     = useState(false);
  const [draft, setDraft]         = useState("");
  const [deleting, setDeleting]   = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(`project_${projectId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed.data);
      setTitle(parsed.title);
      setDraft(parsed.data["brief"] ?? "");
    } else {
      // Create mock data for demo
      setData({
        brief: "Mock brief...", scope: "Mock scope...", 
        pricing: "Pricing...", proposal: "Proposal...", 
        tasks: "- [ ] Setup project\n- [x] Configure DB", followup: "Followup..."
      } as ProjectData);
      setTitle("Mock Project");
      setDraft("Mock brief...");
    }
  }, [projectId]);

  if (!data) {
    return (
      <div className="flex flex-col gap-6 animate-fade-up">
        <div className="flex items-center gap-2 text-[--text-muted] text-[13px] pt-4">
          <Loader2 className="w-4 h-4 animate-spin text-[--accent-primary]" />
          Loading deliverables…
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const newData = { ...data, [activeTab]: draft };
    setData(newData as ProjectData);
    localStorage.setItem(`project_${projectId}`, JSON.stringify({ title, data: newData }));
    setEditing(false);
    toast("Saved successfully", "success");
  };

  const handleCopy = async () => {
    const content = data[activeTab] ?? "";
    await navigator.clipboard.writeText(content);
    toast("Copied to clipboard!", "success");
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast("Shareable link copied to clipboard", "success");
  };

  const handleExport = () => {
    toast("Exporting to PDF...", "info");
    setTimeout(() => {
      window.print();
      toast("PDF Downloaded", "success");
    }, 800);
  };

  const handleDelete = async () => {
    // Delete from mock Supabase
    localStorage.removeItem(`project_${projectId}`);
    toast("Project deleted forever", "error"); // using red color conceptually
    router.push('/dashboard');
  };

  const switchTab = (key: DeliverableKey) => {
    setActiveTab(key);
    setDraft(data[key] ?? "");
    setEditing(false);
  };

  const activeContent = editing ? draft : (data[activeTab] ?? "");

  // Interactive Tasks Rendering
  const renderTasks = (content: string) => {
    if (activeTab !== 'tasks' || editing) return null;
    
    const lines = content.split('\n');
    return (
      <div className="flex flex-col gap-2">
        {lines.map((line, i) => {
          const match = line.match(/^-\s*\[([ xX])\]\s*(.*)/);
          if (match) {
            const isChecked = match[1].toLowerCase() === 'x';
            return (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => {
                    const newLines = [...lines];
                    newLines[i] = `- [${e.target.checked ? 'x' : ' '}] ${match[2]}`;
                    const newData = { ...data, tasks: newLines.join('\n') };
                    setData(newData as ProjectData);
                    localStorage.setItem(`project_${projectId}`, JSON.stringify({ title, data: newData }));
                    toast(e.target.checked ? "Task completed!" : "Task uncompleted", "success");
                  }}
                  className="mt-1 w-4 h-4 rounded border-[--border] text-[--accent-primary] focus:ring-[--accent-primary] focus:ring-offset-[--bg-surface] bg-white/[0.05]"
                />
                <span className={cn("text-[13.5px]", isChecked ? "line-through text-[--text-muted]" : "text-[--text-primary]")}>
                  {match[2]}
                </span>
              </label>
            );
          }
          return <p key={i} className="text-[13.5px] font-medium mt-2">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-fade-up pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[24px] font-bold text-[--text-primary] tracking-tight leading-none">
            {title}
          </h1>
          <p className="text-[13px] text-[--text-muted]">AI-generated deliverables · review, edit, and export</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setDeleting(true)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-semibold text-red-400 hover:bg-red-400/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button onClick={handleShare} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[13px] font-semibold text-[--text-muted] surface-card hover:text-[--text-primary]">
            <Share className="w-3.5 h-3.5" /> Share
          </button>
          <button onClick={handleExport} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 h-8 px-4 rounded-lg text-[13px] font-semibold text-white btn-premium">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-5 flex-1 min-h-[520px]">

        {/* Tab List */}
        <div className="md:w-[168px] shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 pt-0.5">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 text-left whitespace-nowrap min-h-[44px]",
                  active
                    ? "text-white"
                    : "text-[--text-muted] hover:text-[--text-muted] hover:bg-white/[0.03]"
                )}
              >
                {active && (
                  <div className="absolute inset-0 rounded-lg bg-[--accent-muted] border border-[rgba(124,111,247,0.25)]"
                    style={{ boxShadow: '0 0 16px rgba(), inset 0 1px 0 rgba(255,255,255,0.03)' }}
                  />
                )}
                <Icon className={cn("w-3.5 h-3.5 shrink-0 relative z-10 transition-colors duration-200", active ? "text-[--accent-primary]" : "text-[--text-muted]")} />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col rounded-xl overflow-hidden min-h-[400px] surface-card">
          {/* Toolbar */}
          <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.04]" style={{ background: 'rgba(17,17,24,0.5)' }}>
            <span className="text-[12px] font-bold text-[--text-muted] uppercase tracking-[0.06em]">
              {TABS.find(t => t.key === activeTab)?.label}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={handleCopy} className="flex items-center gap-1.5 h-6 px-3 text-[11px] font-semibold text-[--text-muted] hover:text-[--text-muted] hover:bg-white/[0.04] rounded-md transition-all duration-200">
                <Copy className="w-3 h-3" /> Copy
              </button>
              {editing ? (
                <button onClick={handleSave} className="flex items-center gap-1.5 h-6 px-3 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 rounded-md transition-all">
                  <Check className="w-3 h-3" /> Save
                </button>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 h-6 px-3 text-[11px] font-semibold text-[--text-muted] hover:text-[--text-muted] hover:bg-white/[0.04] rounded-md transition-all">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {editing ? (
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                autoFocus
                className="absolute inset-0 w-full h-full bg-transparent text-[13px] text-[--text-muted] p-5 focus:outline-none resize-none leading-[1.8] font-mono placeholder:text-[--text-muted]"
              />
            ) : (
              <div className="absolute inset-0 overflow-y-auto p-5 leading-[1.8] font-mono">
                {activeTab === 'tasks' ? renderTasks(activeContent) : (
                  <span className="text-[13px] text-[--text-muted] whitespace-pre-wrap">{activeContent || <span className="text-[--text-muted] italic">No content.</span>}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center top-0 left-0 right-0 bottom-0">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleting(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative surface-card p-6 rounded-2xl max-w-[400px] w-[90vw] z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">Delete Project</h3>
                <button onClick={() => setDeleting(false)} className="text-[--text-muted] hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[14px] text-[--text-muted] mb-6">Are you sure you want to delete <span className="text-white font-medium">{title}</span>? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleting(false)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[--text-muted] hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
