'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ToolForm } from '@/components/admin/forms/ToolForm';

export default function AddToolPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Register New Tool"
        description="Bind a verified developer component key, configure execution type, and author SEO content."
      />
      <ToolForm isEdit={false} />
    </div>
  );
}
