import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[--bg-base] text-[--text-primary]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-[900px] mx-auto px-8 py-10 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
