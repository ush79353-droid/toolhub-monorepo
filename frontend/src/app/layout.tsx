import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — Every Tool You Need, All in One Place`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-secondary selection:text-foreground">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
