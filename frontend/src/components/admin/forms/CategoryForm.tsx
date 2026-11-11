'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormSection } from './FormSection';
import { PendingNotice } from '../shared/PendingNotice';
import { ArrowLeft, Save } from 'lucide-react';
import type { AdminCategory } from '@/lib/admin-mock-data';

interface CategoryFormProps {
  initialData?: Partial<AdminCategory>;
  isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [slug, setSlug] = React.useState(initialData?.slug ?? '');
  const [description, setDescription] = React.useState(initialData?.description ?? '');
  const [icon, setIcon] = React.useState(initialData?.icon ?? 'Calculator');
  const [sortOrder, setSortOrder] = React.useState(initialData?.sortOrder ?? 1);
  const [status, setStatus] = React.useState<'active' | 'inactive'>(
    initialData?.status ?? 'active'
  );
  const [seoTitle, setSeoTitle] = React.useState(initialData?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = React.useState(initialData?.seoDescription ?? '');
  const [content, setContent] = React.useState(initialData?.content ?? '');

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPending, setShowPending] = React.useState(false);

  // Auto-generate slug when name changes if slug wasn't manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (
      !isEdit &&
      (!slug ||
        slug ===
          name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''))
    ) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Category name is required.';
    if (!slug.trim()) newErrors.slug = 'URL slug is required.';
    if (!description.trim()) newErrors.description = 'Category description is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowPending(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/categories')}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Categories</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/categories')}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isEdit ? 'Update Category' : 'Save Category'}</span>
          </Button>
        </div>
      </div>

      {showPending && (
        <PendingNotice
          message={`Category changes for '${name || 'New Category'}' validated successfully in frontend. Backend persistence to Express & MongoDB is scheduled for the next development phase.`}
          onDismiss={() => setShowPending(false)}
        />
      )}

      {/* General Information */}
      <FormSection
        title="Basic Category Details"
        description="Public display name, URL slug, and summary for tool classification."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Financial Calculators"
              className={errors.name ? 'border-rose-400' : ''}
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              URL Slug <span className="text-rose-500">*</span>
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. financial-calculators"
              className={errors.slug ? 'border-rose-400 font-mono text-xs' : 'font-mono text-xs'}
            />
            {errors.slug && <p className="text-[11px] text-rose-600 mt-1">{errors.slug}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">
            Short Description <span className="text-rose-500">*</span>
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description for category cards and metadata..."
            rows={2}
            className={errors.description ? 'border-rose-400' : ''}
          />
          {errors.description && (
            <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">Category Icon</label>
            <Select value={icon} onChange={(e) => setIcon(e.target.value)}>
              <option value="Calculator">Calculator</option>
              <option value="ArrowLeftRight">ArrowLeftRight (Converters)</option>
              <option value="FileText">FileText (PDF)</option>
              <option value="Image">Image</option>
              <option value="Code2">Code2 (Developer)</option>
              <option value="Search">Search (SEO)</option>
              <option value="Sparkles">Sparkles (AI)</option>
              <option value="Type">Type (Text)</option>
              <option value="ShieldCheck">ShieldCheck (Security)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Display Sort Order
            </label>
            <Input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">Status</label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            >
              <option value="active">Active (Visible)</option>
              <option value="inactive">Inactive (Hidden)</option>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* SEO Configuration */}
      <FormSection
        title="Search Engine Optimization (SEO)"
        description="Search title, meta tags, and SERP descriptions for this category page."
      >
        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">Meta Title</label>
          <Input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="e.g. Free Financial Calculators | Omega Calculators"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Recommended length: 50-60 characters. Current: {seoTitle.length} chars.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">Meta Description</label>
          <Textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Detailed meta description for Google search snippets..."
            rows={2}
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Recommended length: 140-160 characters. Current: {seoDescription.length} chars.
          </p>
        </div>
      </FormSection>

      {/* Category Extended Content */}
      <FormSection
        title="Long-Form Content & FAQ"
        description="Introductory editorial text displayed at the bottom of the public category page."
      >
        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">
            Category Guide / Editorial (Markdown)
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write explanatory notes, instructions, or FAQs about this group of tools..."
            rows={4}
          />
        </div>
      </FormSection>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/categories')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5"
        >
          <Save className="h-4 w-4" />
          <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
        </Button>
      </div>
    </form>
  );
}
