'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ToolForm } from '@/components/admin/forms/ToolForm';
import { INITIAL_ADMIN_TOOLS } from '@/lib/admin-mock-data';

interface EditToolPageProps {
  params: Promise<{ id: string }>;
}

export default function EditToolPage({ params }: EditToolPageProps) {
  const unwrappedParams = React.use(params);
  const tool =
    INITIAL_ADMIN_TOOLS.find((t) => t.id === unwrappedParams.id) ?? INITIAL_ADMIN_TOOLS[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Tool: ${tool.name}`}
        description={`Update execution parameters, bound component key (${tool.componentKey}), and publication status.`}
      />
      <ToolForm initialData={tool} isEdit={true} />
    </div>
  );
}
