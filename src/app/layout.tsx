import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mistral AI API Tester',
  description: 'A simple page to test Mistral AI models',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
