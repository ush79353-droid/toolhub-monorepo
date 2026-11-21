'use client';

import * as React from 'react';
import { Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { formatPegMoney } from './calculation';
import { PegRatioForm } from './PegRatioForm';
import { PegRatioResults } from './PegRatioResults';
import {
  createDefaultInput,
  createEmptyInput,
  type PegRatioFieldErrors,
  type PegRatioInput,
  type PegRatioResult,
} from './types';
import { validatePegRatioInput } from './validation';

function inputsEqual(a: PegRatioInput, b: PegRatioInput): boolean {
  return (
    a.pricePerShare === b.pricePerShare &&
    a.earningsPerShare === b.earningsPerShare &&
    a.calculateEps === b.calculateEps &&
    a.netEarnings === b.netEarnings &&
    a.outstandingShares === b.outstandingShares &&
    a.retentionRate === b.retentionRate &&
    a.returnOnEquity === b.returnOnEquity &&
    a.currency === b.currency
  );
}

export function PegRatioCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const defaults = createDefaultInput();
  const [baseline, setBaseline] = React.useState<PegRatioInput>(() => defaults);
  const [input, setInput] = React.useState<PegRatioInput>(() => defaults);
  const [errors, setErrors] = React.useState<PegRatioFieldErrors>({});
  const [result, setResult] = React.useState<PegRatioResult | null>(() =>
    validatePegRatioInput(defaults).result
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: PegRatioInput) => {
    const validation = validatePegRatioInput(next);
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
    const validation = validatePegRatioInput(fresh);
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
  const symbol = getCurrencySymbol(input.currency);
  const shareable = result != null && result.pegRatio != null;

  const money = (raw: string) => {
    const n = Number(raw.replace(/,/g, ''));
    return Number.isFinite(n)
      ? `${symbol}${formatPegMoney(n, input.currency)}`
      : `${symbol}${raw}`;
  };

  const summary = shareable
    ? [
        `${metadata.title} | Omega Calculators`,
        `Price per Share: ${money(input.pricePerShare)}`,
        `Earnings per Share: ${result!.formattedEps ?? '; '}`,
        `P/E Ratio: ${result!.formattedPeRatio ?? '; '}`,
        '',
        `Retention Rate: ${input.retentionRate}%`,
        `Return on Equity: ${input.returnOnEquity}%`,
        `Earnings Growth: ${result!.formattedGrowth ?? '; '}`,
        '',
        `PEG Ratio: ${result!.formattedPeg ?? '; '}`,
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
            Price/earnings-to-growth (PEG) from P/E and estimated growth.
          </p>
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <PegRatioForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onCurrencyChange={handleCurrencyChange}
        />

        <PegRatioResults result={result} />

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
