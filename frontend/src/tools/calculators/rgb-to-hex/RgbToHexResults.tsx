'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatRgbCss } from './calculation';
import type { ConversionDirection, RGB } from './types';

interface RgbToHexResultsProps {
  rgb: RGB | null;
  hex: string | null;
  direction: ConversionDirection;
  shared: boolean;
  canShare: boolean;
  onShare: () => void;
}

function isLight(rgb: RGB): boolean {
  const y = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return y > 0.85;
}

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      className="h-9 shrink-0"
      aria-label={`Copy ${label}`}
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
  );
}

export function RgbToHexResults({
  rgb,
  hex,
  direction,
  shared,
  canShare,
  onShare,
}: RgbToHexResultsProps) {
  if (!rgb || !hex) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid {direction === 'rgb-to-hex' ? 'RGB channels (0–255)' : 'HEX color code'} to
        convert.
      </p>
    );
  }

  const rgbCss = formatRgbCss(rgb);
  const border = isLight(rgb) ? 'border-border' : 'border-transparent';
  const primaryLabel = direction === 'rgb-to-hex' ? 'HEX' : 'RGB';
  const primaryValue = direction === 'rgb-to-hex' ? hex : rgbCss;

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {primaryLabel}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 break-all font-mono text-lg font-semibold tabular-nums text-accent">
            {primaryValue}
          </p>
          <CopyButton label={primaryLabel} value={primaryValue} />
        </div>
        {direction === 'hex-to-rgb' ? (
          <ul className="mt-3 grid grid-cols-3 gap-2 font-mono text-sm tabular-nums text-accent">
            <li>R {rgb.r}</li>
            <li>G {rgb.g}</li>
            <li>B {rgb.b}</li>
          </ul>
        ) : (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{rgbCss}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-accent">Color preview</p>
        <div
          className={`h-28 w-full rounded-xl border ${border}`}
          style={{ backgroundColor: hex }}
        />
        <p className="font-mono text-xs text-muted-foreground">
          Selected color · HEX: {hex} · {rgbCss}
        </p>
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
