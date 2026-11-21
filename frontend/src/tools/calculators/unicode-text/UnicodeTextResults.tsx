'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { UNICODE_STYLES, type UnicodeConversionResult, type UnicodeStyle } from './types';

interface UnicodeTextResultsProps {
  results: UnicodeConversionResult | null;
  hasInput: boolean;
  shared: boolean;
  canShare: boolean;
  onShare: () => void;
}

function StyleRow({
  style,
  label,
  note,
  value,
}: {
  style: UnicodeStyle;
  label: string;
  note?: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);
  const empty = value.length === 0;

  return (
    <div className="border-t border-border/70 py-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p
            className="mt-1 break-words font-mono text-base leading-relaxed text-accent"
            aria-live="polite"
            data-style={style}
          >
            {empty ? '—' : value}
          </p>
          {note ? <p className="mt-1 text-[11px] text-muted-foreground">{note}</p> : null}
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 shrink-0"
          disabled={empty}
          aria-label={`Copy ${label} text`}
          onClick={() => {
            if (empty) return;
            void copyTextToClipboard(value).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            });
          }}
        >
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}

export function UnicodeTextResults({
  results,
  hasInput,
  shared,
  canShare,
  onShare,
}: UnicodeTextResultsProps) {
  if (!hasInput || !results) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Type text above to generate circled, squared, inverted, and monospaced Unicode styles.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-3 sm:px-5">
        {UNICODE_STYLES.map((meta) => (
          <StyleRow
            key={meta.id}
            style={meta.id}
            label={meta.label}
            note={meta.note}
            value={results[meta.id]}
          />
        ))}
      </div>

      <p className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Some Unicode characters may not display correctly on every device, browser, application, or
 font. Decorative Unicode text is not a font change, it substitutes different characters,
        which can affect search, accessibility, and platform filtering. Keep a plain-text original
        for important content.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>
    </div>
  );
}
