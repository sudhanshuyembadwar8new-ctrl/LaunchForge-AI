import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800']
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600']
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500']
});

export const metadata: Metadata = {
  title: { default: 'LaunchForge AI', template: '%s — LaunchForge AI' },
  description: 'AI-powered workflow tool for freelancers. Generate proposals, scope docs, pricing, and task lists from client messages in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} ${jetbrains.variable} bg-[var(--bg-base)] text-[var(--text-primary)] antialiased bg-noise`}>
        <div className="bg-ambient" />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
