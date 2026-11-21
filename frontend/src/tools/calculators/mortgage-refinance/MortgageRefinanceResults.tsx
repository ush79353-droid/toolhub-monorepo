'use client';

import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  formatBreakEvenDate,
  formatMortgageRefinanceMoney,
  formatRatePercent,
  formatTermYears,
} from './calculation';
import type { MortgageRefinanceResult } from './types';

interface MortgageRefinanceResultsProps {
  result: MortgageRefinanceResult;
}

function money(symbol: string, formatted: string): string {
  return `${symbol}${formatted}`;
}

function signedMoney(
  amount: number,
  symbol: string,
  currency: MortgageRefinanceResult['currency']
): string {
  const formatted = formatMortgageRefinanceMoney(Math.abs(amount), currency);
  if (amount > 0) return `+${symbol}${formatted}`;
  if (amount < 0) return `−${symbol}${formatted}`;
  return `${symbol}${formatted}`;
}

function signedRate(next: number, current: number): string {
  const diff = Math.round((next - current) * 10000) / 10000;
  if (diff > 0) return `+${diff}%`;
  if (diff < 0) return `${diff}%`;
  return '0%';
}

function signedTerm(nextMonths: number, currentMonths: number): string {
  const years = (nextMonths - currentMonths) / 12;
  const rounded = Math.round(years * 10) / 10;
  const text = Number.isInteger(rounded) ? String(Math.abs(rounded)) : Math.abs(rounded).toFixed(1);
  if (rounded > 0) return `+${text} yrs`;
  if (rounded < 0) return `−${text} yrs`;
  return '0 yrs';
}

export function MortgageRefinanceResults({ result }: MortgageRefinanceResultsProps) {
  const symbol = getCurrencySymbol(result.currency);
  const rows: { label: string; current: string; neu: string; diff: string }[] = [
    {
      label: 'Principal',
      current: money(symbol, result.formattedCurrentPrincipal),
      neu: money(symbol, result.formattedNewPrincipal),
      diff: signedMoney(
        result.neu.principal - result.current.principal,
        symbol,
        result.currency
      ),
    },
    {
      label: 'Monthly payment',
      current: money(symbol, result.formattedCurrentPayment),
      neu: money(symbol, result.formattedNewPayment),
      diff: signedMoney(
        result.neu.monthlyPayment - result.current.monthlyPayment,
        symbol,
        result.currency
      ),
    },
    {
      label: 'Interest rate',
      current: formatRatePercent(result.current.annualRatePercent),
      neu: formatRatePercent(result.neu.annualRatePercent),
      diff: signedRate(result.neu.annualRatePercent, result.current.annualRatePercent),
    },
    {
      label: 'Term',
      current: formatTermYears(result.current.termMonths),
      neu: formatTermYears(result.neu.termMonths),
      diff: signedTerm(result.neu.termMonths, result.current.termMonths),
    },
    {
      label: 'Total interest',
      current: money(symbol, result.formattedCurrentInterest),
      neu: money(symbol, result.formattedNewInterest),
      diff: signedMoney(
        result.neu.totalInterest - result.current.totalInterest,
        symbol,
        result.currency
      ),
    },
    {
      label: 'Total payments',
      current: money(symbol, result.formattedCurrentTotalPayments),
      neu: money(symbol, result.formattedNewTotalPayments),
      diff: signedMoney(
        result.neu.totalPayments - result.current.totalPayments,
        symbol,
        result.currency
      ),
    },
  ];

  const breakEvenLabel = (() => {
    if (result.breakEvenMonths === null) return 'Does not break even';
    const years = Math.floor(result.breakEvenMonths / 12);
    const months = result.breakEvenMonths % 12;
    const when = `${years} year(s) and ${months} month(s)`;
    const date = result.breakEvenDateIso
      ? formatBreakEvenDate(result.breakEvenDateIso)
      : null;
    return date ? `${when} (${date})` : when;
  })();

  const costText = money(symbol, result.formattedRefinancingCost);
  const savingsText = money(symbol, result.formattedMonthlySavings);
  const explanation = (() => {
    if (result.breakEvenMonths === null) {
      return `The cost of refinancing your current loan is ${costText}. The new monthly payment is not lower, so monthly savings never cover that upfront cost.`;
    }
    if (result.breakEvenMonths === 0) {
      const date = result.breakEvenDateIso
        ? formatBreakEvenDate(result.breakEvenDateIso)
        : null;
      return `The cost of refinancing your current loan is ${costText}. There is no upfront cost left to recover${date ? `, so the break-even point is ${date}` : ''}.`;
    }
    const years = Math.floor(result.breakEvenMonths / 12);
    const months = result.breakEvenMonths % 12;
    const date = result.breakEvenDateIso
      ? formatBreakEvenDate(result.breakEvenDateIso)
      : null;
    return `The cost of refinancing your current loan is ${costText}. The accumulated savings due to refinancing will exceed that upfront cost after ${years} year(s) and ${months} month(s).${date ? ` This means that the break-even point will occur on ${date}.` : ''}`;
  })();

  return (
    <div className="space-y-3">
      <h3 className="text-[13px] font-semibold text-accent">Payment summary</h3>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-[12px] font-semibold text-accent">
              <th scope="col" className="px-3 py-2.5 font-semibold">
                <span className="sr-only">Metric</span>
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Current loan
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                New loan
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-b-0">
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-2.5 text-[12px] font-medium text-muted-foreground"
                >
                  {row.label}
                </th>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.current}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.neu}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-accent">
                  {row.diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Current loan figures are the remaining term. New total payments include upfront
        points and closing costs; those costs are not added to the new principal. Scroll
        sideways on small screens to see the difference column. A lower monthly payment
        on a longer term is not the same as a lower lifetime cost.
      </p>

      <dl className="grid gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[12px] font-medium text-muted-foreground">Refinancing cost</dt>
          <dd className="tabular-nums font-semibold text-accent">{costText}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-medium text-muted-foreground">Monthly savings</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.monthlySavings >= 0 ? savingsText : `−${savingsText}`}
          </dd>
        </div>
        <div>
          <dt className="text-[12px] font-medium text-muted-foreground">
            Estimated break-even period
          </dt>
          <dd className="font-semibold text-accent">{breakEvenLabel}</dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-foreground/90">{explanation}</p>
    </div>
  );
}
