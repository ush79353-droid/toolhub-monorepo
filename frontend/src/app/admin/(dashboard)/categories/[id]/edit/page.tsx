'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CategoryForm } from '@/components/admin/forms/CategoryForm';
import { INITIAL_ADMIN_CATEGORIES } from '@/lib/admin-mock-data';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const unwrappedParams = React.use(params);
  const category =
    INITIAL_ADMIN_CATEGORIES.find((c) => c.id === unwrappedParams.id) ??
    INITIAL_ADMIN_CATEGORIES[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Edit Category: ${category.name}`}
        description={`Update metadata, URL slug, and presentation settings for category ID: ${unwrappedParams.id}.`}
      />
      <CategoryForm initialData={category} isEdit={true} />
    </div>
  );
}
