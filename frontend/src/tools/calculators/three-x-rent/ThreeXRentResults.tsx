'use client';

import { Button } from '@/components/ui/button';
import { formatCurrencyValue } from '@/tools/shared/currency';
import type { ThreeXRentResult } from './types';

interface ThreeXRentResultsProps {
  result: ThreeXRentResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function formatMultiple(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

export function ThreeXRentResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ThreeXRentResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">
          {invalid ? 'Review highlighted inputs' : 'Enter an amount to calculate'}
        </p>
        <p className="mt-1 max-w-md text-xs font-normal leading-relaxed text-muted-foreground">
          {invalid
            ? 'Correct the messages above. Results stay blank until every number is usable.'
            : 'Add monthly rent, or switch to affordable rent and add gross income before taxes. The 3× figure updates as you type.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const required = result.mode === 'required-income';
  const heroLabel = required ? 'Required gross monthly income' : 'Maximum monthly rent';
  const heroValue = required ? result.requiredMonthlyIncome : result.maximumMonthlyRent;
  const multiple = formatMultiple(result.multiplier);
  const splitNote =
    result.split === 'equal'
      ? 'The per-tenant lines divide that household figure equally. Equal shares are an assumption, not a landlord rule. Many landlords look at combined gross income instead.'
      : result.split === 'custom' && required
        ? 'The per-tenant lines follow the shares you entered. A landlord may still judge the household total rather than those percents.'
        : result.multipleTenants
          ? 'Combined gross monthly income is the sum of the tenant amounts. The rent limit uses that total.'
          : 'Income here is gross pay before taxes. Take-home pay is a smaller number than this screen uses.';

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">{heroLabel}</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {heroValue === null ? '—' : money(heroValue)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
              {copied ? 'Copied' : 'Copy results'}
            </Button>
            {canShare ? (
              <Button type="button" variant="outline" size="sm" onClick={onShare} className="h-8 bg-white px-2.5 text-xs font-medium">
                {shared ? 'Shared' : 'Share'}
              </Button>
            ) : null}
          </div>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          {required && result.requiredAnnualIncome !== null
            ? `Required gross annual income is ${money(result.requiredAnnualIncome)}. `
            : result.maximumAnnualRent !== null
              ? `Maximum annual rent is ${money(result.maximumAnnualRent)}. `
              : null}
          A {multiple}× guideline means rent is {formatMultiple(result.rentToIncomePercent)}% of gross monthly income.
          That multiple is a common screening shortcut, not a law and not a promise that a landlord will use it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {required && result.requiredAnnualIncome !== null ? (
          <Metric label="Required gross annual income" value={money(result.requiredAnnualIncome)} />
        ) : null}
        {!required && result.maximumAnnualRent !== null ? (
          <Metric label="Maximum annual rent" value={money(result.maximumAnnualRent)} />
        ) : null}
        {!required && result.grossMonthlyIncome !== null ? (
          <Metric label="Gross monthly income before taxes" value={money(result.grossMonthlyIncome)} />
        ) : null}
        {required && result.monthlyRent !== null ? (
          <Metric label="Monthly rent" value={money(result.monthlyRent)} />
        ) : null}
        <Metric label="Rent-to-income" value={`${formatMultiple(result.rentToIncomePercent)}%`} />
        <Metric label="Multiplier" value={`${multiple}×`} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{splitNote}</p>

      {result.tenantLines.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">
              {required ? 'Gross income requirement by tenant' : 'Gross monthly income by tenant'}
            </caption>
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Tenant</th>
                <th scope="col" className="px-3 py-2 font-medium">
                  {required ? 'Gross monthly' : 'Gross monthly income'}
                </th>
                <th scope="col" className="px-3 py-2 font-medium">
                  {required ? 'Gross annual' : 'Gross annual income'}
                </th>
                <th scope="col" className="px-3 py-2 font-medium">Share</th>
              </tr>
            </thead>
            <tbody>
              {result.tenantLines.map((line) => (
                <tr key={line.label} className="border-t border-border">
                  <th scope="row" className="px-3 py-2 font-medium text-accent">
                    {line.label}
                  </th>
                  <td className="px-3 py-2 tabular-nums text-accent">{money(line.monthly)}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">{money(line.annual)}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">{formatMultiple(line.sharePercent)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-normal text-muted-foreground">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent sm:text-base">{value}</p>
    </div>
  );
}
