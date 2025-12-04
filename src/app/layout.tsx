
import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ToolsSidebarProvider } from '@/hooks/use-tools-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-headline' });

export const metadata: Metadata = {
  title: 'REON AI PREP - Your Personal AI Exam Prep Partner',
  description: 'REON AI PREP is your personal AI-powered learning platform for competitive exams in India like Railway and Bank PO. Get personalized study plans, mock tests, and AI-driven insights to ace your exams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn('min-h-screen bg-background font-body antialiased', inter.variable, lexend.variable)}
        suppressHydrationWarning={true}
      >
          <FirebaseClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              themes={['theme-default-light', 'theme-default-dark', 'theme-sapphire-light', 'theme-sapphire-dark']}
            >
              <ToolsSidebarProvider>
                {children}
                <Toaster />
              </ToolsSidebarProvider>
            </ThemeProvider>
          </FirebaseClientProvider>
      </body>
    </html>
  );
}
