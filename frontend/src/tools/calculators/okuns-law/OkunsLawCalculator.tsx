'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { OkunsLawForm } from './OkunsLawForm';
import { OkunsLawResults } from './OkunsLawResults';
import {
  createDefaultInput,
  createEmptyInput,
  createExampleInput,
  type OkunsLawFieldErrors,
  type OkunsLawInput,
  type OkunsLawResult,
} from './types';
import { validateOkunsLawInput } from './validation';

function inputsEqual(a: OkunsLawInput, b: OkunsLawInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function OkunsLawCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<OkunsLawInput>(() => defaults);
  const [input, setInput] = React.useState<OkunsLawInput>(() => defaults);
  const [errors, setErrors] = React.useState<OkunsLawFieldErrors>({});
  const [result, setResult] = React.useState<OkunsLawResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: OkunsLawInput) => {
    const validation = validateOkunsLawInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput(createEmptyInput(input.mode));
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result
    ? [
        "Okun's Law Calculator — Omega Calculators",
        '',
        `Calculation Mode: ${result.modeLabel}`,
        '',
        result.formattedUnemploymentRate !== '—'
          ? `Unemployment Rate: ${result.formattedUnemploymentRate}`
          : null,
        result.formattedNaturalRate !== '—'
          ? `Natural Unemployment Rate: ${result.formattedNaturalRate}`
          : null,
        result.formattedOutputGapCoeff !== '—'
          ? `Okun Coefficient (β): ${result.formattedOutputGapCoeff}`
          : null,
        result.formattedUnemploymentGap !== '—'
          ? `Unemployment Gap: ${result.formattedUnemploymentGap}`
          : null,
        result.formattedOutputGap !== '—'
          ? `Estimated Output Gap: ${result.formattedOutputGap}`
          : null,
        result.formattedActualGrowth !== '—'
          ? `Actual GDP Growth: ${result.formattedActualGrowth}`
          : null,
        result.formattedTrendGrowth !== '—'
          ? `Trend GDP Growth: ${result.formattedTrendGrowth}`
          : null,
        result.formattedGrowthCoeff !== '—'
          ? `Okun Coefficient (α): ${result.formattedGrowthCoeff}`
          : null,
        result.formattedGrowthGap !== '—'
          ? `GDP Growth Gap: ${result.formattedGrowthGap}`
          : null,
        result.formattedUnemploymentChange !== '—'
          ? `Change in Unemployment: ${result.formattedUnemploymentChange}`
          : null,
        result.formattedRequiredGrowth !== '—'
          ? `Required GDP Growth: ${result.formattedRequiredGrowth}`
          : null,
        '',
        'Interpretation:',
        result.interpretation,
        '',
        typeof window !== 'undefined'
          ? window.location.href
          : `/tools/${metadata.slug}`,
      ]
        .filter(Boolean)
        .join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({ title: metadata.title, text: summary });
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
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Unemployment, output gaps, and GDP growth (Okun).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <OkunsLawForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onLoadExample={() => apply(createExampleInput(input.mode))}
        />
        <OkunsLawResults result={result} />

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
              disabled={!dirty && !result}
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
    </section>
  );
}
