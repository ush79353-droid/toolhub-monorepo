'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NmToJoulesResultsProps {
  forceLine: string | null;
  energyLine: string | null;
  workLine: string | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function NmToJoulesResults({
  forceLine,
  energyLine,
  workLine,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: NmToJoulesResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const hasAny = forceLine || energyLine || workLine;

  if (!hasAny) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a value in either conversion section. 1 N = 1 J/m and 1 J = 1 N·m for work.
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
          Conversion summary
        </p>
        <ul className="mt-2 space-y-1 font-mono text-sm tabular-nums text-accent">
          {forceLine ? <li>{forceLine}</li> : null}
          {energyLine ? <li>{energyLine}</li> : null}
          {workLine ? <li>{workLine}</li> : null}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          1 N = 1 J/m · 1 J = 1 N·m (work/energy) · torque ≠ energy
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
