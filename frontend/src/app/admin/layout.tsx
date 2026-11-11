import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Omega Calculators Admin Console',
    template: '%s | Omega Calculators Admin',
  },
  description: 'Administration and tool registry management console for Omega Calculators.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-secondary selection:text-foreground">
      {children}
    </div>
  );
}
