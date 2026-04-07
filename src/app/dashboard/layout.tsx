import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import Link from 'next/link';
import { LayoutGrid, Plus, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[--bg-surface] text-[--text-primary]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 min-w-0 pb-[64px] md:pb-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto relative z-10 w-full">
          <div className="w-full max-w-[900px] mx-auto px-4 sm:px-8 py-6 sm:py-10 page-enter">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[rgba(17,17,24,0.8)] backdrop-blur-xl border-t border-[--border] z-50 flex items-center justify-around px-4">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 min-w-[44px] min-h-[44px] justify-center text-[--text-muted] active:text-[--text-primary]">
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/dashboard/new" className="flex flex-col items-center gap-1 p-2 min-w-[44px] min-h-[44px] justify-center text-[--accent-primary]">
          <div className="bg-[--accent-primary] text-white p-2 rounded-full absolute -top-4 shadow-lg shadow-[rgba(124,111,247,0.4)]">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium mt-4 text-[--text-primary]">New</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 p-2 min-w-[44px] min-h-[44px] justify-center text-[--text-muted] active:text-[--text-primary]">
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
}

