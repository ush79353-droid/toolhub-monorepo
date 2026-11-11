'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { ToolForm } from '@/components/admin/forms/ToolForm';
import { listToolPlacementAction, type PlacementNode } from '@/server/tools/actions';
import { Loader2 } from 'lucide-react';

export default function AddToolPage() {
  const [placement, setPlacement] = React.useState<PlacementNode[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    listToolPlacementAction().then((result) => {
      if (!result.success || !result.data) setError(result.error || 'Failed to load categories.');
      else setPlacement(result.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add tool" description="Register the catalog record. The calculator itself stays in the codebase." />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading form
        </div>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : (
        <ToolForm mode="create" placement={placement} />
      )}
    </div>
  );
}
