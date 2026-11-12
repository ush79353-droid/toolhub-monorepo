'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FormSection } from './FormSection';
import { siteConfig } from '@/config/site';
import {
  buildAutoResizeSnippet,
  buildEmbedUrl,
  buildIframeSnippet,
  EMBED_DEFAULT_HEIGHT,
  isToolEmbedEligible,
  normalizeEmbedHeight,
  type EmbedPreferredLayout,
} from '@/lib/embed/tool-embed';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { isApprovedComponentKey } from '@/tools/registry/keys';

export interface ToolEmbedFormState {
  embedEnabled: boolean;
  embedDefaultHeight: number;
  embedPreferredLayout: EmbedPreferredLayout;
  embedAllowedDomains: string;
}

interface ToolEmbedSectionProps {
  value: ToolEmbedFormState;
  onChange: (next: ToolEmbedFormState) => void;
  toolName: string;
  toolSlug: string;
  isActive: boolean;
  componentKey: string;
}

export function ToolEmbedSection({
  value,
  onChange,
  toolName,
  toolSlug,
  isActive,
  componentKey,
}: ToolEmbedSectionProps) {
  const [copied, setCopied] = React.useState<'iframe' | 'url' | 'auto' | null>(null);
  const siteOrigin = siteConfig.url;
  const embedUrl = toolSlug ? buildEmbedUrl(siteOrigin, toolSlug) : '';
  const height = normalizeEmbedHeight(value.embedDefaultHeight);
  const eligible = isToolEmbedEligible({
    ...value,
    isActive,
    componentKey,
  });
  const implemented = isApprovedComponentKey(componentKey);

  const patch = (partial: Partial<ToolEmbedFormState>) => onChange({ ...value, ...partial });

  const iframeCode = eligible
    ? buildIframeSnippet({
        embedUrl,
        title: `${toolName || 'Calculator'} - ${siteConfig.name}`,
        height,
      })
    : '';

  const autoCode = eligible
    ? buildAutoResizeSnippet({
        embedUrl,
        title: `${toolName || 'Calculator'} - ${siteConfig.name}`,
        height,
        siteOrigin,
      })
    : '';

  const copy = async (kind: 'iframe' | 'url' | 'auto', text: string) => {
    if (!text) return;
    const ok = await copyTextToClipboard(text);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <FormSection
      className="w-full"
      title="Embedding & Sharing"
      description="Allow this calculator on external sites via iframe. Disabled by default."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 px-4 py-3.5">
          <div>
            <p className="text-sm font-medium text-accent">Allow embedding</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {!implemented
                ? 'Requires an approved calculator component.'
                : !isActive
                  ? 'Tool must be active before embeds will render.'
                  : value.embedEnabled
                    ? 'External iframes can load this calculator.'
                    : 'Embeds show an unavailable message until enabled.'}
            </p>
          </div>
          <Switch
            checked={value.embedEnabled}
            onCheckedChange={(embedEnabled) => patch({ embedEnabled })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-accent">Default height (px)</label>
            <Input
              type="number"
              min={320}
              max={4000}
              value={value.embedDefaultHeight || EMBED_DEFAULT_HEIGHT}
              onChange={(event) =>
                patch({
                  embedDefaultHeight: normalizeEmbedHeight(
                    event.target.value === '' ? EMBED_DEFAULT_HEIGHT : Number(event.target.value)
                  ),
                })
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-accent">Preferred layout</label>
            <Select
              value={value.embedPreferredLayout || 'responsive'}
              onChange={(event) =>
                patch({
                  embedPreferredLayout: event.target.value as EmbedPreferredLayout,
                })
              }
            >
              <option value="responsive">Responsive</option>
              <option value="compact">Compact</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-accent">
            Allowed domains (optional)
          </label>
          <Input
            value={value.embedAllowedDomains}
            onChange={(event) => patch({ embedAllowedDomains: event.target.value })}
            placeholder="partner.com, docs.example.org"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Advisory host list for operators. Public iframe URLs remain reusable without signed
            authorization.
          </p>
        </div>

        {eligible ? (
          <>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-accent">Embed URL</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input readOnly value={embedUrl} className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => void copy('url', embedUrl)}
                >
                  {copied === 'url' ? 'Copied' : 'Copy URL'}
                </Button>
              </div>
              {siteOrigin.includes('localhost') ? (
                <p className="mt-1 text-xs text-amber-700">
                  Set NEXT_PUBLIC_SITE_URL to your production origin before publishing embed codes.
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-accent">Iframe code</label>
              <Textarea readOnly rows={8} value={iframeCode} className="font-mono text-xs" />
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => void copy('iframe', iframeCode)}
              >
                {copied === 'iframe' ? 'Copied' : 'Copy embed code'}
              </Button>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-accent">
                Optional auto-resize snippet
              </label>
              <Textarea readOnly rows={10} value={autoCode} className="font-mono text-xs" />
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => void copy('auto', autoCode)}
              >
                {copied === 'auto' ? 'Copied' : 'Copy auto-resize snippet'}
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-medium text-accent">
                Embed preview
              </div>
              <iframe
                title={`${toolName} embed preview`}
                src={embedUrl}
                width="100%"
                height={Math.min(height, 520)}
                className="w-full bg-[#F7F8F6]"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Embed code appears when the tool is active, has an approved component, and embedding is
            enabled.
          </p>
        )}
      </div>
    </FormSection>
  );
}
