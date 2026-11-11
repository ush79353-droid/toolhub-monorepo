'use client';

import * as React from 'react';
import { AdminPageHeader } from '@/components/admin/layout/AdminPageHeader';
import { CategoryForm } from '@/components/admin/forms/CategoryForm';

export default function AddCategoryPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Add New Category"
        description="Create a new classification category for organizing tools on the platform."
      />
      <CategoryForm isEdit={false} />
    </div>
  );
}
