'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { ParacetamolDosageForm } from './ParacetamolDosageForm';
import {
  createEmptyInput,
  createExampleInput,
  inputsEqual,
  type ParacetamolDosageFieldErrors,
  type ParacetamolDosageInput,
  type ParacetamolDosageResult,
} from './types';
import { validateParacetamolDosageInput } from './validation';

export function ParacetamolDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const [baseline, setBaseline] = React.useState<ParacetamolDosageInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<ParacetamolDosageInput>(
    () => initial,
  );
  const [errors, setErrors] = React.useState<ParacetamolDosageFieldErrors>({});
  const [result, setResult] = React.useState<ParacetamolDosageResult>(() =>
    validateParacetamolDosageInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: ParacetamolDosageInput) => {
    const validation = validateParacetamolDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateParacetamolDosageInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateParacetamolDosageInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  // Medical privacy: share/copy = public page URL only — never age/weight/dose.
  const summary = [
    metadata.title,
    '',
    'Educational pediatric paracetamol dose ceilings on Omega Calculators.',
    pageUrl,
  ].join('\n');

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'Paracetamol Dosage Calculator | Omega Calculators',
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
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
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Educational pediatric paracetamol mg/kg ceilings from age and weight.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ParacetamolDosageForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onLoadExample={() => apply(createExampleInput())}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
              disabled={!dirty}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'yes'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-border bg-white'
              }`}
              onClick={() => setFeedback('yes')}
              aria-pressed={feedback === 'yes'}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
              Yes
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
                feedback === 'no'
                  ? 'border-rose-300 bg-rose-50 text-rose-800'
                  : 'border-border bg-white'
              }`}
              onClick={() => setFeedback('no')}
              aria-pressed={feedback === 'no'}
            >
              <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
