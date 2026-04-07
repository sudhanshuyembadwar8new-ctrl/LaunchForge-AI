"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, AlertCircle, ArrowRight, Save, Copy, Edit3, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

type ProjectData = Record<"brief" | "scope" | "pricing" | "proposal" | "tasks" | "followup", string>;

export default function NewProjectPage() {
  const [title, setTitle]     = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [data, setData]       = useState<ProjectData | null>(null);
  
  // State for output cards
  const [editingField, setEditingField] = useState<keyof ProjectData | null>(null);
  const [draft, setDraft] = useState("");
  const [savingGlobal, setSavingGlobal] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectTitle: title, clientMessage: message }),
      });
      if (!res.ok) throw new Error("Generation failed — check your API key or try again.");
      const generatedData = await res.json();
      setData(generatedData);
      toast("Generated successfully!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast("Copied!", "success");
  };

  const handleEdit = (field: keyof ProjectData) => {
    setEditingField(field);
    setDraft(data?.[field] || "");
  };

  const handleSaveField = (field: keyof ProjectData) => {
    if (data) {
      setData({ ...data, [field]: draft });
    }
    setEditingField(null);
    toast("Updated successfully", "success");
  };

  const handleSaveProject = async () => {
    if (!data || !title) return;
    setSavingGlobal(true);
    
    // Simulate Supabase save
    await new Promise(r => setTimeout(r, 600));
    
    const projectId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    localStorage.setItem(`project_${projectId}`, JSON.stringify({ title, data }));
    
    toast("Project saved!", "success");
    router.push(`/dashboard/${projectId}`);
  };

  const isReady = title.length > 0 && message.length > 0;

  return (
    <div className="animate-fade-up flex flex-col gap-8 pb-10">
      <div className="max-w-[640px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-[--text-primary] tracking-tight leading-none mb-2">
            New Project
          </h1>
          <p className="text-[13px] text-[--text-muted] leading-relaxed">
            Paste your client's raw message below. AI generates a brief, scope, pricing, proposal, tasks, and follow-up.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-5">
          {/* Project Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[--text-muted] tracking-[0.02em]" htmlFor="project-title">
              Project title
            </label>
            <input
              id="project-title"
              type="text"
              placeholder="e.g. Stripe integration for SaaS"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={!!data}
              className="h-10 rounded-lg px-3.5 text-[13px] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'rgba(12,12,18,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: 'var(--shadow-card)',
              }}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[--text-muted] tracking-[0.02em]" htmlFor="client-message">
              Client message
            </label>
            <textarea
              id="client-message"
              rows={5}
              placeholder={"Hi! We need you to build a payment flow using Stripe."}
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
              disabled={!!data}
              className="rounded-lg px-3.5 py-3 text-[13px] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none transition-all duration-200 resize-none leading-[1.7] disabled:opacity-50"
              style={{
                background: 'rgba(12,12,18,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: 'var(--shadow-card)',
              }}
            />
          </div>

          {/* Actions */}
          {!data && (
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
              <p className="text-[11px] text-[--text-muted] flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[--accent-secondary] animate-pulse" />
                Powered by Groq · LLaMA 3 70B
              </p>
              <button
                type="submit"
                disabled={loading || !isReady}
                className="flex items-center gap-2 h-9 px-5 text-white text-[13px] font-semibold rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-[1px] active:translate-y-0"
                style={{
                  background: isReady ? 'linear-gradient(135deg, #7C6FF7, #6358d4)' : 'rgba(124,111,247,0.3)',
                  boxShadow: isReady ? '0 2px 16px rgba(124,111,247,0.35), 0 0 0 1px rgba(124,111,247,0.15)' : 'none',
                }}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {loading ? "Generating…" : "Generate"}
                {!loading && <ArrowRight className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Output Cards */}
      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between border-b border-[--border] pb-4">
              <h2 className="text-[18px] font-bold text-[--text-primary]">Generated Outputs</h2>
              <button
                onClick={handleSaveProject}
                disabled={savingGlobal}
                className="flex items-center gap-2 h-9 px-5 bg-[--accent-primary] text-white text-[13px] font-semibold rounded-lg hover:brightness-110 active:scale-95 transition-all"
              >
                {savingGlobal ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(["brief", "proposal", "tasks"] as Array<keyof ProjectData>).map((field) => (
                <div key={field} className="surface-card rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                  <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-white/[0.04]" style={{ background: 'rgba(17,17,24,0.5)' }}>
                    <span className="text-[12px] font-bold text-[--text-muted] uppercase tracking-[0.06em]">
                      {field}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(data[field])}
                        className="flex items-center gap-1 h-6 px-2.5 text-[11px] font-medium text-[--text-muted] hover:text-[--text-muted] hover:bg-white/[0.04] rounded-md transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      {editingField === field ? (
                        <button
                          onClick={() => handleSaveField(field)}
                          className="flex items-center gap-1 h-6 px-2.5 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-md transition-colors border border-emerald-500/20"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(field)}
                          className="flex items-center gap-1 h-6 px-2.5 text-[11px] font-medium text-[--text-muted] hover:text-[--text-muted] hover:bg-white/[0.04] rounded-md transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 relative p-4 bg-black/20">
                    {editingField === field ? (
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="w-full h-full bg-transparent text-[13px] text-[--text-muted] font-mono resize-none focus:outline-none leading-[1.6]"
                      />
                    ) : (
                      <div className="w-full h-full text-[13px] text-[--text-muted] font-mono whitespace-pre-wrap overflow-y-auto leading-[1.6]">
                        {data[field]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
