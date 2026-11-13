'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { Button } from '@/components/ui/button';
import { ARDaysForm } from './ARDaysForm';
import { ARDaysResults } from './ARDaysResults';
import { calculateARDays, describeResult } from './calculation';
import { createDefaultARDaysInput, type ARDaysFieldErrors, type ARDaysInput, type ARDaysResult } from './types';
import { validateARDays } from './validation';

function daysText(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function summaryText(metadataTitle: string, result: ARDaysResult): string {
  if (!result.defined || result.arDays === null || result.formula === null || result.accountsReceivableUsed === null || result.netCreditSales === null || result.periodDays === null) {
    return '';
  }
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `A/R days: ${daysText(result.arDays)}`,
    `Receivables used: ${money(result.accountsReceivableUsed)}`,
    `Net credit sales: ${money(result.netCreditSales)}`,
    `Days in the period: ${daysText(result.periodDays)}`,
  ];
  if (result.averageReceivable !== null) lines.push(`Average A/R: ${money(result.averageReceivable)}`);
  lines.push(describeResult(result));
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function ARDaysCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ARDaysInput>(() => createDefaultARDaysInput());
  const [errors, setErrors] = React.useState<ARDaysFieldErrors>({});
  const [result, setResult] = React.useState<ARDaysResult | null>(() => calculateARDays(createDefaultARDaysInput()));
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ARDaysInput) => {
    const validation = validateARDays(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateARDays(next) : null);
  };

  const summary = result ? summaryText(metadata.title, result) : '';

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {headerActions}
          <div className="w-[148px] shrink-0 sm:w-[160px]">
            <label htmlFor="ar-days-currency" className="sr-only">
              Display currency
            </label>
            <CurrencySelect
              id="ar-days-currency"
              value={input.currency}
              onChange={(currency) => {
                const next = { ...input, currency };
                setInput(next);
                run(next);
              }}
            />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <ARDaysForm
          input={input}
          errors={errors}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            run(input);
          }}
          onReset={() => {
            const fresh = createDefaultARDaysInput();
            setInput(fresh);
            setErrors({});
            setResult(calculateARDays(fresh));
          }}
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
                  // The user dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <ARDaysResults result={result} />
      </div>
    </section>
  );
}
