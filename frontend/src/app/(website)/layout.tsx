import * as React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-secondary selection:text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
