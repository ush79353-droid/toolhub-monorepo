'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import type { FutureValueInput, FutureValueResult } from './types';

interface FutureValueResultsProps {
  input: FutureValueInput;
  result: FutureValueResult | null;
}

export function FutureValueResults({ input, result }: FutureValueResultsProps) {
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const showAny =
    input.showSchedule || input.showBreakdown || input.showAmountByPeriod;
  if (!showAny) return null;

  return (
    <div className="space-y-3">
      {input.showBreakdown ? (
        <div className="space-y-2 rounded-xl border border-border p-3.5 text-sm">
          <h3 className="text-[13px] font-semibold text-accent">Final amount breakdown</h3>
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Grown present value</span>
            <span className="font-medium tabular-nums text-accent">
              {symbol}
              {result.formattedPresentValueGrowth}
            </span>
          </div>
          {result.includePeriodic ? (
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Grown contributions</span>
              <span className="font-medium tabular-nums text-accent">
                {symbol}
                {result.formattedContributionsGrowth}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Net contributions</span>
            <span className="font-medium tabular-nums text-accent">
              {symbol}
              {result.formattedNetContributions}
            </span>
          </div>
          <div className="flex justify-between gap-3 border-t border-border pt-2">
            <span className="text-muted-foreground">Future value</span>
            <span className="font-semibold tabular-nums text-accent">
              {symbol}
              {result.formattedFutureValue}
            </span>
          </div>
        </div>
      ) : null}

      {input.showSchedule && result.schedule.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-xs">
            <caption className="border-b border-border bg-muted/20 px-3 py-2 text-left text-[13px] font-semibold text-accent">
              Schedule
            </caption>
            <thead className="bg-muted/10 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Start</th>
                <th className="px-3 py-2 font-medium">Interest</th>
                <th className="px-3 py-2 font-medium">Contribution</th>
                <th className="px-3 py-2 font-medium">End</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.map((row) => (
                <tr key={row.period} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums text-accent">{row.period}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {symbol}
                    {row.formattedStartBalance}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {symbol}
                    {row.formattedInterest}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {symbol}
                    {row.formattedContribution}
                  </td>
                  <td className="px-3 py-2 tabular-nums font-medium text-accent">
                    {symbol}
                    {row.formattedEndBalance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {input.showAmountByPeriod && result.amountByPeriod.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full text-left text-xs">
            <caption className="border-b border-border bg-muted/20 px-3 py-2 text-left text-[13px] font-semibold text-accent">
              Amount by period
            </caption>
            <thead className="bg-muted/10 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Period</th>
                <th className="px-3 py-2 font-medium">Ending amount</th>
              </tr>
            </thead>
            <tbody>
              {result.amountByPeriod.map((row) => (
                <tr key={row.period} className="border-t border-border">
                  <td className="px-3 py-2 tabular-nums text-accent">{row.period}</td>
                  <td className="px-3 py-2 tabular-nums font-medium text-accent">
                    {symbol}
                    {row.formattedAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
