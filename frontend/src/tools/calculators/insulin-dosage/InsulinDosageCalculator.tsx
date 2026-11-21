'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { InsulinDosageForm } from './InsulinDosageForm';
import {
  createDefaultInput,
  createEmptyInput,
  inputsEqual,
  type InsulinDosageFieldErrors,
  type InsulinDosageInput,
  type InsulinDosageResult,
} from './types';
import { validateInsulinDosageInput } from './validation';

export function InsulinDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState(initial);
  const [input, setInput] = React.useState<InsulinDosageInput>(initial);
  const [errors, setErrors] = React.useState<InsulinDosageFieldErrors>({});
  const [result, setResult] = React.useState<InsulinDosageResult | null>(null);
  const [carbOpen, setCarbOpen] = React.useState(true);
  const [correctionOpen, setCorrectionOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: InsulinDosageInput) => {
    const validation = validateInsulinDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    setBaseline(fresh);
    setInput(fresh);
    setErrors({});
    setResult(null);
    setCarbOpen(true);
    setCorrectionOpen(true);
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
    'Educational insulin mealtime arithmetic on Omega Calculators.',
    'Clinical inputs are not included in this share for privacy.',
    '',
    pageUrl,
  ].join('\n');

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
          text: 'Educational insulin dosage arithmetic helper',
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
        isEmbed
          ? 'shadow-sm'
          : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Illustrative carb coverage + correction arithmetic (not a prescription).
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <InsulinDosageForm
          input={input}
          errors={errors}
          result={result}
          carbOpen={carbOpen}
          correctionOpen={correctionOpen}
          onCarbOpenChange={setCarbOpen}
          onCorrectionOpenChange={setCorrectionOpen}
          onChange={apply}
        />

        <div className="grid grid-cols-[auto_auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-xs text-xs font-bold">
              {copied ? '✓' : '⧉'}
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : 'Copy link'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {shared ? 'Shared' : 'Share result'}
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
              className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30 disabled:opacity-40"
              onClick={handleClear}
              disabled={!dirty && !result}
            >
              Clear all changes
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Did we solve your problem today?
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`rounded-lg text-xs ${
                feedback === 'yes' ? 'border-primary bg-primary/10' : ''
              }`}
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
              Yes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={`rounded-lg text-xs ${
                feedback === 'no' ? 'border-primary bg-primary/10' : ''
              }`}
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="mr-1.5 h-3.5 w-3.5" />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
