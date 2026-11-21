'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, Share2, Sparkles } from 'lucide-react';
import { Container } from './Container';
import { HeaderSearch } from './HeaderSearch';

function ShareButton() {
  const [copied, setCopied] = React.useState(false);

  async function sharePage() {
    const url = window.location.href;
    const title = document.title || 'Omega Calculators';
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void sharePage()}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary sm:px-3"
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      <span>{copied ? 'Copied' : 'Share'}</span>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <Container className="relative flex h-16 items-center gap-3">
        <Link href="/" className="group relative z-10 flex shrink-0 items-center">
          <img
            src="/images/logo/horizontal-logo.png"
            alt="Omega Calculators"
            className="h-8 w-auto transition-transform group-hover:scale-[1.01] sm:h-9"
          />
        </Link>

        {isHome ? null : (
          <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
            <HeaderSearch
              inputId="header-tool-search-desktop"
              className="pointer-events-auto w-[min(36rem,calc(100%-26rem))]"
            />
          </div>
        )}

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2">
          <ShareButton />
          <Link
            href="/tools"
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-2.5 text-sm font-medium text-white shadow-xs transition-colors hover:bg-[hsl(var(--primary-hover))] sm:gap-2 sm:px-3.5"
          >
            <Sparkles className="h-4 w-4" />
            <span className="sm:hidden">Explore</span>
            <span className="hidden sm:inline">Explore Tools</span>
          </Link>
        </div>
      </Container>

      {isHome ? null : (
        <Container className="pb-3 md:hidden">
          <HeaderSearch inputId="header-tool-search-mobile" />
        </Container>
      )}
    </header>
  );
}
