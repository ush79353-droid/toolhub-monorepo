'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CategoryForm } from '@/components/admin/forms/CategoryForm';
import {
  getCategoryAction,
  listCategoryOptionsAction,
  type CategoryNode,
  type CategoryOption,
} from '@/server/categories/actions';
import { Loader2 } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [category, setCategory] = React.useState<CategoryNode | null>(null);
  const [parents, setParents] = React.useState<CategoryOption[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([getCategoryAction(id), listCategoryOptionsAction()]).then(([item, options]) => {
      if (!item.success || !item.data) setError(item.error || 'Category not found.');
      else setCategory(item.data);
      if (options.success && options.data) setParents(options.data);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={category ? `Edit ${category.name}` : 'Edit category'}
        description="Update the name, slug, description, order, and status."
      />
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading category
        </div>
      ) : error || !category ? (
        <p className="text-sm text-rose-600">{error || 'Category not found.'}</p>
      ) : (
        <CategoryForm mode="edit" category={category} parents={parents} />
      )}
    </div>
  );
}
