'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { shareResultText } from './calculation';
import { TrumpTaxesForm } from './TrumpTaxesForm';
import {
  createDefaultInput,
  type TrumpsTaxesFieldErrors,
  type TrumpsTaxesInput,
  type TrumpsTaxesResult,
} from './types';
import { validateTrumpsTaxesInput } from './validation';

function inputsEqual(a: TrumpsTaxesInput, b: TrumpsTaxesInput): boolean {
  if (
    a.userTax !== b.userTax ||
    a.trumpTax !== b.trumpTax ||
    a.showLuxury !== b.showLuxury ||
    a.showEssential !== b.showEssential ||
    a.showPriceAssumptions !== b.showPriceAssumptions
  ) {
    return false;
  }
  const aKeys = Object.keys(a.unitPrices);
  const bKeys = Object.keys(b.unitPrices);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a.unitPrices[key] === b.unitPrices[key]);
}

export function TrumpsTaxesVsYourTaxesCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateTrumpsTaxesInput(defaults);
  const [baseline, setBaseline] = React.useState<TrumpsTaxesInput>(() => defaults);
  const [input, setInput] = React.useState<TrumpsTaxesInput>(() => defaults);
  const [errors, setErrors] = React.useState<TrumpsTaxesFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<TrumpsTaxesResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: TrumpsTaxesInput) => {
    setInput(next);
    const validation = validateTrumpsTaxesInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateTrumpsTaxesInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const summary = result ? shareResultText(result) : '';

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
            Historical federal income tax comparison · fixed USD · illustrative spending only
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <TrumpTaxesForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onClear={handleReset}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5"
            disabled={!result}
            onClick={() => void handleShare()}
          >
            <Share2 className="h-4 w-4" aria-hidden />
            {shared ? 'Shared' : copied ? 'Copied' : 'Share / Copy'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-10"
            disabled={!dirty && !result}
            onClick={handleReset}
          >
            Reload defaults
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Helpful?</span>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'yes' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="Yes, helpful"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant={feedback === 'no' ? 'default' : 'outline'}
              className="h-8 w-8"
              aria-label="No, not helpful"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
