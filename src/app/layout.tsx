
import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ToolsSidebarProvider } from '@/hooks/use-tools-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ClientWrapper } from '@/components/client-wrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-headline' });

export const metadata: Metadata = {
  title: 'REON AI - Your Personal AI Exam Prep Partner',
  description: 'AI-powered learning platform for competitive exams in India.',
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
        suppressHydrationWarning
      >
        <ClientWrapper>
          <FirebaseClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ToolsSidebarProvider>
                {children}
                <Toaster />
              </ToolsSidebarProvider>
            </ThemeProvider>
          </FirebaseClientProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
