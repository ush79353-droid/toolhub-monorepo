import * as React from 'react';
import { redirect } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { AdminProfileClient } from '@/components/admin/profile/AdminProfileClient';
import { getCurrentAdmin } from '@/server/auth/session';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Profile & Security"
        description="Manage your administrator identity, account name, and credential safeguards."
      />
      <AdminProfileClient initialAdmin={admin} />
    </div>
  );
}
