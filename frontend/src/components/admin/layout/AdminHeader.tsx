'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  User,
  LogOut,
  Settings as SettingsIcon,
  Loader2,
} from 'lucide-react';
import { AdminBreadcrumbs } from './AdminBreadcrumbs';
import { logoutAdminAction } from '@/server/auth/actions';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import type { AdminUser } from '@/types';

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  adminUser?: AdminUser | null;
}

export function AdminHeader({ onToggleMobileSidebar, adminUser }: AdminHeaderProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isUserMenuOpen) return;

    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsUserMenuOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logoutAdminAction();
  };

  const initials = adminUser?.name
    ? adminUser.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'BA';

  const displayName = adminUser?.name || 'Administrator';
  const displayEmail = adminUser?.email || 'admin@megatools.io';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/10 bg-brand-darkAccent px-4 text-white sm:px-6">
        {/* Left Side: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="cursor-pointer rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Open mobile navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <AdminBreadcrumbs />
        </div>

        {/* Right Side: Search, Notifications, Site Link, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* User Avatar & Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-white/10"
              aria-label="User profile menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-darkAccent">
                {initials}
              </div>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[160px] truncate text-xs font-semibold leading-none">
                  {displayName}
                </span>
                <span className="mt-0.5 block max-w-[160px] truncate text-[11px] font-normal text-white/65">
                  {displayEmail}
                </span>
              </span>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-white py-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-xs font-semibold text-accent leading-none truncate">
                    {displayName}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground truncate">{displayEmail}</p>
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
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setConfirmOpen(true);
                    }}
                    disabled={isLoggingOut}
                    className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-left text-xs text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogOut className="h-3.5 w-3.5" />
                    )}
                    <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Sign out?"
        description="You will need to sign in again to open the admin console."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
      />

    </>
  );
}
