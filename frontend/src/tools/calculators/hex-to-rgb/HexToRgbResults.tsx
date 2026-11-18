'use client';

import { useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { formatRgbCss, formatRgbTuple } from './calculation';
import type { ConversionDirection, RGB } from './types';

interface HexToRgbResultsProps {
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

export function HexToRgbResults({
  rgb,
  hex,
  direction,
  shared,
  canShare,
  onShare,
}: HexToRgbResultsProps) {
  if (!rgb || !hex) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid {direction === 'hex-to-rgb' ? 'HEX color code' : 'RGB channels (0–255)'} to
        convert.
      </p>
    );
  }

  const rgbCss = formatRgbCss(rgb);
  const rgbTuple = formatRgbTuple(rgb);
  const border = isLight(rgb) ? 'border-border' : 'border-transparent';
  const primaryLabel = direction === 'hex-to-rgb' ? '(R, G, B)' : 'HEX';
  const primaryValue = direction === 'hex-to-rgb' ? rgbTuple : hex;
  const copyValue = direction === 'hex-to-rgb' ? rgbCss : hex;

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
          <CopyButton label={primaryLabel} value={copyValue} />
        </div>
        {direction === 'hex-to-rgb' ? (
          <p className="mt-2 font-mono text-xs text-muted-foreground">{hex}</p>
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
