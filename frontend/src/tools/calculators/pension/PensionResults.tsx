'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatPensionMoney } from './calculation';
import type { PensionResult } from './types';

interface PensionResultsProps {
  result: PensionResult | null;
}

export function PensionResults({ result }: PensionResultsProps) {
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);

  return (
    <div
      id="pension-results"
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Comparison summary</h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Retirement age</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.retirementAge}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Lump sum</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLumpSum}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Starting monthly pension</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMonthlyPension}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Depletion break-even</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.breakEvenLabel}
          </dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-muted/40 text-accent">
            <tr>
              <th className="px-2 py-2 font-semibold">Age</th>
              <th className="px-2 py-2 font-semibold">Annual pension</th>
              <th className="px-2 py-2 font-semibold">Cumulative</th>
              <th className="px-2 py-2 font-semibold">Remaining lump sum</th>
            </tr>
          </thead>
          <tbody>
            {result.yearRows.map((row) => (
              <tr
                key={row.yearIndex}
                className={`border-t border-border ${
                  row.depletedDuringYear ? 'bg-amber-50' : ''
                }`}
              >
                <td className="px-2 py-1.5 tabular-nums text-accent">
                  {row.ageEnd}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-accent">
                  {symbol}
                  {formatPensionMoney(row.annualPension, result.currency)}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-accent">
                  {symbol}
                  {formatPensionMoney(row.cumulativePension, result.currency)}
                </td>
                <td className="px-2 py-1.5 tabular-nums text-accent">
                  {symbol}
                  {formatPensionMoney(row.remainingLumpSum, result.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {result.assumptionNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-amber-900" role="note">
        Pension elections are often irreversible. This tool is informational only
        and omits taxes, survivor benefits, guarantees, fees, and personal
        longevity. Consult a qualified adviser before deciding.
      </p>
    </div>
  );
}
