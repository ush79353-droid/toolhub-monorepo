'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { BodyFatForm } from './BodyFatForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type BodyFatFieldErrors,
  type BodyFatInput,
  type BodyFatResult,
} from './types';
import { validateBodyFatInput } from './validation';

export function BodyFatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<BodyFatInput>(() => defaults);
  const [input, setInput] = React.useState<BodyFatInput>(() => defaults);
  const [errors, setErrors] = React.useState<BodyFatFieldErrors>({});
  const [result, setResult] = React.useState<BodyFatResult | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const recompute = (next: BodyFatInput) => {
    const hasAny =
      next.age.trim() !== '' ||
      next.height.trim() !== '' ||
      next.weight.trim() !== '' ||
      next.neck.trim() !== '' ||
      next.waist.trim() !== '' ||
      next.hip.trim() !== '';
    if (!hasAny) {
      setErrors({});
      setResult(null);
      return;
    }
    const validation = validateBodyFatInput(next);
    // Show field errors only when the user has filled the core trio (or navy tapes).
    const coreReady =
      next.age.trim() !== '' &&
      next.height.trim() !== '' &&
      next.weight.trim() !== '';
    setErrors(coreReady ? validation.errors : {});
    setResult(validation.isValid ? validation.result : null);
  };

  const handleChange = (next: BodyFatInput) => {
    setInput(next);
    recompute(next);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(null);
    setDetailsOpen(false);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput();
    setInput(empty);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  // Privacy: share URL + aggregate results only — never raw measurements.
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Estimated body fat: ${result.formattedBodyFatPercent}%`,
        `Fat mass: ${result.formattedFatMassKg} kg`,
        `BMI: ${result.formattedBmi} kg/m²`,
        `Lean mass: ${result.formattedLeanMassKg} kg`,
        `Method: ${result.methodLabel}`,
        result.disclaimer,
        '',
        `Calculator: ${pageUrl}`,
      ].join('\n')
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
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Estimate body fat % with ADA (CUN-BAE), U.S. Navy, or BMI methods.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BodyFatForm
          input={input}
          errors={errors}
          result={result}
          detailsOpen={detailsOpen}
          onDetailsOpenChange={setDetailsOpen}
          onChange={handleChange}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            aria-label="Share result"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-white text-accent transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Share2 className="h-4 w-4" aria-hidden />
          </button>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              disabled={!dirty && !result}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>
        {copied || shared ? (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {shared ? 'Shared.' : 'Result summary copied (measurements omitted).'}
          </p>
        ) : null}

        <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-3">
          <p className="text-[13px] font-medium text-accent">
            Did we solve your problem today?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              className="h-9 gap-1.5"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
              Yes
            </Button>
            <Button
              type="button"
              size="sm"
              variant={feedback === 'no' ? 'default' : 'outline'}
              className="h-9 gap-1.5"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" aria-hidden />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
