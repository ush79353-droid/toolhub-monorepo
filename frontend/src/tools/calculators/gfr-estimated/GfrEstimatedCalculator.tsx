'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { GfrEstimatedForm } from './GfrEstimatedForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type GfrEstimatedFieldErrors,
  type GfrEstimatedInput,
  type GfrEstimatedResult,
} from './types';
import { validateGfrEstimatedInput } from './validation';

export function GfrEstimatedCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(() => initial);
  const [input, setInput] = React.useState(() => initial);
  const [errors, setErrors] = React.useState<GfrEstimatedFieldErrors>({});
  const [result, setResult] = React.useState<GfrEstimatedResult | null>(() =>
    validateGfrEstimatedInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: GfrEstimatedInput) => {
    const validation = validateGfrEstimatedInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateGfrEstimatedInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateGfrEstimatedInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;

  const summaryLines = [
    'GFR Calculator - Estimated Glomerular Filtration Rate',
    '',
    'Educational adult eGFR worksheet (mL/min/1.73 m²).',
  ];
  if (result?.equations.length) {
    summaryLines.push('');
    for (const row of result.equations) {
      summaryLines.push(`${row.label}: ${row.formatted} mL/min/1.73 m²`);
    }
    if (result.bandLabel) summaryLines.push(`Band: ${result.bandLabel}`);
  }
  summaryLines.push('', pageUrl, '', 'Omega Calculators');
  const summary = summaryLines.join('\n');

  const handleCopy = async () => {
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: result?.equations[0]
            ? `eGFR ${result.equations[0].formatted} mL/min/1.73 m² — GFR Calculator`
            : 'GFR Calculator on Omega Calculators',
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // fall through
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
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Adult eGFR from creatinine and/or cystatin C.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <GfrEstimatedForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {shared ? 'Shared' : copied ? 'Copied' : 'Share result'}
          </button>
          <Button type="button" variant="outline" className="h-11" onClick={handleReload}>
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11"
            onClick={handleClear}
            disabled={!dirty && !result?.equations.length}
          >
            Clear all changes
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setFeedback('yes')}
              aria-pressed={feedback === 'yes'}
            >
              <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
              Yes
            </Button>
            <Button
              type="button"
              variant={feedback === 'no' ? 'default' : 'outline'}
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => setFeedback('no')}
              aria-pressed={feedback === 'no'}
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
