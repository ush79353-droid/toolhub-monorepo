'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Globe, LogOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { logoutAdminAction } from '@/server/auth/actions';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { AdminNavMenu } from './admin-nav';
import type { AdminUser } from '@/types';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  adminUser?: AdminUser | null;
}

export function AdminSidebar({ isCollapsed, onToggleCollapse, adminUser }: AdminSidebarProps) {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

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
  const roleName = adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin';

  return (
    <aside
      className={cn(
        'sticky top-0 z-30 hidden h-screen select-none flex-col bg-brand-darkAccent text-white transition-all duration-300 ease-in-out md:flex',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-3">
        <Link href="/admin" className="flex min-w-0 items-center gap-2 overflow-hidden">
          <img
            src="/images/logo/icon-without-bg.png"
            alt="Omega Calculators"
            className="h-9 w-9 shrink-0 object-contain"
          />
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold leading-tight text-white">
              Omega Calculators
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="cursor-pointer rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="admin-scroll flex-1 overflow-y-auto px-3 py-4">
        <AdminNavMenu collapsed={isCollapsed} />
      </div>

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? 'View Website' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <Globe className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="truncate">View Website</span>}
        </Link>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={isLoggingOut}
          title={isCollapsed ? 'Sign Out' : undefined}
          className={cn(
            'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-200 transition-colors hover:bg-rose-500/20 hover:text-white',
            isCollapsed && 'justify-center px-2'
          )}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="truncate">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          )}
        </button>

        <Link
          href="/admin/profile"
          className={cn(
            'mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10',
            isCollapsed && 'justify-center p-1.5'
          )}
          title={isCollapsed ? `${displayName} (${roleName})` : undefined}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-darkAccent">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="truncate text-xs font-semibold leading-none text-white">{displayName}</div>
              <div className="mt-0.5 truncate text-[10px] text-white/60">{roleName}</div>
            </div>
          )}
        </Link>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSignOut}
        title="Sign out?"
        description="You will need to sign in again to open the admin console."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
      />
    </aside>
  );
}
