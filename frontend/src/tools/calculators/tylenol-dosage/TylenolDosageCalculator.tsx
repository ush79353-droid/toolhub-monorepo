'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { TylenolDosageForm } from './TylenolDosageForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type TylenolDosageFieldErrors,
  type TylenolDosageInput,
  type TylenolDosageResult,
} from './types';
import { validateTylenolDosageInput } from './validation';

export function TylenolDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState<TylenolDosageInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<TylenolDosageInput>(() => initial);
  const [errors, setErrors] = React.useState<TylenolDosageFieldErrors>({});
  const [result, setResult] = React.useState<TylenolDosageResult | null>(
    () => validateTylenolDosageInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: TylenolDosageInput) => {
    const validation = validateTylenolDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateTylenolDosageInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    const validation = validateTylenolDosageInput(empty);
    setInput(empty);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  // Medical privacy: share public page URL only.
  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        'Educational TYLENOL Drug Facts lookup ready.',
        result.disclaimer,
        '',
        `Calculator: ${typeof window !== 'undefined' ? `${window.location.origin}/tools/${metadata.slug}` : `/tools/${metadata.slug}`}`,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: summary,
          url:
            typeof window !== 'undefined'
              ? `${window.location.origin}/tools/${metadata.slug}`
              : undefined,
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
            TYLENOL® adult OTC label dose lookup (12+).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TylenolDosageForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
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
              <ThumbsUp className="h-3.5 w-3.5" />
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
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
