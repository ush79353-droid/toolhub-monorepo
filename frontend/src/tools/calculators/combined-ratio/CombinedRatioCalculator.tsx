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
import { formatPercent, shareResultText } from './calculation';
import {
  createDefaultInput,
  createExampleAInput,
  type CombinedRatioFieldErrors,
  type CombinedRatioInput,
  type CombinedRatioResult,
} from './types';
import { validateCombinedRatioInput } from './validation';
import { CombinedRatioForm } from './CombinedRatioForm';

function syncDerivedFields(
  input: CombinedRatioInput,
  result: CombinedRatioResult,
): CombinedRatioInput {
  const next: CombinedRatioInput = { ...input };
  if (input.driver !== 'claimLoss') {
    next.claimLoss = moneyAmountToInputString(result.claimLoss);
  }
  if (input.driver !== 'lossAdjustments') {
    next.lossAdjustments = moneyAmountToInputString(result.lossAdjustments);
  }
  if (input.driver !== 'lossExpense') {
    next.lossExpense = moneyAmountToInputString(result.lossExpense);
  }
  if (input.driver !== 'premiums') {
    next.premiums = moneyAmountToInputString(result.premiums);
  }
  if (input.driver !== 'underwritingExpense') {
    next.underwritingExpense = moneyAmountToInputString(result.underwritingExpense);
  }
  if (input.driver !== 'combinedRatio') {
    next.combinedRatio = formatPercent(result.combinedRatio);
  }
  return next;
}

export function CombinedRatioCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [input, setInput] = React.useState<CombinedRatioInput>(() => defaults);
  const [errors, setErrors] = React.useState<CombinedRatioFieldErrors>({});
  const [result, setResult] = React.useState<CombinedRatioResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: CombinedRatioInput) => {
    const validation = validateCombinedRatioInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.result) {
      setInput(syncDerivedFields(next, validation.result));
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
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput({
      ...input,
      claimLoss: '',
      lossAdjustments: '',
      lossExpense: '',
      premiums: '',
      underwritingExpense: '',
      combinedRatio: '',
      driver: 'claimLoss',
    });
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
            Insurance combined ratio · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CombinedRatioForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
          onLoadExample={() => apply(createExampleAInput())}
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
            {shared ? 'Shared' : copied ? 'Copied' : 'Share result'}
          </Button>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Did we solve your problem today?</span>
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
