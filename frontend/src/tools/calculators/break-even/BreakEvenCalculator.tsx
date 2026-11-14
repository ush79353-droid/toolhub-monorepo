'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { BreakEvenForm } from './BreakEvenForm';
import { BreakEvenResults } from './BreakEvenResults';
import { calculateBreakEven } from './calculation';
import {
  createDefaultInput,
  type BreakEvenFieldErrors,
  type BreakEvenInput,
  type BreakEvenResult,
} from './types';
import { validateBreakEvenInput } from './validation';

export function BreakEvenCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<BreakEvenInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<BreakEvenFieldErrors>({});
  const [result, setResult] = React.useState<BreakEvenResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  const run = (next: BreakEvenInput) => {
    const validation = validateBreakEvenInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        calculateBreakEven(
          validation.parsed.revenuePerUnit,
          validation.parsed.costPerUnit,
          validation.parsed.fixedCosts,
          validation.parsed.currency
        )
      );
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
  };

  const handleShare = async () => {
    const summary = result
      ? [
          `${metadata.title} — Omega Calculators`,
          `Revenue per unit: ${formatCurrencyValue(result.revenuePerUnit, result.currency)}`,
          `Cost per unit: ${formatCurrencyValue(result.costPerUnit, result.currency)}`,
          `Fixed costs: ${formatCurrencyValue(result.fixedCosts, result.currency)}`,
          result.formattedMargin ? `Margin: ${result.formattedMargin}%` : null,
          result.formattedMarkup ? `Markup: ${result.formattedMarkup}%` : null,
          result.breakEvenDefined
            ? `Units to sell: ${result.formattedUnits}`
            : result.explanation,
          result.breakEvenDefined ? `Break-even revenue: ${result.shareRevenue}` : null,
          CURRENCY_DENOMINATION_NOTE,
        ]
          .filter(Boolean)
          .join('\n')
      : `${metadata.title} — Calculate break-even units and revenue at Omega Calculators`;

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
          <p className="text-xs font-normal text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="p-4 sm:p-5">
        <BreakEvenForm
          input={input}
          errors={errors}
          result={result}
          copied={copied}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
          onShare={handleShare}
        />
        <BreakEvenResults />
      </div>
    </section>
  );
}
