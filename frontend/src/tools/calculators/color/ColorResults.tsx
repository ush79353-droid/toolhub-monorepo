'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { CanonicalColor, ColorFormats } from './types';
import { cssPreview } from './calculation';

interface ColorResultsProps {
  color: CanonicalColor | null;
  formats: ColorFormats | null;
  shared: boolean;
  canShare: boolean;
  onShare: () => void;
}

type FormatStringKey =
  | 'hex'
  | 'hexAlpha'
  | 'rgb'
  | 'rgba'
  | 'hsl'
  | 'hsla'
  | 'hsv'
  | 'cmyk';

const RESULT_ROWS: readonly { key: FormatStringKey; label: string; note?: string }[] = [
  { key: 'hex', label: 'HEX' },
  { key: 'hexAlpha', label: 'HEX + alpha' },
  { key: 'rgb', label: 'RGB' },
  { key: 'rgba', label: 'RGBA' },
  { key: 'hsl', label: 'HSL' },
  { key: 'hsla', label: 'HSLA' },
  { key: 'hsv', label: 'HSV', note: 'Not standard CSS syntax' },
  { key: 'cmyk', label: 'CMYK', note: 'Approximate; not standard CSS' },
];

function isLight(color: CanonicalColor): boolean {
  // Relative luminance approximation
  const y = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
  return y > 0.85 && color.a > 0.5;
}

function CopyRow({ label, value, note }: { label: string; value: string; note?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border/70 py-2.5 first:border-t-0 first:pt-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-all font-mono text-sm tabular-nums text-accent">{value}</p>
        {note ? <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p> : null}
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-9 shrink-0"
        aria-label={`Copy ${label} value`}
        onClick={() => {
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
  );
}

export function ColorResults({
  color,
  formats,
  shared,
  canShare,
  onShare,
}: ColorResultsProps) {
  if (!color || !formats) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid color in the selected encoding to see conversions and a live preview.
      </p>
    );
  }

  const preview = cssPreview(color);
  const border = isLight(color) ? 'border-border' : 'border-transparent';

  return (
    <div className="space-y-4">
      <div className="space-y-2" aria-live="polite">
        <p className="text-[13px] font-medium text-accent">Color preview</p>
        <div
          className={`relative h-28 w-full overflow-hidden rounded-xl border ${border}`}
          style={{
            backgroundImage:
              'linear-gradient(45deg, #d4d4d4 25%, transparent 25%), linear-gradient(-45deg, #d4d4d4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d4d4d4 75%), linear-gradient(-45deg, transparent 75%, #d4d4d4 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: preview }} />
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          Selected color: {formats.hex}
          {color.a < 1 ? ` · alpha ${color.a}` : ''} · {formats.rgb}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-3 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Converted formats
        </p>
        <div className="mt-2">
          {RESULT_ROWS.map((row) => (
            <CopyRow
              key={row.key}
              label={row.label}
              value={formats[row.key]}
              note={row.note}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>
    </div>
  );
}
