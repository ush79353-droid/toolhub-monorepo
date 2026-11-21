'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { WeightPercentileForm } from './WeightPercentileForm';
import { WeightPercentileResults } from './WeightPercentileResults';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type WeightPercentileFieldErrors,
  type WeightPercentileInput,
  type WeightPercentileResult,
} from './types';
import { validateWeightPercentileInput } from './validation';

export function WeightPercentileCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<WeightPercentileInput>(
    () => defaults,
  );
  const [input, setInput] = React.useState<WeightPercentileInput>(
    () => defaults,
  );
  const [errors, setErrors] = React.useState<WeightPercentileFieldErrors>({});
  const [result, setResult] = React.useState<WeightPercentileResult | null>(
    null,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: WeightPercentileInput) => {
    const validation = validateWeightPercentileInput(next);
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
    setInput(createEmptyInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
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
    'Educational WHO child weight-for-age percentile (0–60 months).',
    'Not medical advice.',
    '',
    pageUrl,
  ].join('\n');

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'Weight Percentile Calculator | Omega Calculators',
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
      className={`space-y-4 ${className}`}
    >
      {!isEmbed && headerActions ? (
        <div className="flex justify-end">{headerActions}</div>
      ) : null}

      <WeightPercentileForm input={input} errors={errors} onChange={apply} />
      <WeightPercentileResults result={result} />

      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
        <div className="grid grid-cols-[auto_1fr] gap-3">
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
              className="h-11 justify-start gap-2"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start gap-2"
              disabled={!dirty && !result}
              onClick={handleClear}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Did we solve your problem today?
          </p>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'yes' ? 'default' : 'outline'}
            className="h-8 gap-1.5"
            onClick={() => setFeedback('yes')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Yes
          </Button>
          <Button
            type="button"
            size="sm"
            variant={feedback === 'no' ? 'default' : 'outline'}
            className="h-8 gap-1.5"
            onClick={() => setFeedback('no')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            No
          </Button>
        </div>
      </div>
    </section>
  );
}
