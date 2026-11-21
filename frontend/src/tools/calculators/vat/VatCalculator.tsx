'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  CURRENCY_DENOMINATION_NOTE,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { moneyAmountToInputString } from '@/tools/shared/money-value';
import { shareResultText } from './calculation';
import {
  createDefaultInput,
  type VatFieldErrors,
  type VatInput,
  type VatResult,
} from './types';
import { validateVatInput } from './validation';
import { VatForm } from './VatForm';

function syncDerivedFields(input: VatInput, result: VatResult): VatInput {
  const next = { ...input };
  if (input.driver !== 'amount') {
    next.amount =
      result.mode === 'included'
        ? moneyAmountToInputString(result.grossPrice)
        : moneyAmountToInputString(result.netPrice);
  } else {
    // Keep amount as typed; sync the other pair.
  }
  if (input.driver !== 'net') {
    next.netPrice = moneyAmountToInputString(result.netPrice);
  }
  if (input.driver !== 'gross') {
    next.grossPrice = moneyAmountToInputString(result.grossPrice);
  }
  if (input.driver === 'amount') {
    if (input.mode === 'excluded') {
      next.netPrice = moneyAmountToInputString(result.netPrice);
      next.grossPrice = moneyAmountToInputString(result.grossPrice);
    } else {
      next.grossPrice = moneyAmountToInputString(result.grossPrice);
      next.netPrice = moneyAmountToInputString(result.netPrice);
    }
  }
  next.mode = result.mode;
  return next;
}

export function VatCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const initial = validateVatInput(defaults);
  const [input, setInput] = React.useState<VatInput>(() =>
    initial.result ? syncDerivedFields(defaults, initial.result) : defaults,
  );
  const [errors, setErrors] = React.useState<VatFieldErrors>(() => initial.errors);
  const [result, setResult] = React.useState<VatResult | null>(() => initial.result);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: VatInput) => {
    const validation = validateVatInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      const synced = syncDerivedFields(next, validation.result);
      setInput(synced);
      setResult(validation.result);
    } else {
      setInput(next);
      setResult(null);
    }
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    apply({ ...input, currency });
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    const validation = validateVatInput(fresh);
    const synced =
      validation.result != null ? syncDerivedFields(fresh, validation.result) : fresh;
    setInput(synced);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const cleared: VatInput = {
      ...input,
      amount: '',
      netPrice: '',
      grossPrice: '',
      driver: 'amount',
      vatRate: input.vatRate,
    };
    setInput(cleared);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
  };

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
            Add or remove VAT · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <VatForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
          onClear={handleClear}
          onReset={handleReset}
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
          <Button type="button" variant="ghost" className="h-10" onClick={handleReset}>
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
