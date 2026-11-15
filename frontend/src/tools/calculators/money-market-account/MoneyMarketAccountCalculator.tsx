'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { MoneyMarketAccountForm } from './MoneyMarketAccountForm';
import { formatMoney } from './calculation';
import {
  createDefaultInput,
  type MoneyMarketAccountFieldErrors,
  type MoneyMarketAccountInput,
  type MoneyMarketAccountResult,
} from './types';
import { validateMoneyMarketAccount } from './validation';

export function MoneyMarketAccountCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<MoneyMarketAccountInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<MoneyMarketAccountFieldErrors>({});
  const [result, setResult] = React.useState<MoneyMarketAccountResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  React.useEffect(() => {
    const validation = validateMoneyMarketAccount(input);
    setErrors(validation.errors);
    setResult(validation.result);
  }, []);

  const run = (next: MoneyMarketAccountInput) => {
    const validation = validateMoneyMarketAccount(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    run(fresh);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result
      ? [
          `${metadata.title} — Omega Calculators`,
          `Mode: ${input.mode === 'sip' ? 'Systematic Investment Plan' : 'One-time investment'}`,
          `Starting balance: ${symbol}${formatMoney(Number(input.startingBalance), input.currency)}`,
          input.mode === 'sip'
            ? `Recurring: ${symbol}${formatMoney(Number(input.recurringInvestment), input.currency)} / ${input.contributionFrequency}`
            : null,
          `Expected annual return: ${input.annualReturnPercent}%`,
          `Period: ${input.years} yrs ${input.months} mos`,
          `Total deposit: ${symbol}${result.formattedTotalDeposit}`,
          `Total interest: ${symbol}${result.formattedTotalInterest}`,
          `Future value: ${symbol}${result.formattedFutureValue}`,
          CURRENCY_DENOMINATION_NOTE,
        ]
          .filter(Boolean)
          .join('\n')
      : '';

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
            Project money market growth with optional recurring deposits.{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <MoneyMarketAccountForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
