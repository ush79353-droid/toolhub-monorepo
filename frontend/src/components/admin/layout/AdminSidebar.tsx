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
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
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

export function AdminSidebar({ isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border bg-white transition-all duration-300 ease-in-out z-30 sticky top-0 h-screen select-none',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <Shield className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-extrabold text-sm tracking-tight text-accent block">
                MEGA TOOLS
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
                Admin Console
              </span>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div
          className={cn(
            'px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground',
            isCollapsed && 'sr-only'
          )}
        >
          Management
        </div>

        {NAV_ITEMS.map((item) => {
          const active = isRouteActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150',
                active
                  ? 'bg-secondary font-semibold text-primary shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? 'View Public Website' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
          {!isCollapsed && <span className="truncate">View Website</span>}
        </Link>

        <Link
          href="/admin/login"
          title={isCollapsed ? 'Sign Out' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Sign Out</span>}
        </Link>

        {/* Profile Card */}
        <Link
          href="/admin/profile"
          className={cn(
            'mt-2 flex items-center gap-3 rounded-lg border border-border bg-background p-2 hover:border-primary/40 transition-colors',
            isCollapsed && 'justify-center p-1.5'
          )}
          title={isCollapsed ? 'Bilal Ahmad (Super Admin)' : undefined}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            BA
          </div>
          {!isCollapsed && (
            <div className="flex-1 truncate">
              <div className="truncate text-xs font-semibold text-accent leading-none">
                Bilal Ahmad
              </div>
              <div className="text-[10px] text-muted-foreground truncate mt-0.5">Super Admin</div>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
