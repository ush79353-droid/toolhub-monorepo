'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { PeptideForm } from './PeptideForm';
import {
  createEmptyInput,
  inputsEqual,
  type PeptideFieldErrors,
  type PeptideInput,
  type PeptideResult,
} from './types';
import { validatePeptideInput } from './validation';

export function PeptideCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const initialValidation = validatePeptideInput(initial);
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState(initial);
  const [errors, setErrors] = React.useState<PeptideFieldErrors>(initialValidation.errors);
  const [result, setResult] = React.useState<PeptideResult | null>(initialValidation.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PeptideInput) => {
    const validation = validatePeptideInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const reload = () => {
    const fresh = createEmptyInput();
    const v = validatePeptideInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(v.errors);
    setResult(v.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;
  const summary = ['Peptide Calculator', '', pageUrl, '', 'Omega Calculators'].join('\n');

  const handleCopy = async () => {
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, url: pageUrl });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        /* noop */
      }
    }
    await handleCopy();
  };

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <h2 className="text-[15px] font-semibold text-accent">Syringe calculation</h2>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PeptideForm input={input} errors={errors} result={result} onChange={apply} />

        <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-xs font-semibold text-accent"
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-xs font-semibold text-accent"
          >
            <Share2 className="h-4 w-4 text-rose-500" />
            {shared ? 'Shared' : 'Share result'}
          </button>
          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="h-10 w-full rounded-xl text-xs" onClick={reload}>
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-xl text-xs"
              disabled={inputsEqual(input, baseline)}
              onClick={reload}
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
                feedback === 'yes' ? 'border-primary bg-primary text-white' : 'border-border bg-white'
              }`}
            >
              <ThumbsUp className="h-3 w-3" /> Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'no' ? 'border-primary bg-primary text-white' : 'border-border bg-white'
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
