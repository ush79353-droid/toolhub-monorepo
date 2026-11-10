'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FormSection } from './FormSection';
import { PendingNotice } from '../shared/PendingNotice';
import { ArrowLeft, Save, Plus, Trash2, ShieldCheck, Info } from 'lucide-react';
import {
  SAFE_COMPONENT_KEYS,
  INITIAL_ADMIN_CATEGORIES,
  type AdminTool,
} from '@/lib/admin-mock-data';

interface ToolFormProps {
  initialData?: Partial<AdminTool>;
  isEdit?: boolean;
}

export function ToolForm({ initialData, isEdit = false }: ToolFormProps) {
  const router = useRouter();

  // Basic Details
  const [name, setName] = React.useState(initialData?.name ?? '');
  const [slug, setSlug] = React.useState(initialData?.slug ?? '');
  const [categorySlug, setCategorySlug] = React.useState(
    initialData?.categorySlug ?? INITIAL_ADMIN_CATEGORIES[0]?.slug ?? 'calculators'
  );
  const [shortDesc, setShortDesc] = React.useState(initialData?.shortDescription ?? '');
  const [fullDesc, setFullDesc] = React.useState(initialData?.fullDescription ?? '');
  const [toolIcon, setToolIcon] = React.useState(initialData?.toolIcon ?? 'Calculator');
  const [tagsInput, setTagsInput] = React.useState(initialData?.tags?.join(', ') ?? '');

  // Execution Configuration
  const [executionType, setExecutionType] = React.useState<'client' | 'server' | 'third-party'>(
    initialData?.executionType ?? 'client'
  );
  const [componentKey, setComponentKey] = React.useState(
    initialData?.componentKey ?? SAFE_COMPONENT_KEYS[0]?.key ?? 'AgeCalculator'
  );

  // SEO Settings
  const [seoTitle, setSeoTitle] = React.useState(initialData?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = React.useState(initialData?.seoDescription ?? '');
  const [canonicalUrl, setCanonicalUrl] = React.useState(initialData?.canonicalUrl ?? '');
  const [isIndexable, setIsIndexable] = React.useState(initialData?.isIndexable ?? true);
  const [ogTitle, setOgTitle] = React.useState(initialData?.ogTitle ?? '');
  const [ogDescription, setOgDescription] = React.useState(initialData?.ogDescription ?? '');

  // Content Blocks
  const [howToUse, setHowToUse] = React.useState<string[]>(
    initialData?.howToUse && initialData.howToUse.length > 0
      ? initialData.howToUse
      : ['Enter input values', 'Click the action button', 'Review and copy output']
  );
  const [features, setFeatures] = React.useState<string[]>(
    initialData?.features && initialData.features.length > 0
      ? initialData.features
      : ['100% Client-Side Privacy', 'Instant Calculation', 'Mobile Friendly']
  );
  const [faqs, setFaqs] = React.useState<{ question: string; answer: string }[]>(
    initialData?.faqs && initialData.faqs.length > 0
      ? initialData.faqs
      : [
          {
            question: 'Is this tool free to use?',
            answer: 'Yes, completely free with zero limits.',
          },
        ]
  );

  // Publishing
  const [status, setStatus] = React.useState<'published' | 'draft' | 'disabled'>(
    initialData?.status ?? 'published'
  );
  const [isFeatured, setIsFeatured] = React.useState(initialData?.isFeatured ?? false);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPending, setShowPending] = React.useState(false);
  const [submittedAction, setSubmittedAction] = React.useState<'publish' | 'draft' | 'save'>(
    'save'
  );

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

  const handleAddStep = () => setHowToUse([...howToUse, '']);
  const handleRemoveStep = (idx: number) => setHowToUse(howToUse.filter((_, i) => i !== idx));
  const handleStepChange = (idx: number, val: string) => {
    const updated = [...howToUse];
    updated[idx] = val;
    setHowToUse(updated);
  };

  const handleAddFeature = () => setFeatures([...features, '']);
  const handleRemoveFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));
  const handleFeatureChange = (idx: number, val: string) => {
    const updated = [...features];
    updated[idx] = val;
    setFeatures(updated);
  };

  const handleAddFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const handleRemoveFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));
  const handleFaqChange = (idx: number, field: 'question' | 'answer', val: string) => {
    const updated = [...faqs];
    updated[idx] = { ...updated[idx], [field]: val };
    setFaqs(updated);
  };

  const handleSave = (action: 'publish' | 'draft' | 'save') => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Tool name is required.';
    if (!slug.trim()) newErrors.slug = 'URL slug is required.';
    if (!shortDesc.trim()) newErrors.shortDesc = 'Short description is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmittedAction(action);
    setShowPending(true);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/tools')}
          className="inline-flex items-center gap-1.5 text-xs w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Tools Directory</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
            className="text-xs"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSave('publish')}
            className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isEdit ? 'Save Changes' : 'Publish Tool'}</span>
          </Button>
        </div>
      </div>

      {showPending && (
        <PendingNotice
          message={`Tool '${name || 'New Tool'}' validated (${submittedAction}). Backend persistence via Express API & MongoDB will be enabled in the upcoming API phase.`}
          onDismiss={() => setShowPending(false)}
        />
      )}

      {/* Section A — Basic Information */}
      <FormSection
        title="Section A — Basic Information"
        description="Public names, category assignment, icons, and searchable tags."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Tool Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Percentage Calculator"
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
              placeholder="e.g. percentage-calculator"
              className={errors.slug ? 'border-rose-400 font-mono text-xs' : 'font-mono text-xs'}
            />
            {errors.slug && <p className="text-[11px] text-rose-600 mt-1">{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">Category</label>
            <Select value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
              {INITIAL_ADMIN_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">Tool Icon</label>
            <Select value={toolIcon} onChange={(e) => setToolIcon(e.target.value)}>
              <option value="Calculator">Calculator</option>
              <option value="Percent">Percent</option>
              <option value="Activity">Activity (Health / BMI)</option>
              <option value="DollarSign">DollarSign (Finance / Loan)</option>
              <option value="Type">Type (Word / Text)</option>
              <option value="Code2">Code2 (JSON / Dev)</option>
              <option value="FileText">FileText (PDF)</option>
              <option value="Image">Image</option>
              <option value="Sparkles">Sparkles (AI)</option>
              <option value="QrCode">QrCode</option>
              <option value="Search">Search (SEO)</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">
            Short Description <span className="text-rose-500">*</span>
          </label>
          <Textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="One-sentence overview shown on tool cards and search snippets..."
            rows={2}
            className={errors.shortDesc ? 'border-rose-400' : ''}
          />
          {errors.shortDesc && <p className="text-[11px] text-rose-600 mt-1">{errors.shortDesc}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">Full Description</label>
          <Textarea
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            placeholder="Comprehensive description displayed in the hero section of the tool..."
            rows={3}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">
            Search Tags (Comma separated)
          </label>
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. math, percentage, discount, finance"
          />
        </div>
      </FormSection>

      {/* Section B — Execution Configuration */}
      <FormSection
        title="Section B — Execution Configuration"
        description="Select runtime engine and developer-registered component key."
        badge={
          <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
            <ShieldCheck className="h-3 w-3" />
            Zero Code Injection
          </span>
        }
      >
        <div className="rounded-lg border border-teal-200 bg-secondary/30 p-3 text-xs text-primary flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Security Boundary:</strong> Only developer-approved component keys registered in
            frontend source code may be bound. The admin system never accepts raw JavaScript,
            formulas, or arbitrary code upload.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Execution Architecture
            </label>
            <Select
              value={executionType}
              onChange={(e) =>
                setExecutionType(e.target.value as 'client' | 'server' | 'third-party')
              }
            >
              <option value="client">Client-Side (100% In-Browser)</option>
              <option value="server">Server Pipeline (Next.js Server API)</option>
              <option value="third-party">Third-Party Gateway (Proxied via Backend)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Bound Component Key
            </label>
            <Select value={componentKey} onChange={(e) => setComponentKey(e.target.value)}>
              {SAFE_COMPONENT_KEYS.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.key} ({item.name})
                </option>
              ))}
            </Select>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">
              Registered frontend component:{' '}
              <span className="text-primary font-semibold">{componentKey}</span>
            </p>
          </div>
        </div>
      </FormSection>

      {/* Section C — SEO Settings */}
      <FormSection
        title="Section C — SEO Settings"
        description="Search title, meta tags, indexing controls, and Open Graph card data."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">SEO Title</label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Free Percentage Calculator | Mega Tools"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Canonical URL (Optional)
            </label>
            <Input
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://megatools.io/tools/percentage-calculator"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-accent mb-1.5">Meta Description</label>
          <Textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Google SERP snippet description (140-160 characters recommended)..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Social OG Title
            </label>
            <Input
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              placeholder="Title for Facebook/LinkedIn/Twitter shares"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Social OG Description
            </label>
            <Input
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              placeholder="Snippet for social media card previews"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs font-semibold text-accent">Allow Search Engine Indexing</div>
            <div className="text-[11px] text-muted-foreground">
              Sets robots meta header to index, follow.
            </div>
          </div>
          <Switch checked={isIndexable} onCheckedChange={setIsIndexable} />
        </div>
      </FormSection>

      {/* Section D — Content */}
      <FormSection
        title="Section D — Content & User Guide"
        description="Instructional steps, feature highlights, and common FAQ questions."
      >
        {/* How to Use Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-accent">How to Use (Step-by-step)</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              className="h-7 px-2 text-[11px] inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add Step</span>
            </Button>
          </div>
          <div className="space-y-2">
            {howToUse.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <Input
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`Step ${idx + 1} instructions...`}
                  className="h-8 text-xs"
                />
                {howToUse.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-accent">Key Features</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFeature}
              className="h-7 px-2 text-[11px] inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add Feature</span>
            </Button>
          </div>
          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  placeholder="e.g. 100% In-Browser Privacy"
                  className="h-8 text-xs"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-accent">Frequently Asked Questions</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddFaq}
              className="h-7 px-2 text-[11px] inline-flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              <span>Add FAQ</span>
            </Button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-accent">FAQ #{idx + 1}</span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Input
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  placeholder="Question text..."
                  className="h-8 text-xs bg-white"
                />
                <Textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  placeholder="Answer text..."
                  rows={2}
                  className="text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      {/* Section E — Publishing */}
      <FormSection
        title="Section E — Publishing & Visibility"
        description="Release status, homepage promotion, and sorting."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-accent mb-1.5">
              Publication Status
            </label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft' | 'disabled')}
            >
              <option value="published">Published (Live to Public)</option>
              <option value="draft">Draft (Admin Preview Only)</option>
              <option value="disabled">Disabled (Hidden with 404)</option>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-5">
            <div>
              <div className="text-xs font-semibold text-accent">Feature on Homepage</div>
              <div className="text-[11px] text-muted-foreground">
                Promote in popular tools grid.
              </div>
            </div>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </div>
      </FormSection>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/tools')}
        >
          Cancel
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => handleSave('draft')}>
          Save Draft
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => handleSave('publish')}
          className="bg-primary text-white hover:bg-[hsl(var(--primary-hover))] inline-flex items-center gap-1.5"
        >
          <Save className="h-4 w-4" />
          <span>{isEdit ? 'Save Changes' : 'Publish Tool'}</span>
        </Button>
      </div>
    </div>
  );
}
