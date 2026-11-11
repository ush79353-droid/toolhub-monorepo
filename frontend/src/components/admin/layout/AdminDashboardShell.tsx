'use client';

import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminMobileSidebar } from './AdminMobileSidebar';
import type { AdminUser } from '@/types';

interface AdminDashboardShellProps {
  adminUser?: AdminUser | null;
  children: React.ReactNode;
}

export function AdminDashboardShell({ adminUser, children }: AdminDashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        adminUser={adminUser}
      />

      {/* Mobile Drawer */}
      <AdminMobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        adminUser={adminUser}
      />

      {/* Main Administrative Content Canvas */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onToggleMobileSidebar={() => setIsMobileOpen(true)} adminUser={adminUser} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
