'use client';

import * as React from 'react';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminMobileSidebar } from '@/components/admin/layout/AdminMobileSidebar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Collapsible Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Mobile Drawer */}
      <AdminMobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Main Administrative Content Canvas */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onToggleMobileSidebar={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
