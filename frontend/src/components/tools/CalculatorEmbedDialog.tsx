'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { Code2, Copy, Link2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { siteConfig } from '@/config/site';
import {
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
  const [mounted, setMounted] = React.useState(false);
  const [height, setHeight] = React.useState(normalizeEmbedHeight(defaultHeight));
  const [copied, setCopied] = React.useState<'iframe' | 'url' | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const siteOrigin = siteConfig.url;
  const embedUrl = buildEmbedUrl(siteOrigin, toolSlug);
  const title = `${toolName} - ${siteConfig.name}`;
  const iframeCode = buildIframeSnippet({ embedUrl, title, height });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const copy = async (kind: 'iframe' | 'url', text: string) => {
    const ok = await copyTextToClipboard(text);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };

  React.useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const trigger = triggerRef.current;
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [open]);

  const dialog =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="embed-dialog-title"
              className="w-full max-w-lg rounded-2xl border border-border bg-white shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <h2 id="embed-dialog-title" className="text-base font-semibold text-accent">
                    Embed {toolName}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Copy the URL or iframe code to add this calculator to your site.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="Close embed dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5 px-5 py-5">
                <div>
                  <label htmlFor="embed-height" className="mb-1.5 block text-sm font-medium text-accent">
                    Height (px)
                  </label>
                  <Input
                    id="embed-height"
                    type="number"
                    min={320}
                    max={4000}
                    value={height}
                    onChange={(event) =>
                      setHeight(
                        normalizeEmbedHeight(Number(event.target.value) || EMBED_DEFAULT_HEIGHT)
                      )
                    }
                    className="h-11 max-w-[140px]"
                  />
                </div>

                <div>
                  <label htmlFor="embed-url" className="mb-1.5 block text-sm font-medium text-accent">
                    Embed URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="embed-url"
                      readOnly
                      value={embedUrl}
                      className="h-11 min-w-0 flex-1 font-mono text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 shrink-0 px-3"
                      onClick={() => void copy('url', embedUrl)}
                    >
                      <Link2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      {copied === 'url' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <div>
                  <label htmlFor="embed-iframe" className="mb-1.5 block text-sm font-medium text-accent">
                    Iframe code
                  </label>
                  <Textarea
                    id="embed-iframe"
                    readOnly
                    rows={6}
                    value={iframeCode}
                    className="resize-none font-mono text-xs leading-relaxed"
                  />
                  <Button
                    type="button"
                    className="mt-3 h-11 w-full bg-primary text-white hover:bg-[hsl(var(--primary-hover))] sm:w-auto"
                    onClick={() => void copy('iframe', iframeCode)}
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    {copied === 'iframe' ? 'Copied' : 'Copy iframe code'}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        size="sm"
        className="inline-flex h-9 items-center gap-1.5 border-border bg-white px-3 text-xs font-medium text-accent hover:border-primary hover:bg-secondary/60 hover:text-primary"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
        Embed
      </Button>
      {dialog}
    </>
  );
}
