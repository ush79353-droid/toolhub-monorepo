'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { SwpForm } from './SwpForm';
import { SwpResults } from './SwpResults';
import {
  createDefaultInput,
  createEmptyInput,
  type SwpFieldErrors,
  type SwpInput,
  type SwpResult,
} from './types';
import { validateSwpInput } from './validation';

function inputsEqual(a: SwpInput, b: SwpInput): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function SwpCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const initial = createDefaultInput();
  const [baseline, setBaseline] = React.useState<SwpInput>(() => initial);
  const [input, setInput] = React.useState<SwpInput>(() => initial);
  const [errors, setErrors] = React.useState<SwpFieldErrors>({});
  const [result, setResult] = React.useState<SwpResult | null>(() =>
    validateSwpInput(initial).result
  );
  const [specOpen, setSpecOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SwpInput) => {
    const validation = validateSwpInput(next);
    setInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;
    apply({ ...input, currency: next });
  };

  const handleReload = () => {
    const fresh = createDefaultInput();
    const validation = validateSwpInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setSpecOpen(true);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    setInput(createEmptyInput(input.currency));
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        result.summaryMessage,
        `Opening: ${result.formattedOpening}`,
        `Withdrawal: ${result.formattedWithdrawal}`,
        `Total withdrawal: ${result.formattedTotalWithdrawal}`,
        `Total return: ${result.formattedTotalReturn}`,
        `Withdrawals: ${result.numberOfWithdrawals}`,
        `Last: ${result.lastWithdrawalDate}`,
        '',
        `Calculator: ${typeof window !== 'undefined' ? window.location.href : `/tools/${metadata.slug}`}`,
      ].join('\n')
    : '';

  const handleShare = async () => {
    if (!summary) return;
    try {
      if (canShare && navigator.share) {
        await navigator.share({ title: metadata.title, text: summary });
        setShared(true);
        return;
      }
      const ok = await copyTextToClipboard(summary);
      if (ok) {
        setCopied(true);
        setShared(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!isEmbed && headerActions ? (
        <div className="flex justify-end">{headerActions}</div>
      ) : null}

      <SwpForm
        input={input}
        errors={errors}
        specOpen={specOpen}
        onSpecOpenChange={setSpecOpen}
        onChange={apply}
        onCurrencyChange={handleCurrencyChange}
      />

      <SwpResults result={result} />

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleShare}
          disabled={!result}
        >
          <Share2 className="mr-2 h-4 w-4" aria-hidden />
          {shared ? (copied ? 'Copied' : 'Shared') : 'Share result'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleReload}
        >
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleClear}
          disabled={!dirty && !result}
        >
          Clear all changes
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>Did we solve your problem today?</span>
        <Button
          type="button"
          size="sm"
          variant={feedback === 'yes' ? 'default' : 'outline'}
          onClick={() => setFeedback('yes')}
          aria-pressed={feedback === 'yes'}
        >
          <ThumbsUp className="mr-1 h-3.5 w-3.5" aria-hidden />
          Yes
        </Button>
        <Button
          type="button"
          size="sm"
          variant={feedback === 'no' ? 'default' : 'outline'}
          onClick={() => setFeedback('no')}
          aria-pressed={feedback === 'no'}
        >
          <ThumbsDown className="mr-1 h-3.5 w-3.5" aria-hidden />
          No
        </Button>
      </div>
    </div>
  );
}
