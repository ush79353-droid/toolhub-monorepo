'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Grid, Wrench, Info, Mail } from 'lucide-react';
export function MobileNavigation({
  categories,
}: {
  categories: Array<{ id: string; name: string; slug: string; iconUrl: string }>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                <span>Home</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/tools"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-4 w-4 text-primary" />
                  <span>All Tools</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                href="/categories"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Grid className="h-4 w-4 text-primary" />
                  <span>Categories</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <div className="my-2 border-t border-border pt-4">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Popular Categories
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categories.slice(0, 7).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      onClick={closeMenu}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:bg-muted"
                    >
                      {cat.iconUrl ? <img src={cat.iconUrl} alt="" className="h-3.5 w-3.5 shrink-0" /> : null}
                      <span className="min-w-0">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="my-2 border-t border-border pt-4">
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Info className="h-4 w-4" />
                  <span>About Us</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact</span>
                </Link>
              </div>
            </nav>
          </div>

          <div className="border-t border-border bg-card p-6">
            <Link
              href="/tools"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-sm hover:bg-[hsl(var(--primary-hover))]"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
