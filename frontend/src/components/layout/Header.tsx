import * as React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { MobileNavigation } from './MobileNavigation';
import { Wrench, Search, ChevronDown, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/sample-data';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md transition-shadow">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-accent">
              MEGA<span className="text-primary">TOOLS</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase -mt-1">
              Online Utilities
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/tools"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            All Tools
          </Link>

          {/* Categories Dropdown Container */}
          <div className="group relative">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <span>Categories</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </Link>

            {/* Dropdown Menu */}
            <div className="invisible absolute left-0 top-full z-50 w-80 translate-y-2 rounded-xl border border-border bg-white p-3 shadow-lg opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="mb-2 px-2 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tool Categories
                </p>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="flex flex-col rounded-lg p-2 text-xs transition-colors hover:bg-muted"
                  >
                    <span className="font-semibold text-foreground">{cat.name}</span>
                    <span className="text-[11px] text-muted-foreground">{cat.toolCount} tools</span>
                  </Link>
                ))}
              </div>
              <div className="mt-2 border-t border-border pt-2 text-center">
                <Link
                  href="/categories"
                  className="inline-flex items-center justify-center text-xs font-bold text-primary hover:underline"
                >
                  View All 12 Categories →
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA & Search */}
        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            aria-label="Search tools"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </Link>

          <Link
            href="/tools"
            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[hsl(var(--primary-hover))] sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" />
            <span>Explore Tools</span>
          </Link>

          {/* Mobile Navigation Trigger */}
          <MobileNavigation />
        </div>
      </Container>
    </header>
  );
}
