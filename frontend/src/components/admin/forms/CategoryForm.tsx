'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormSection } from './FormSection';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, type CategoryKind, type CategoryNode, type CategoryOption } from '@/server/categories/actions';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CategoryFormProps {
  mode: 'create' | 'edit';
  category?: CategoryNode;
  parents: CategoryOption[];
}

export function CategoryForm({ mode, category, parents }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [name, setName] = React.useState(category?.name ?? '');
  const [slug, setSlug] = React.useState(category?.slug ?? '');
  const [description, setDescription] = React.useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = React.useState(category?.sortOrder ?? 0);
  const [isActive, setIsActive] = React.useState(category?.isActive ?? true);
  const [kind, setKind] = React.useState<CategoryKind>(category?.kind ?? 'category');
  const [parentId, setParentId] = React.useState(category?.parentId ?? '');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const parentKind: CategoryKind | null = kind === 'pillar' ? 'category' : kind === 'sub_pillar' ? 'pillar' : null;
  const parentOptions = parents.filter((item) => item.kind === parentKind);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit && slug === slugify(name)) setSlug(slugify(value));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Name is required.';
    if (!slug.trim()) nextErrors.slug = 'URL slug is required.';
    if (!isEdit && parentKind && !parentId) nextErrors.parentId = 'Choose a parent.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    setFormError(null);
    const result = isEdit
      ? await updateCategoryAction(category!.id, {
          name: name.trim(),
          slug: slug.trim(),
          description,
          sortOrder,
          isActive,
        })
      : await createCategoryAction({
          name: name.trim(),
          slug: slug.trim(),
          kind,
          parentId: parentKind ? parentId : null,
          description,
          sortOrder,
          isActive,
        });
    setSaving(false);

    if (!result.success) {
      setFormError(result.error || 'Could not save.');
      return;
    }
    router.push('/admin/categories');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/categories')}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Categories
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-primary text-xs text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isEdit ? 'Update' : 'Save'}
        </Button>
      </div>

      {formError && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {formError}
        </p>
      )}

      <FormSection className="w-full" title="Basic details" description="The public name and the address used in the URL.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="e.g. Finance & Business"
              className={errors.name ? 'border-rose-400' : ''}
            />
            {errors.name && <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              URL slug <span className="text-rose-500">*</span>
            </label>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="finance-business"
              className={`font-mono text-xs ${errors.slug ? 'border-rose-400' : ''}`}
            />
            {errors.slug && <p className="mt-1 text-[11px] text-rose-600">{errors.slug}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-accent">Description</label>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short summary shown with this category"
            rows={3}
          />
        </div>

      </FormSection>

      <FormSection
        className="w-full"
        title="Placement and visibility"
        description="Choose the level in the tree, the display order, and whether it is published."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Type</label>
            <Select
              value={kind}
              disabled={isEdit}
              onChange={(event) => {
                setKind(event.target.value as CategoryKind);
                setParentId('');
              }}
            >
              <option value="category">Category</option>
              <option value="pillar">Pillar</option>
              <option value="sub_pillar">Sub-pillar</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Parent</label>
            {parentKind ? (
              <Select
                value={parentId}
                disabled={isEdit}
                onChange={(event) => setParentId(event.target.value)}
                className={errors.parentId ? 'border-rose-400' : ''}
              >
                <option value="">Select {parentKind === 'category' ? 'category' : 'pillar'}</option>
                {parentOptions.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Input value="Top level — no parent" disabled />
            )}
            {errors.parentId && <p className="mt-1 text-[11px] text-rose-600">{errors.parentId}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Sort order</label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(event) => setSortOrder(Number(event.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-accent">Status</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isActive ? 'Active. This item is visible in the directory.' : 'Inactive. This item stays hidden.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
      </FormSection>
    </form>
  );
}
