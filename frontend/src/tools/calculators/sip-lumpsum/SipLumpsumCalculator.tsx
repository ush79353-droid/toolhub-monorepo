'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { SipLumpsumForm } from './SipLumpsumForm';
import { SipLumpsumResults } from './SipLumpsumResults';
import {
  createDefaultInput,
  createEmptyInput,
  type SipLumpsumFieldErrors,
  type SipLumpsumInput,
  type SipLumpsumResult,
} from './types';
import { validateSipLumpsumInput } from './validation';

function inputsEqual(a: SipLumpsumInput, b: SipLumpsumInput): boolean {
  return (
    a.solveFor === b.solveFor &&
    a.currency === b.currency &&
    a.initialLumpsum === b.initialLumpsum &&
    a.annualReturnPercent === b.annualReturnPercent &&
    a.termValue === b.termValue &&
    a.termUnit === b.termUnit &&
    a.startDate === b.startDate &&
    a.inflationPercent === b.inflationPercent &&
    a.compounding === b.compounding &&
    a.depositAmount === b.depositAmount &&
    a.depositFrequency === b.depositFrequency &&
    a.depositTiming === b.depositTiming &&
    a.targetFinalBalance === b.targetFinalBalance
  );
}

export function SipLumpsumCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<SipLumpsumInput>(
    () => defaults
  );
  const [input, setInput] = React.useState<SipLumpsumInput>(() => defaults);
  const [errors, setErrors] = React.useState<SipLumpsumFieldErrors>({});
  const [result, setResult] = React.useState<SipLumpsumResult | null>(() =>
    validateSipLumpsumInput(defaults).result
  );
  const [mainOpen, setMainOpen] = React.useState(true);
  const [sipOpen, setSipOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: SipLumpsumInput) => {
    const validation = validateSipLumpsumInput(next);
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
    const validation = validateSipLumpsumInput(fresh);
    setInput(fresh);
    setBaseline(fresh);
    setErrors(validation.errors);
    setResult(validation.result);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const handleClear = () => {
    const empty = createEmptyInput(input.currency);
    setInput(empty);
    setErrors({});
    setResult(null);
    setCopied(false);
    setShared(false);
    setFeedback(null);
  };

  const dirty = !inputsEqual(input, baseline);
  const shareable = result != null;

  const summary = shareable
    ? [
        `${metadata.title} | Omega Calculators`,
        result!.summaryMessage,
        `Opening: ${result!.formattedOpeningBalance}`,
        `Final: ${result!.formattedFinalBalance}`,
        `${result!.periodicInOutLabel}: ${result!.formattedPeriodicDeposit}`,
        `Total in/out: ${result!.formattedTotalDeposits}`,
        `Total return: ${result!.formattedTotalReturn}`,
        `Transactions: ${result!.numberOfTransactions}`,
        `End of term: ${result!.endDateLabel}`,
        '',
        `Calculator: ${typeof window !== 'undefined' ? window.location.href : `/tools/${metadata.slug}`}`,
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
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            SIP deposits plus lumpsum compound growth.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <SipLumpsumForm
          input={input}
          errors={errors}
          result={result}
          mainOpen={mainOpen}
          sipOpen={sipOpen}
          onMainOpenChange={setMainOpen}
          onSipOpenChange={setSipOpen}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
        />

        <SipLumpsumResults result={result} />

        <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!summary}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-accent">
              {copied ? 'Copied!' : shared ? 'Shared' : 'Share result'}
            </span>
          </button>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-center gap-2"
              onClick={handleReload}
            >
              Reload calculator
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-center gap-2"
              onClick={handleClear}
              disabled={!dirty && result == null}
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
              variant={feedback === 'yes' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setFeedback('yes')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Yes
            </Button>
            <Button
              type="button"
              variant={feedback === 'no' ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setFeedback('no')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              No
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
