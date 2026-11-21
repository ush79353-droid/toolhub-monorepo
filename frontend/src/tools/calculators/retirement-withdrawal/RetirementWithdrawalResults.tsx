'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatRetirementMoney } from './calculation';
import type { RetirementWithdrawalResult } from './types';

interface RetirementWithdrawalResultsProps {
  result: RetirementWithdrawalResult | null;
  resultsOpen: boolean;
  onResultsOpenChange: (open: boolean) => void;
}

export function RetirementWithdrawalResults({
  result,
  resultsOpen,
  onResultsOpenChange,
}: RetirementWithdrawalResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const maxBal = Math.max(
    ...result.yearlyBalances.map((p) => p.balance),
    1
  );

  return (
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={resultsOpen}
        onClick={() => onResultsOpenChange(!resultsOpen)}
      >
        Results
        <span className="text-muted-foreground" aria-hidden>
          {resultsOpen ? '−' : '+'}
        </span>
      </button>

      {resultsOpen ? (
        <div
          id="retirement-withdrawal-results"
          className="space-y-3 border-t border-border px-3.5 pb-3.5 sm:px-4 sm:pb-4"
          aria-live="polite"
        >
          {result.mode === 'withdrawal' ? (
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-accent">
                Withdrawal amount
              </p>
              <div className="flex h-11 items-center rounded-lg border border-primary/30 bg-primary/5 px-3">
                <span className="text-lg font-semibold tabular-nums text-accent">
                  {formatRetirementMoney(
                    result.withdrawalAmount,
                    result.currency
                  )}
                </span>
                <span className="ml-auto text-xs font-medium text-muted-foreground">
                  {result.currency}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-1.5 text-[13px] font-medium text-accent">
                Money lasts
              </p>
              <div className="flex h-11 items-center rounded-lg border border-primary/30 bg-primary/5 px-3">
                <span className="text-lg font-semibold tabular-nums text-accent">
                  {result.formattedDuration}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed text-foreground/90">
            {result.summaryMessage}
          </p>

          {result.yearlyBalances.length > 1 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-accent">
                Principal balance (yearly)
              </p>
              <div
                className="flex h-36 items-end gap-0.5 rounded-lg border border-border bg-white px-2 pb-2 pt-4"
                role="img"
                aria-label="Yearly principal balance chart"
              >
                {result.yearlyBalances.map((p) => {
                  const h = Math.max(2, (p.balance / maxBal) * 100);
                  return (
                    <div
                      key={`${p.calendarYear}-${p.age}`}
                      className="flex min-w-0 flex-1 flex-col items-center justify-end"
                      title={`${p.calendarYear}: ${symbol}${formatRetirementMoney(p.balance, result.currency)}`}
                    >
                      <div
                        className="w-full max-w-[14px] rounded-t bg-primary/70"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{result.yearlyBalances[0]?.calendarYear}</span>
                <span>
                  {
                    result.yearlyBalances[result.yearlyBalances.length - 1]
                      ?.calendarYear
                  }
                </span>
              </div>
              <details className="rounded-lg border border-border bg-white">
                <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-accent">
                  Yearly balance table
                </summary>
                <div className="max-h-56 overflow-auto border-t border-border">
                  <table className="min-w-full text-left text-xs">
                    <thead className="bg-muted/40 text-accent">
                      <tr>
                        <th className="px-2 py-1.5 font-semibold">Year</th>
                        <th className="px-2 py-1.5 font-semibold">Age</th>
                        <th className="px-2 py-1.5 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBalances.map((row) => (
                        <tr
                          key={`row-${row.calendarYear}`}
                          className="border-t border-border"
                        >
                          <td className="px-2 py-1 tabular-nums">
                            {row.calendarYear}
                          </td>
                          <td className="px-2 py-1 tabular-nums">{row.age}</td>
                          <td className="px-2 py-1 tabular-nums">
                            {symbol}
                            {formatRetirementMoney(row.balance, result.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          ) : null}

          <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
            {result.assumptionNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
