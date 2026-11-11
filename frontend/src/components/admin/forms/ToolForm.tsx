'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FormSection } from './FormSection';
import { ArrowLeft, ImageIcon, Loader2, Save, X } from 'lucide-react';
import { listMediaAction, type MediaAsset } from '@/server/media/actions';
import { saveToolAction, type PlacementNode, type ToolRecord } from '@/server/tools/actions';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface ToolFormProps {
  mode: 'create' | 'edit';
  tool?: ToolRecord;
  placement: PlacementNode[];
}

export function ToolForm({ mode, tool, placement }: ToolFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [name, setName] = React.useState(tool?.name ?? '');
  const [slug, setSlug] = React.useState(tool?.slug ?? '');
  const [categoryId, setCategoryId] = React.useState(tool?.category?.id ?? '');
  const [pillarId, setPillarId] = React.useState(tool?.pillar?.id ?? '');
  const [subPillarId, setSubPillarId] = React.useState(tool?.subPillar?.id ?? '');
  const [iconMediaId, setIconMediaId] = React.useState(tool?.iconMediaId ?? '');
  const [iconUrl, setIconUrl] = React.useState(tool?.iconUrl ?? '');
  const [shortDescription, setShortDescription] = React.useState(tool?.shortDescription ?? '');
  const [metaTitle, setMetaTitle] = React.useState(tool?.metaTitle ?? '');
  const [metaDescription, setMetaDescription] = React.useState(tool?.metaDescription ?? '');
  const [canonicalUrl, setCanonicalUrl] = React.useState(tool?.canonicalUrl ?? '');
  const [ogTitle, setOgTitle] = React.useState(tool?.ogTitle ?? '');
  const [ogDescription, setOgDescription] = React.useState(tool?.ogDescription ?? '');
  const [keywords, setKeywords] = React.useState(tool?.keywords ?? '');
  const [indexable, setIndexable] = React.useState(tool?.indexable ?? true);
  const [isActive, setIsActive] = React.useState(tool?.isActive ?? true);
  const [isFeatured, setIsFeatured] = React.useState(tool?.isFeatured ?? false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [images, setImages] = React.useState<MediaAsset[]>([]);
  const [imageSearch, setImageSearch] = React.useState('');
  const [imagesLoading, setImagesLoading] = React.useState(false);

  const categories = placement.filter((item) => item.kind === 'category');
  const pillars = placement.filter((item) => item.kind === 'pillar' && item.parentId === categoryId);
  const subPillars = placement.filter((item) => item.kind === 'sub_pillar' && item.parentId === pillarId);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEdit && slug === slugify(name)) setSlug(slugify(value));
  };

  const loadImages = React.useCallback(async (search: string) => {
    setImagesLoading(true);
    const result = await listMediaAction({ page: 1, limit: 48, search, type: 'image' });
    setImages(result.success && result.data ? result.data.items : []);
    setImagesLoading(false);
  }, []);

  React.useEffect(() => {
    if (!pickerOpen) return;
    const timer = window.setTimeout(() => void loadImages(imageSearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [pickerOpen, imageSearch, loadImages]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Tool name is required.';
    if (!slugify(slug)) nextErrors.slug = 'Use lowercase letters, numbers, and hyphens.';
    if (!categoryId) nextErrors.categoryId = 'Choose a category.';
    if (!pillarId) nextErrors.pillarId = 'Choose a pillar.';
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setFormError(null);
    setSaving(true);
    const result = await saveToolAction(tool?.id ?? null, {
      name: name.trim(),
      slug: slugify(slug),
      categoryId,
      pillarId,
      subPillarId: subPillarId || null,
      iconMediaId: iconMediaId || null,
      shortDescription: shortDescription.trim(),
      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),
      canonicalUrl: canonicalUrl.trim(),
      ogTitle: ogTitle.trim(),
      ogDescription: ogDescription.trim(),
      keywords: keywords.trim(),
      indexable,
      isActive,
      isFeatured,
    });
    setSaving(false);
    if (!result.success) {
      setFormError(result.error || 'Failed to save the tool.');
      return;
    }
    router.push('/admin/tools');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 pb-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/tools')}
          className="inline-flex w-fit items-center gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to tools
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={saving}
          className="inline-flex items-center gap-1.5 bg-primary text-xs text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          {isEdit ? 'Save changes' : 'Create tool'}
        </Button>
      </div>

      {formError && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p>
      )}

      <FormSection className="w-full" title="Tool details" description="The public name and the address used in the URL. Both must be unique.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              Tool name <span className="text-rose-500">*</span>
            </label>
            <Input value={name} onChange={(event) => handleNameChange(event.target.value)} placeholder="Percentage Calculator" className={errors.name ? 'border-rose-400' : ''} />
            {errors.name && <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              URL slug <span className="text-rose-500">*</span>
            </label>
            <Input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="percentage-calculator" className={`font-mono text-xs ${errors.slug ? 'border-rose-400' : ''}`} />
            {errors.slug && <p className="mt-1 text-[11px] text-rose-600">{errors.slug}</p>}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-accent">Short description</label>
          <Textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} rows={2} maxLength={500} placeholder="One sentence for cards and listings" />
        </div>
      </FormSection>

      <FormSection className="w-full" title="Placement" description="A tool sits under a category and a pillar. A sub-pillar is optional.">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              Category <span className="text-rose-500">*</span>
            </label>
            <Select
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPillarId('');
                setSubPillarId('');
              }}
              className={errors.categoryId ? 'border-rose-400' : ''}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
            {errors.categoryId && <p className="mt-1 text-[11px] text-rose-600">{errors.categoryId}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">
              Pillar <span className="text-rose-500">*</span>
            </label>
            <Select
              value={pillarId}
              disabled={!categoryId}
              onChange={(event) => {
                setPillarId(event.target.value);
                setSubPillarId('');
              }}
              className={errors.pillarId ? 'border-rose-400' : ''}
            >
              <option value="">Select pillar</option>
              {pillars.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
            {errors.pillarId && <p className="mt-1 text-[11px] text-rose-600">{errors.pillarId}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Sub-pillar</label>
            <Select value={subPillarId} disabled={!pillarId} onChange={(event) => setSubPillarId(event.target.value)}>
              <option value="">None</option>
              {subPillars.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection className="w-full" title="Icon" description="Optional image from the media library. This is not a built-in icon.">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/40">
            {iconUrl ? <img src={iconUrl} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              Choose image
            </Button>
            {iconMediaId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIconMediaId('');
                  setIconUrl('');
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection className="w-full" title="SEO" description="Search and social tags. Leave a field blank to fall back to the tool name later.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Meta title</label>
            <Input value={metaTitle} maxLength={70} onChange={(event) => setMetaTitle(event.target.value)} placeholder="Free Percentage Calculator" />
            <p className="mt-1 text-[10px] text-muted-foreground">{metaTitle.length}/70</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Canonical URL</label>
            <Input value={canonicalUrl} onChange={(event) => setCanonicalUrl(event.target.value)} placeholder="https://example.com/tools/percentage-calculator" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-accent">Meta description</label>
          <Textarea value={metaDescription} maxLength={160} rows={2} onChange={(event) => setMetaDescription(event.target.value)} placeholder="Search result snippet" />
          <p className="mt-1 text-[10px] text-muted-foreground">{metaDescription.length}/160</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-accent">Keywords</label>
          <Input value={keywords} maxLength={200} onChange={(event) => setKeywords(event.target.value)} placeholder="percentage, discount, calculator" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Social title</label>
            <Input value={ogTitle} maxLength={70} onChange={(event) => setOgTitle(event.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-accent">Social description</label>
            <Input value={ogDescription} maxLength={200} onChange={(event) => setOgDescription(event.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-accent">Search indexing</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {indexable ? 'Search engines may index this tool.' : 'Search engines are asked not to index this tool.'}
            </p>
          </div>
          <Switch checked={indexable} onCheckedChange={setIndexable} />
        </div>
      </FormSection>

      <FormSection className="w-full" title="Visibility" description="Active tools can be listed. Featured tools can be promoted on the homepage.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-accent">Status</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{isActive ? 'Active' : 'Inactive'}</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-accent">Featured</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{isFeatured ? 'Shown in featured spots' : 'Not featured'}</p>
            </div>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </div>
      </FormSection>

      {pickerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" onClick={() => setPickerOpen(false)}>
          <div className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-accent">Choose an icon image</h3>
              <button type="button" onClick={() => setPickerOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="border-b border-border p-4">
              <Input value={imageSearch} onChange={(event) => setImageSearch(event.target.value)} placeholder="Search images" />
            </div>
            <div className="overflow-y-auto p-4">
              {imagesLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading images
                </div>
              ) : images.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No images in the media library yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => {
                        setIconMediaId(image.id);
                        setIconUrl(image.url);
                        setPickerOpen(false);
                      }}
                      className={`overflow-hidden rounded-lg border bg-muted/30 ${iconMediaId === image.id ? 'border-primary' : 'border-border'}`}
                      title={image.fileName}
                    >
                      <img src={image.url} alt={image.altText || image.fileName} className="h-20 w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
