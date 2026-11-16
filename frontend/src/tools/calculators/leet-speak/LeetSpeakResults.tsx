'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { TranslationDirection } from './types';

interface LeetSpeakResultsProps {
  output: string;
  hasInput: boolean;
  direction: TranslationDirection;
  shared: boolean;
  canShare: boolean;
  onShare: () => void;
}

export function LeetSpeakResults({
  output,
  hasInput,
  direction,
  shared,
  canShare,
  onShare,
}: LeetSpeakResultsProps) {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (!hasInput) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter text above to see the leet-speak translation. Reverse mode is approximate.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="leet-speak-output" className="mb-1.5 block text-[13px] font-medium text-accent">
          Translation
        </label>
        <div className="rounded-lg border border-border bg-brand-softTeal/40 focus-within:ring-2 focus-within:ring-ring">
          <textarea
            id="leet-speak-output"
            rows={5}
            readOnly
            className="min-h-[120px] w-full resize-y break-words bg-transparent px-3 py-2.5 font-mono text-sm leading-relaxed text-accent outline-none"
            value={output}
            aria-live="polite"
          />
        </div>
        {direction === 'leet-to-text' ? (
          <p className="text-xs text-amber-800" role="status">
            Approximate reverse mapping: digit 1 becomes I (not L). Unknown symbols stay as-is.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10"
          disabled={output.length === 0}
          onClick={() => {
            if (!output) return;
            void copyTextToClipboard(output).then((ok) => {
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            });
          }}
        >
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy translation'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          disabled={!canShare && output.length === 0}
          onClick={onShare}
        >
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
