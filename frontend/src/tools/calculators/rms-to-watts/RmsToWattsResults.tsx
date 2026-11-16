'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AdvancedResult } from './calculation';
import { formatWatts } from './calculation';

interface WaveformResultsProps {
  rms: number | null;
  peak: number | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function WaveformResults({
  rms,
  peak,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: WaveformResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (rms == null || peak == null) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter RMS watts or peak watts for a sinusoidal power waveform. Conversion uses P_peak =
        P_RMS × √2 under that assumption only.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Waveform conversion
        </p>
        <p className="mt-2 font-mono text-sm tabular-nums text-accent">
          RMS: <span className="font-semibold">{formatWatts(rms)} W</span>
        </p>
        <p className="mt-1 font-mono text-sm tabular-nums text-accent">
          Peak: <span className="font-semibold">{formatWatts(peak)} W</span>
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Sinusoidal power waveform: P_peak = P_RMS × √2. Not a universal amplifier rating
          conversion.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFeedback('yes')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'yes'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => setFeedback('no')}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
              feedback === 'no'
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-white text-muted-foreground hover:text-foreground'
            }`}
          >
            <ThumbsDown className="h-3 w-3" />
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdvancedResultsProps {
  result: AdvancedResult | null;
}

export function AdvancedResults({ result }: AdvancedResultsProps) {
  if (!result) {
    return (
      <p className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
        Enter the required fields for this mode to see electrical power results.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-brand-softTeal/30 px-3.5 py-3" aria-live="polite">
      <ul className="space-y-1 font-mono text-sm tabular-nums text-accent">
        {result.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {result.assumptions.map((a) => (
        <p key={a} className="mt-2 text-xs text-muted-foreground">
          {a}
        </p>
      ))}
    </div>
  );
}
