'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { AverageFixedCostForm } from './AverageFixedCostForm';
import { AverageFixedCostResults } from './AverageFixedCostResults';
import { buildAverageFixedCostResult } from './calculation';
import {
  createDefaultInput,
  type AverageFixedCostFieldErrors,
  type AverageFixedCostInput,
  type AverageFixedCostResult,
} from './types';
import { validateAverageFixedCostInput } from './validation';

export function AverageFixedCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<AverageFixedCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<AverageFixedCostFieldErrors>({});
  const [result, setResult] = React.useState<AverageFixedCostResult | null>(null);
  const [copied, setCopied] = React.useState(false);

  const run = (next: AverageFixedCostInput) => {
    const validation = validateAverageFixedCostInput(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(
        buildAverageFixedCostResult(
          validation.parsed.totalFixedCost,
          validation.parsed.numberOfUnits,
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
          `Total fixed cost: ${formatCurrencyValue(result.totalFixedCost, result.currency)}`,
          `Number of units: ${result.numberOfUnits}`,
          `Average fixed cost: ${result.shareAverage} per unit`,
          CURRENCY_DENOMINATION_NOTE,
        ].join('\n')
      : `${metadata.title} — Calculate average fixed cost per unit at Omega Calculators`;

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
        <AverageFixedCostForm
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
        <AverageFixedCostResults />
      </div>
    </section>
  );
}
