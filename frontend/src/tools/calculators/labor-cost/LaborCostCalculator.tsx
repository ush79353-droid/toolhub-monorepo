'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { LaborCostForm } from './LaborCostForm';
import { LaborCostResults } from './LaborCostResults';
import {
  createDefaultInput,
  type LaborCostFieldErrors,
  type LaborCostInput,
  type LaborCostResult,
} from './types';
import { validateLaborCost } from './validation';

export function LaborCostCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<LaborCostInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<LaborCostFieldErrors>({});
  const [result, setResult] = React.useState<LaborCostResult | null>(() =>
    validateLaborCost(createDefaultInput(), { includeLaborCostPercent: false }).result
  );
  const [additionalOpen, setAdditionalOpen] = React.useState(false);
  const [percentageOpen, setPercentageOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: LaborCostInput, includePercent: boolean) => {
    const validation = validateLaborCost(next, { includeLaborCostPercent: includePercent });
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setAdditionalOpen(false);
    setPercentageOpen(false);
    run(fresh, false);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary =
    result && result.annualPayrollLaborCost !== null
      ? [
          `${metadata.title} — Omega Calculators`,
          `Gross hours/year: ${result.grossHoursPerYearDisplay}`,
          `Gross pay: ${symbol}${result.grossPayDisplay}`,
          `Net hours worked: ${result.netHoursWorkedDisplay}`,
          `Annual payroll labor cost: ${symbol}${result.annualPayrollLaborCostDisplay}`,
          `Hourly labor cost: ${symbol}${result.hourlyLaborCostDisplay}`,
          percentageOpen && result.laborCostPercentDisplay
            ? `Labor cost percentage: ${result.laborCostPercentDisplay}%`
            : null,
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
            Estimate annual and hourly labor cost. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <LaborCostForm
          input={input}
          errors={errors}
          result={result}
          additionalOpen={additionalOpen}
          percentageOpen={percentageOpen}
          onChange={(next) => {
            setInput(next);
            run(next, percentageOpen);
          }}
          onToggleAdditional={() => setAdditionalOpen((open) => !open)}
          onTogglePercentage={() => {
            setPercentageOpen((open) => {
              const next = !open;
              run(input, next);
              return next;
            });
          }}
          onReset={handleReset}
        />
        <LaborCostResults />
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
