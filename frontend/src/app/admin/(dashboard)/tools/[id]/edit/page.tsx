'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ToolForm } from '@/components/admin/forms/ToolForm';
import { getToolAction, listToolPlacementAction, type PlacementNode, type ToolRecord } from '@/server/tools/actions';
import { Loader2 } from 'lucide-react';

export default function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [tool, setTool] = React.useState<ToolRecord | null>(null);
  const [placement, setPlacement] = React.useState<PlacementNode[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getToolAction(id), listToolPlacementAction()]).then(([item, nodes]) => {
      if (!item.success || !item.data) setError(item.error || 'Tool not found.');
      else setTool(item.data);
      if (nodes.success && nodes.data) setPlacement(nodes.data);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={tool ? `Edit ${tool.name}` : 'Edit tool'}
        description="Update the catalog record. The calculator implementation stays in the codebase."
      />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading tool
        </div>
      ) : error || !tool ? (
        <p className="text-sm text-rose-600">{error || 'Tool not found.'}</p>
      ) : (
        <ToolForm mode="edit" tool={tool} placement={placement} />
      )}
    </div>
  );
}
