import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/config/site';

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const allowIndexing = process.env.SITE_ALLOW_INDEXING === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Every Tool You Need, All in One Place`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: '/images/logo/icon-with-bg.png',
    apple: '/images/logo/icon-with-bg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-secondary selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
