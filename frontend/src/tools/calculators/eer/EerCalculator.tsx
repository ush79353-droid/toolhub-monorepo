'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { EerCalculatorForm } from './EerCalculatorForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type EerCalculatorFieldErrors,
  type EerCalculatorInput,
  type EerCalculatorResult,
} from './types';
import { validateEerCalculatorInput } from './validation';

export function EerCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<EerCalculatorFieldErrors>({});
  const [result, setResult] = React.useState<EerCalculatorResult | null>(() =>
    validateEerCalculatorInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const apply = (next: EerCalculatorInput) => {
    const v = validateEerCalculatorInput(next);
    setInput(next);
    setErrors(v.errors);
    setResult(v.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateEerCalculatorInput(fresh).result);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateEerCalculatorInput(fresh).result);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const summary = [
    metadata.title,
    '',
    'Educational adult EER estimate (IOM DRI 2002/2005).',
    'Entered body metrics are not included in this share.',
    '',
    'Omega Calculators',
    pageUrl,
  ].join('\n');

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary, url: pageUrl });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through to clipboard
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs text-muted-foreground">
            Estimate adult daily energy requirement from IOM DRI equations.
          </p>
        </div>
        {headerActions}
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <EerCalculatorForm input={input} errors={errors} result={result} onChange={apply} />
        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared' : copied ? 'Copied!' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl text-xs"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl text-xs"
              disabled={!dirty}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white'
              }`}
            >
              <ThumbsUp className="h-3 w-3" /> Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white'
              }`}
            >
              <ThumbsDown className="h-3 w-3" /> No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
