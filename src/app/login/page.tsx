"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [show,     setShow]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const router   = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: '#06060a' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(124,111,247,0.08), transparent 70%)' }}
        />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[200px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(52,211,153,0.04), transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-[380px] animate-fade-up">
        <div className="rounded-2xl p-8"
          style={{
            background: 'rgba(12,12,18,0.7)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #7C6FF7, #6358d4)',
                boxShadow: '0 4px 16px rgba(124,111,247,0.35)',
              }}
            >
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[16px] font-bold text-[--text-primary] tracking-tight">LaunchForge AI</span>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-[20px] font-bold text-[--text-primary] mb-1">Welcome back</h1>
            <p className="text-[13px] text-[--text-muted]">Sign in to your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[--text-muted] tracking-[0.02em]" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="h-10 rounded-lg px-3.5 text-[13px] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none transition-all duration-200"
                style={{
                  background: 'rgba(17,17,24,0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124,111,247,0.4)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,111,247,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[--text-muted] tracking-[0.02em]" htmlFor="password">
                  Password
                </label>
                <button type="button" onClick={() => toast("Password reset link sent to your email", "info")} className="text-[11px] text-[--text-muted] hover:text-[--accent-primary] transition-colors duration-200">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 w-full rounded-lg pl-3.5 pr-10 text-[13px] text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(17,17,24,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(124,111,247,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,111,247,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-muted] transition-colors duration-200"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[12px] text-red-400 rounded-lg px-3 py-2"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-10 flex items-center justify-center gap-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 group"
              style={{
                background: 'linear-gradient(135deg, #7C6FF7, #6358d4)',
                boxShadow: '0 2px 16px rgba(124,111,247,0.3), 0 0 0 1px rgba(124,111,247,0.15)',
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[12px] text-[--text-muted]">
            No account?{" "}
            <Link href="/signup" className="text-[--accent-primary] hover:text-[--accent-hover] transition-colors duration-200 font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
