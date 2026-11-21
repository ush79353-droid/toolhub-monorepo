'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { BenadrylDosageForm } from './BenadrylDosageForm';
import { BenadrylDosageResults } from './BenadrylDosageResults';
import {
  createEmptyInput,
  type BenadrylDosageFieldErrors,
  type BenadrylDosageInput,
  type BenadrylDosageResult,
} from './types';
import { validateBenadrylDosageInput } from './validation';

function inputsEqual(a: BenadrylDosageInput, b: BenadrylDosageInput): boolean {
  return (
    a.ageYearsText === b.ageYearsText &&
    a.ageUnit === b.ageUnit &&
    a.productId === b.productId
  );
}

export function BenadrylDosageCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createEmptyInput();
  const [baseline, setBaseline] = React.useState<BenadrylDosageInput>(
    () => initial,
  );
  const [input, setInput] = React.useState<BenadrylDosageInput>(() => initial);
  const [errors, setErrors] = React.useState<BenadrylDosageFieldErrors>({});
  const [result, setResult] = React.useState<BenadrylDosageResult | null>(() =>
    validateBenadrylDosageInput(initial).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: BenadrylDosageInput) => {
    const validation = validateBenadrylDosageInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReload = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setBaseline(fresh);
    setErrors({});
    setResult(validateBenadrylDosageInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const fresh = createEmptyInput();
    setInput(fresh);
    setErrors({});
    setResult(validateBenadrylDosageInput(fresh).result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  // Medical privacy: share only the public page URL — never age or dose payload.
  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tools/${metadata.slug}`
      : `/tools/${metadata.slug}`;
  const shareText = [
    'Benadryl Dosage Calculator — Omega Calculators',
    'Label-based educational dosing reference (not medical advice).',
    pageUrl,
  ].join('\n');

  const handleCopy = async () => {
    if (await copyTextToClipboard(shareText)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: metadata.title,
          text: 'Benadryl Dosage Calculator — Omega Calculators (educational label reference).',
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
            US OTC label bands · no FX · not medical advice
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BenadrylDosageForm input={input} errors={errors} onChange={apply} />
        <BenadrylDosageResults result={result} />

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
              {shared ? 'Shared' : copied ? 'Copied link' : 'Share result'}
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
