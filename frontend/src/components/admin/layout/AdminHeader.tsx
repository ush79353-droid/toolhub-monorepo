'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, Globe, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { AdminSearchDialog } from '../shared/AdminSearchDialog';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
}

export function AdminHeader({ onToggleMobileSidebar }: AdminHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
        {/* Left Side: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Open mobile navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <AdminBreadcrumbs />
        </div>

        {/* Right Side: Search, Notifications, Site Link, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search admin...</span>
            <kbd className="hidden md:inline-block rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* View Website External Link */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs h-8 text-primary border-teal-200 hover:bg-secondary"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Globe className="h-3.5 w-3.5" />
              <span>Live Site</span>
            </Link>
          </Button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsUserMenuOpen(false);
              }}
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-border pb-2 px-1">
                  <span className="text-xs font-bold text-accent">System Alerts (Demo)</span>
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    2 New
                  </span>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-lg bg-background p-2.5 text-xs">
                    <div className="font-semibold text-accent">Component Registered</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      New calculator engine &lsquo;LoanCalculator&rsquo; verified in frontend code.
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">10m ago</div>
                  </div>
                  <div className="rounded-lg bg-background p-2.5 text-xs">
                    <div className="font-semibold text-accent">S3 Storage Health</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Temporary file buffer purged 142 expired assets successfully.
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 mt-1">1h ago</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-primary transition-all"
              aria-label="User profile menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs">
                BA
              </div>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-xs font-semibold text-accent leading-none">Bilal Ahmad</p>
                  <p className="mt-1 text-[11px] text-muted-foreground truncate">
                    bilal@megatools.io
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-foreground hover:bg-secondary hover:text-primary transition-colors"
                  >
                    <SettingsIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>System Settings</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <Link
                    href="/admin/login"
                    className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <AdminSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
