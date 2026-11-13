'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ClipboardCheck,
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
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavLink[];
}

export const ADMIN_DASHBOARD: AdminNavLink = {
  label: 'Dashboard',
  href: '/admin',
  icon: LayoutDashboard,
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Catalog',
    items: [
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Tools', href: '/admin/tools', icon: Wrench },
      { label: 'Development audit', href: '/tools-audit', icon: ClipboardCheck },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'CMS Pages', href: '/admin/pages', icon: FileText },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'SEO', href: '/admin/seo', icon: Search },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users },
      { label: 'Integrations', href: '/admin/integrations', icon: Plug },
      { label: 'Activity Logs', href: '/admin/activity-logs', icon: Activity },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

function isRouteActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname.startsWith(href);
}

function NavLink({
  item,
  active,
  collapsed,
}: {
  item: AdminNavLink;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
        active ? 'bg-white/15 font-semibold text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                active ? 'bg-white text-brand-darkAccent' : 'bg-white/15 text-white'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

export function AdminNavMenu({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      ADMIN_NAV_GROUPS.map((group) => [
        group.label,
        group.items.some((item) => isRouteActive(pathname, item.href)),
      ])
    )
  );

  React.useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current };
      for (const group of ADMIN_NAV_GROUPS) {
        if (group.items.some((item) => isRouteActive(pathname, item.href))) {
          next[group.label] = true;
        }
      }
      return next;
    });
  }, [pathname]);

  return (
    <div className="space-y-1">
      <NavLink item={ADMIN_DASHBOARD} active={isRouteActive(pathname, ADMIN_DASHBOARD.href)} collapsed={collapsed} />

      {ADMIN_NAV_GROUPS.map((group) => {
        const open = openGroups[group.label];
        return (
          <div key={group.label} className="pt-2">
            {collapsed ? (
              <div className="my-2 border-t border-white/10" />
            ) : (
              <button
                type="button"
                onClick={() => setOpenGroups((current) => ({ ...current, [group.label]: !current[group.label] }))}
                className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white/45 transition-colors duration-200 hover:bg-white/5 hover:text-white"
                aria-expanded={open}
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-300 ease-out',
                    open && 'rotate-180'
                  )}
                />
              </button>
            )}
            {collapsed ? (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    active={isRouteActive(pathname, item.href)}
                    collapsed
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <div className="ml-2 space-y-0.5 border-l border-white/10 pl-1.5">
                    {group.items.map((item, index) => (
                      <div
                        key={item.href}
                        className={cn(
                          'transition-all duration-300 ease-out',
                          open ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                        )}
                        style={{ transitionDelay: open ? `${index * 40}ms` : '0ms' }}
                      >
                        <NavLink
                          item={item}
                          active={isRouteActive(pathname, item.href)}
                          collapsed={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
