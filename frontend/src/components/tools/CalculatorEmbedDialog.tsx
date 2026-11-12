'use client';

import * as React from 'react';
import { Code2, Copy, Link2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '@/config/site';
import {
  buildAutoResizeSnippet,
  buildEmbedUrl,
  buildIframeSnippet,
  EMBED_DEFAULT_HEIGHT,
  normalizeEmbedHeight,
} from '@/lib/embed/tool-embed';
import { copyTextToClipboard } from '@/tools/shared/clipboard';

export interface CalculatorEmbedDialogProps {
  toolName: string;
  toolSlug: string;
  defaultHeight?: number;
}

export function CalculatorEmbedDialog({
  toolName,
  toolSlug,
  defaultHeight = EMBED_DEFAULT_HEIGHT,
}: CalculatorEmbedDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [height, setHeight] = React.useState(normalizeEmbedHeight(defaultHeight));
  const [copied, setCopied] = React.useState<'iframe' | 'url' | 'auto' | null>(null);

  const siteOrigin = siteConfig.url;
  const embedUrl = buildEmbedUrl(siteOrigin, toolSlug);
  const title = `${toolName} - ${siteConfig.name}`;
  const iframeCode = buildIframeSnippet({ embedUrl, title, height });
  const autoCode = buildAutoResizeSnippet({ embedUrl, title, height, siteOrigin });

  const copy = async (kind: 'iframe' | 'url' | 'auto', text: string) => {
    const ok = await copyTextToClipboard(text);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="inline-flex h-9 items-center gap-1.5 border-border bg-white px-3 text-xs font-medium text-accent hover:border-primary hover:bg-secondary/60 hover:text-primary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
        Embed
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="embed-dialog-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 id="embed-dialog-title" className="text-sm font-semibold text-accent">
                  Embed {toolName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Copy the iframe snippet onto your site. Auto-resize script is optional.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
                aria-label="Close embed dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-accent">Height (px)</label>
                <Input
                  type="number"
                  min={320}
                  max={4000}
                  value={height}
                  onChange={(event) =>
                    setHeight(normalizeEmbedHeight(Number(event.target.value) || EMBED_DEFAULT_HEIGHT))
                  }
                  className="max-w-[160px]"
                />
              </div>

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
                    <Link2 className="mr-1.5 h-3.5 w-3.5" />
                    {copied === 'url' ? 'Copied' : 'Copy URL'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-accent">Iframe code</label>
                <Textarea readOnly rows={7} value={iframeCode} className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => void copy('iframe', iframeCode)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copied === 'iframe' ? 'Copied' : 'Copy iframe'}
                </Button>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-accent">
                  Optional auto-resize
                </label>
                <Textarea readOnly rows={8} value={autoCode} className="font-mono text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => void copy('auto', autoCode)}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  {copied === 'auto' ? 'Copied' : 'Copy with resize script'}
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs text-accent">
                  Preview
                </div>
                <iframe
                  title={`${toolName} embed preview`}
                  src={embedUrl}
                  width="100%"
                  height={Math.min(height, 420)}
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
                <li>Paste the iframe HTML into your page.</li>
                <li>Optionally include the auto-resize script for dynamic height.</li>
                <li>Width is 100% — the calculator adapts down to ~320px.</li>
              </ol>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
