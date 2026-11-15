'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const ROUTE_NAME_MAP: Record<string, string> = {
  admin: 'Admin',
  categories: 'Categories',
  tools: 'Tools',
  'tools-audit': 'Tools audit',
  users: 'Users',
  media: 'Media Library',
  seo: 'SEO Management',
  pages: 'CMS Pages',
  analytics: 'Analytics',
  integrations: 'Integrations',
  'activity-logs': 'Activity Logs',
  profile: 'Profile',
  settings: 'Settings',
  new: 'Create New',
  edit: 'Edit Record',
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  let currentPath = '';

  return (
    <nav
      aria-label="Admin Breadcrumbs"
      className="hidden lg:flex items-center text-xs text-white/60"
    >
      {segments.map((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        const displayName = ROUTE_NAME_MAP[segment] ?? segment;

        return (
          <React.Fragment key={currentPath}>
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 mx-1.5 text-white/40" />}
            {isLast ? (
              <span className="font-semibold text-white capitalize">{displayName}</span>
            ) : (
              <Link href={currentPath} className="hover:text-white transition-colors capitalize">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
