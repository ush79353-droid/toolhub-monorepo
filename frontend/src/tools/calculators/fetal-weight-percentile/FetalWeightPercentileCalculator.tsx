'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { shareFetalWeightPercentileText } from './calculation';
import { FetalWeightPercentileForm } from './FetalWeightPercentileForm';
import {
  createDefaultInput,
  createEmptyInput,
  hasFetalWeightPercentileChanges,
  type FetalWeightPercentileFieldErrors,
  type FetalWeightPercentileInput,
  type FetalWeightPercentileResult,
} from './types';
import { validateFetalWeightPercentileInput } from './validation';

export function FetalWeightPercentileCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<FetalWeightPercentileInput>(() =>
    createDefaultInput(),
  );
  const [errors, setErrors] = React.useState<FetalWeightPercentileFieldErrors>(
    {},
  );
  const [result, setResult] =
    React.useState<FetalWeightPercentileResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  const apply = (next: FetalWeightPercentileInput) => {
    const validation = validateFetalWeightPercentileInput(next);
    setInput(next);
    setErrors(validation.incomplete ? {} : validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleReload = () => {
    apply(createDefaultInput());
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    if (hasFetalWeightPercentileChanges(input) || result) {
      const ok = window.confirm('Clear fetal biometry inputs?');
      if (!ok) return;
    }
    apply(createEmptyInput());
    setFeedback(null);
  };

  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0] || `/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;
  const summary = result ? shareFetalWeightPercentileText(pageUrl) : '';

  const handleShare = async () => {
    if (!summary) return;
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: summary,
          url: pageUrl,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // clipboard fallback
      }
    }
    if (await copyTextToClipboard(summary)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const dirty = hasFetalWeightPercentileChanges(input);

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {!isEmbed && headerActions ? (
        <div className="mb-3 flex justify-end">{headerActions}</div>
      ) : null}

      <div className="space-y-5">
        <FetalWeightPercentileForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
        />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!result}
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
