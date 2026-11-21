'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { varianceLabel } from './calculation';
import type { EvmResult } from './types';

interface EvmResultsProps {
  result: EvmResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function formatIndex(value: number | null): string {
  if (value === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function EvmResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: EvmResultsProps) {
  return (
    <section
      aria-labelledby="evm-report-heading"
      className="space-y-3 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
    >
      <h3 id="evm-report-heading" className="text-sm font-semibold text-accent">
        EVM report
      </h3>

      {invalid ? (
        <p className="text-sm text-muted-foreground">
          Fix the highlighted fields to generate the EVM report.
        </p>
      ) : incomplete || !result ? (
        <p className="text-sm text-muted-foreground">
 No task information yet; try adding some values!
        </p>
      ) : (
        <>
          <dl className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ['Planned Value (PV)', formatCurrencyValue(result.plannedValue, result.currency)],
                ['Earned Value (EV)', formatCurrencyValue(result.earnedValue, result.currency)],
                ['Actual Cost (AC)', formatCurrencyValue(result.actualCost, result.currency)],
                ['Cost Variance (CV)', formatCurrencyValue(result.costVariance, result.currency)],
                [
                  'Schedule Variance (SV)',
                  formatCurrencyValue(result.scheduleVariance, result.currency),
                ],
                ['Cost Performance Index (CPI)', formatIndex(result.costPerformanceIndex)],
                ['Schedule Performance Index (SPI)', formatIndex(result.schedulePerformanceIndex)],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-white px-3 py-2">
                <dt className="text-[11px] font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums text-accent">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs leading-relaxed text-muted-foreground">
            CV is {varianceLabel(result.costVariance)}
            {result.costVariance < 0 ? ' (over budget)' : result.costVariance > 0 ? ' (under budget)' : ''}.
            SV is {varianceLabel(result.scheduleVariance)}
            {result.scheduleVariance < 0
              ? ' (behind schedule)'
              : result.scheduleVariance > 0
                ? ' (ahead of schedule)'
                : ''}
            .
            {result.costPerformanceIndex === null
              ? ' CPI is omitted when actual cost is zero.'
              : ''}
            {result.schedulePerformanceIndex === null
              ? ' SPI is omitted when planned value is zero.'
              : ''}{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy result'}
            </Button>
            {canShare ? (
              <Button type="button" variant="outline" className="h-10" onClick={onShare}>
                {shared ? (
                  <Check className="mr-1.5 h-4 w-4" />
                ) : (
                  <Share2 className="mr-1.5 h-4 w-4" />
                )}
                {shared ? 'Shared' : 'Share result'}
              </Button>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
