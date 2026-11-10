import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Mega Tools Admin Console',
    template: '%s | Mega Tools Admin',
  },
  description: 'Administration and tool registry management console for Mega Tools.',
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
