'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LogOut, X, Loader2 } from 'lucide-react';
import { logoutAdminAction } from '@/server/auth/actions';
import { ConfirmDialog } from '@/components/admin/shared/ConfirmDialog';
import { AdminNavMenu } from './admin-nav';
import type { AdminUser } from '@/types';

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser?: AdminUser | null;
}

export function AdminMobileSidebar({ isOpen, onClose, adminUser }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const displayName = adminUser?.name || 'Administrator';
  const roleName = adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin';
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'A';

  React.useEffect(() => {
    onClose();
    // Close the drawer after a route change. onClose is recreated by the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logoutAdminAction();
  };

  return (
    <>
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex animate-in bg-black/50 backdrop-blur-xs fade-in duration-200 md:hidden"
      onClick={onClose}
    >
      <div
        className="relative flex w-72 max-w-[80vw] flex-1 flex-col bg-brand-darkAccent text-white shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-2">
            <img
              src="/images/logo/icon-without-bg.png"
              alt="Omega Calculators"
              className="h-9 w-9 object-contain"
            />
            <span className="truncate text-sm font-semibold text-white">Omega Calculators</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="admin-scroll flex-1 overflow-y-auto p-4">
          <AdminNavMenu />
        </div>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-darkAccent">
              {initials}
            </div>
            <div className="flex-1 truncate">
              <div className="truncate text-xs font-semibold leading-none text-white">{displayName}</div>
              <div className="mt-0.5 truncate text-[10px] text-white/60">{roleName}</div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Globe className="h-4 w-4" />
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={isLoggingOut}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-200 hover:bg-rose-500/20 hover:text-white"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
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
    </>
  );
}
