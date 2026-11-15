'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { AverageCollectionPeriodForm } from './AverageCollectionPeriodForm';
import { AverageCollectionPeriodResults } from './AverageCollectionPeriodResults';
import { calculateAverageCollectionPeriod, describeResult } from './calculation';
import {
  createDefaultInput,
  type AverageCollectionPeriodFieldErrors,
  type AverageCollectionPeriodInput,
  type AverageCollectionPeriodResult,
} from './types';
import { validateAverageCollectionPeriod } from './validation';

function daysText(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function summaryText(metadataTitle: string, result: AverageCollectionPeriodResult): string {
  if (!result.defined || result.collectionPeriodDays === null || result.durationDays === null) {
    return '';
  }
  const lines = [
    `${metadataTitle} — Omega Calculators`,
    `Average collection period: ${daysText(result.collectionPeriodDays)} days`,
    `Duration: ${daysText(result.durationDays)} days`,
  ];
  if (result.method === 'average-ar') {
    if (result.averageReceivable !== null) {
      lines.push(
        `Average accounts receivable: ${formatCurrencyValue(result.averageReceivable, result.currency)}`
      );
    }
    if (result.totalCreditSales !== null) {
      lines.push(
        `Total credit sales: ${formatCurrencyValue(result.totalCreditSales, result.currency)}`
      );
    }
  } else if (result.receivablesTurnoverRatio !== null) {
    lines.push(`Receivables turnover ratio: ${daysText(result.receivablesTurnoverRatio)}`);
  }
  if (result.termsOfCreditDays !== null) {
    lines.push(`Terms of credit: ${daysText(result.termsOfCreditDays)} days`);
  }
  lines.push(describeResult(result));
  lines.push(CURRENCY_DENOMINATION_NOTE);
  return lines.join('\n');
}

export function AverageCollectionPeriodCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<AverageCollectionPeriodInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<AverageCollectionPeriodFieldErrors>({});
  const [result, setResult] = React.useState<AverageCollectionPeriodResult | null>(null);
  const [averageSectionOpen, setAverageSectionOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const run = (next: AverageCollectionPeriodInput) => {
    const validation = validateAverageCollectionPeriod(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? calculateAverageCollectionPeriod(next) : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
    setAverageSectionOpen(true);
  };

  const summary = result ? summaryText(metadata.title, result) : '';

  const handleShare = async () => {
    const text =
      summary ||
      `${metadata.title} — Calculate average collection period at Omega Calculators`;
    if (await copyTextToClipboard(text)) {
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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">{headerActions}</div>
      </div>
      <div className="space-y-4 p-4 sm:p-5">
        <AverageCollectionPeriodForm
          input={input}
          errors={errors}
          result={result}
          averageSectionOpen={averageSectionOpen}
          copied={copied}
          onAverageSectionOpenChange={setAverageSectionOpen}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
          onShare={handleShare}
        />
        <AverageCollectionPeriodResults />
      </div>
    </section>
  );
}
