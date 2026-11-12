'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { FormSection } from './FormSection';
import { ImageIcon } from 'lucide-react';
import type { ToolSeoFields } from '@/lib/seo/tool-seo';
import { buildToolPath, normalizeSiteOrigin } from '@/lib/seo/tool-seo';
import { siteConfig } from '@/config/site';

export type ToolSeoFormState = ToolSeoFields;

interface ToolSeoSectionProps {
  value: ToolSeoFormState;
  onChange: (next: ToolSeoFormState) => void;
  toolName: string;
  toolSlug: string;
  shortDescription: string;
  onPickImage: (target: 'og' | 'twitter') => void;
}

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <label className="block text-xs font-medium text-accent">{children}</label>
      {hint ? <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  return (
    <p className="mt-1 text-[10px] text-muted-foreground">
      {value.length}/{max}
      {value.length > 0 && value.length < Math.floor(max * 0.4) ? ' · short' : ''}
      {value.length > max ? ' · over recommended' : ''}
    </p>
  );
}

export function ToolSeoSection({
  value,
  onChange,
  toolName,
  toolSlug,
  shortDescription,
  onPickImage,
}: ToolSeoSectionProps) {
  const patch = (partial: Partial<ToolSeoFormState>) => onChange({ ...value, ...partial });
  const siteOrigin = normalizeSiteOrigin(siteConfig.url) || siteConfig.url;
  const previewTitle = value.metaTitle.trim() || `${toolName || 'Tool name'} | ${siteConfig.name}`;
  const previewDescription =
    value.metaDescription.trim() ||
    shortDescription.trim() ||
    'Meta description fallback appears here when left blank.';
  const previewUrl = `${siteOrigin}${buildToolPath(toolSlug || 'tool-slug')}`;
  const ogTitle = value.ogTitle.trim() || value.metaTitle.trim() || toolName || 'Social title';
  const ogDescription =
    value.ogDescription.trim() || value.metaDescription.trim() || shortDescription || 'Social description';
  const ogImage = value.ogImageUrl.trim() || siteConfig.defaultOgImage;

  return (
    <FormSection
      className="w-full"
      title="SEO"
      description="All fields are optional. Blank values use safe public fallbacks on the tool page."
    >
      <div className="space-y-4">
        <details open className="rounded-xl border border-border bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-accent">
            Basic SEO
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel hint="Recommended under ~60 characters.">Meta title</FieldLabel>
                <Input
                  value={value.metaTitle}
                  maxLength={70}
                  onChange={(event) => patch({ metaTitle: event.target.value })}
                  placeholder={`${toolName || 'Tool'} | ${siteConfig.name}`}
                />
                <Counter value={value.metaTitle} max={70} />
              </div>
              <div>
                <FieldLabel hint="Leave blank to auto-generate from the public site URL.">
                  Canonical URL
                </FieldLabel>
                <Input
                  value={value.canonicalUrl}
                  onChange={(event) => patch({ canonicalUrl: event.target.value })}
                  placeholder={previewUrl}
                />
              </div>
            </div>
            <div>
              <FieldLabel hint="Recommended under ~155 characters.">Meta description</FieldLabel>
              <Textarea
                value={value.metaDescription}
                maxLength={160}
                rows={3}
                onChange={(event) => patch({ metaDescription: event.target.value })}
                placeholder="Search result snippet"
              />
              <Counter value={value.metaDescription} max={160} />
            </div>
            <div>
              <FieldLabel hint="Compatibility only — not a Google ranking factor.">Meta keywords</FieldLabel>
              <Input
                value={value.keywords}
                maxLength={200}
                onChange={(event) => patch({ keywords: event.target.value })}
                placeholder="loan, amortization, payment"
              />
            </div>
          </div>
        </details>

        <details open className="rounded-xl border border-border bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-accent">
            Open Graph
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>OG title</FieldLabel>
                <Input value={value.ogTitle} maxLength={70} onChange={(event) => patch({ ogTitle: event.target.value })} />
              </div>
              <div>
                <FieldLabel>OG type</FieldLabel>
                <Input value={value.ogType} maxLength={40} onChange={(event) => patch({ ogType: event.target.value })} placeholder="website" />
              </div>
            </div>
            <div>
              <FieldLabel>OG description</FieldLabel>
              <Textarea
                value={value.ogDescription}
                maxLength={200}
                rows={2}
                onChange={(event) => patch({ ogDescription: event.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>OG site name</FieldLabel>
                <Input value={value.ogSiteName} maxLength={80} onChange={(event) => patch({ ogSiteName: event.target.value })} placeholder={siteConfig.name} />
              </div>
              <div>
                <FieldLabel>OG image alt</FieldLabel>
                <Input value={value.ogImageAlt} maxLength={200} onChange={(event) => patch({ ogImageAlt: event.target.value })} />
              </div>
            </div>
            <ImagePickerRow
              label="OG image"
              url={value.ogImageUrl}
              onClear={() => patch({ ogImageUrl: '' })}
              onPick={() => onPickImage('og')}
              onUrlChange={(ogImageUrl) => patch({ ogImageUrl })}
            />
          </div>
        </details>

        <details className="rounded-xl border border-border bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-accent">
            Twitter / X
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Card type</FieldLabel>
                <Select
                  value={value.twitterCard}
                  onChange={(event) =>
                    patch({ twitterCard: event.target.value as ToolSeoFormState['twitterCard'] })
                  }
                >
                  <option value="">Auto</option>
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                </Select>
              </div>
              <div>
                <FieldLabel>Site handle</FieldLabel>
                <Input value={value.twitterSite} maxLength={40} onChange={(event) => patch({ twitterSite: event.target.value })} placeholder="@omegacalculators" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Twitter title</FieldLabel>
                <Input value={value.twitterTitle} maxLength={70} onChange={(event) => patch({ twitterTitle: event.target.value })} />
              </div>
              <div>
                <FieldLabel>Twitter image alt</FieldLabel>
                <Input value={value.twitterImageAlt} maxLength={200} onChange={(event) => patch({ twitterImageAlt: event.target.value })} />
              </div>
            </div>
            <div>
              <FieldLabel>Twitter description</FieldLabel>
              <Textarea
                value={value.twitterDescription}
                maxLength={200}
                rows={2}
                onChange={(event) => patch({ twitterDescription: event.target.value })}
              />
            </div>
            <ImagePickerRow
              label="Twitter image"
              url={value.twitterImageUrl}
              onClear={() => patch({ twitterImageUrl: '' })}
              onPick={() => onPickImage('twitter')}
              onUrlChange={(twitterImageUrl) => patch({ twitterImageUrl })}
            />
          </div>
        </details>

        <details className="rounded-xl border border-border bg-white">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-accent">
            Structured Data
          </summary>
          <div className="space-y-4 border-t border-border px-4 py-4">
            <div>
              <FieldLabel hint="Generated from typed fields and visible page content only.">
                Schema type
              </FieldLabel>
              <Select
                value={value.schemaType}
                onChange={(event) =>
                  patch({ schemaType: event.target.value as ToolSeoFormState['schemaType'] })
                }
              >
                <option value="">Auto (WebApplication when implemented)</option>
                <option value="WebPage">WebPage</option>
                <option value="WebApplication">WebApplication</option>
              </Select>
            </div>
            <ToggleRow
              title="Include FAQPage schema"
              description="Only when FAQs are genuinely visible on the public page."
              checked={value.includeFaqSchema}
              onCheckedChange={(includeFaqSchema) => patch({ includeFaqSchema })}
            />
          </div>
        </details>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-xs font-medium text-accent">Search preview</p>
            <p className="mt-3 text-lg text-[#1a0dab]">{previewTitle}</p>
            <p className="mt-1 text-xs text-emerald-700">{previewUrl}</p>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{previewDescription}</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-accent">
              Social preview
            </div>
            <div className="aspect-[1.91/1] bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ogImage} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="space-y-1 p-3">
              <p className="text-sm font-medium text-accent">{ogTitle}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{ogDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-accent">{title}</p>
        <p className="mt-0.5 text-xs font-normal text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function ImagePickerRow({
  label,
  url,
  onPick,
  onClear,
  onUrlChange,
}: {
  label: string;
  url: string;
  onPick: () => void;
  onClear: () => void;
  onUrlChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <Input value={url} onChange={(event) => onUrlChange(event.target.value)} placeholder="https://..." />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onPick}>
              Choose from media library
            </Button>
            {url ? (
              <Button type="button" variant="outline" size="sm" onClick={onClear}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
