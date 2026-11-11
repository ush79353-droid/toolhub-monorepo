import * as React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/server/auth/session';
import { AdminDashboardShell } from '@/components/admin/layout/AdminDashboardShell';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect('/admin/login');
  }

  return <AdminDashboardShell adminUser={currentAdmin}>{children}</AdminDashboardShell>;
}
