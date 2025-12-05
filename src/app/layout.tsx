
import type { Metadata, Viewport } from 'next';
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

const APP_NAME = "REON AI PREP";
const APP_DEFAULT_TITLE = "REON AI PREP - Your Personal AI Exam Prep Partner";
const APP_TITLE_TEMPLATE = "%s | REON AI PREP";
const APP_DESCRIPTION = "REON AI PREP is your personal AI-powered learning platform for competitive exams in India like Railway and Bank PO. Get personalized study plans, mock tests, and AI-driven insights to ace your exams.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: "https://reon.ai/wolf_logo_like_roy_group_circle.svg",
        width: 1024,
        height: 1024,
        alt: "REON AI PREP Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: ["https://reon.ai/wolf_logo_like_roy_group_circle.svg"],
  },
  icons: {
    icon: "/wolf_logo_like_roy_group_circle.svg",
    apple: "/wolf_logo_like_roy_group_circle.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
        <ClientWrapper>
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
        </ClientWrapper>
      </body>
    </html>
  );
}
