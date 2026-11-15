import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminDashboardShell } from '@/components/admin/layout/AdminDashboardShell';
import { ToolsAuditDashboard } from '@/components/admin/tools-audit/ToolsAuditDashboard';
import { getCurrentAdmin } from '@/server/auth/session';
import { getDevelopmentAuditAction } from '@/server/tools-audit/actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tools audit',
  robots: { index: false, follow: false },
};

export default async function ToolsAuditPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login?redirect=/tools-audit');

  const saved = await getDevelopmentAuditAction();

  return (
    <AdminDashboardShell adminUser={admin}>
      <ToolsAuditDashboard initial={saved.success ? (saved.data ?? null) : null} loadError={saved.success ? null : (saved.error ?? 'Failed to load the saved audit.')} />
    </AdminDashboardShell>
  );
}
