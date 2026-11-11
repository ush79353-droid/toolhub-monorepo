'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Layers,
  Wrench,
  Users,
  Image as ImageIcon,
  Search,
  FileText,
  BarChart3,
  Plug,
  Activity,
  Settings,
  Globe,
  LogOut,
  X,
  Shield,
  Loader2,
} from 'lucide-react';
import { logoutAdminAction } from '@/server/auth/actions';
import type { AdminUser } from '@/types';

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser?: AdminUser | null;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Tools', href: '/admin/tools', icon: Wrench, badge: '94' },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'SEO Management', href: '/admin/seo', icon: Search },
  { label: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Integrations', href: '/admin/integrations', icon: Plug },
  { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminMobileSidebar({ isOpen, onClose, adminUser }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

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
  }, [pathname, onClose]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logoutAdminAction();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex w-72 max-w-[80vw] flex-1 flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-accent block">
                MEGA TOOLS
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Management
          </div>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-secondary font-semibold text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn('h-4 w-4', active ? 'text-primary' : 'text-muted-foreground')}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-2">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 rounded-lg border border-border bg-background p-2 hover:border-primary/40 transition-colors"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 truncate">
              <div className="truncate text-xs font-semibold text-accent leading-none">
                {displayName}
              </div>
              <div className="text-[10px] text-muted-foreground truncate mt-0.5">{roleName}</div>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
