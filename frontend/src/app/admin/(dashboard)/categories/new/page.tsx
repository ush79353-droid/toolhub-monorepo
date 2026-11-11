'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CategoryForm } from '@/components/admin/forms/CategoryForm';
import { listCategoryOptionsAction, type CategoryOption } from '@/server/categories/actions';
import { Loader2 } from 'lucide-react';

export default function AddCategoryPage() {
  const [parents, setParents] = React.useState<CategoryOption[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    listCategoryOptionsAction().then((result) => {
      if (!result.success || !result.data) setError(result.error || 'Failed to load parents.');
      else setParents(result.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add category"
        description="Create a category, a pillar inside a category, or a sub-pillar inside a pillar."
      />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading form
        </div>
      ) : error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : (
        <CategoryForm mode="create" parents={parents} />
      )}
    </div>
  );
}
