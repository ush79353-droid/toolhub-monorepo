'use client';

import { ChevronDown } from 'lucide-react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { SimpleSavingsBreakdownChart } from './SimpleSavingsBreakdownChart';
import type { SavingsDraft, SavingsResult } from './types';

interface SimpleSavingsResultsProps {
  draft: SavingsDraft;
  result: SavingsResult;
  breakdownOpen: boolean;
  onBreakdownOpen: (open: boolean) => void;
}

function formatPct(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}%`;
}

export function SimpleSavingsResults({
  draft,
  result,
  breakdownOpen,
  onBreakdownOpen,
}: SimpleSavingsResultsProps) {
  const currency = result.resultCurrency;
  const finalLabel = formatCurrencyValue(result.finalBalance, currency);
  const depositsLabel = formatCurrencyValue(result.totalAdditionalDeposits, currency);
  const principalLabel = formatCurrencyValue(result.totalPrincipal, currency);
  const interestLabel = formatCurrencyValue(result.totalInterest, currency);

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 text-sm leading-relaxed text-accent sm:p-4">
        <p>
          The Annual Percentage Yield (APY) is{' '}
          <strong className="font-semibold">{formatPct(result.apyPercent)}</strong>.
        </p>
        <p>
          Your final savings will be <strong className="font-semibold">{finalLabel}</strong>.
        </p>
        <p>
          The sum of the additional deposits is{' '}
          <strong className="font-semibold">{depositsLabel}</strong>; thus, your total principal
          (initial savings plus total additional deposits) is{' '}
          <strong className="font-semibold">{principalLabel}</strong>, and the total interest
          gained is <strong className="font-semibold">{interestLabel}</strong>.
        </p>
        {result.realFinalBalance != null && result.inflationPercent != null ? (
          <p>
            After {formatPct(result.inflationPercent)} annual inflation, estimated purchasing
            power is{' '}
            <strong className="font-semibold">
              {formatCurrencyValue(result.realFinalBalance, currency)}
            </strong>
            .
          </p>
        ) : null}
        {draft.knownRate === 'apy' ? (
          <p className="text-xs text-muted-foreground">
            Derived nominal annual rate for {draft.compounding} compounding:{' '}
            {formatPct(result.nominalRatePercent)}.
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={breakdownOpen}
          onClick={() => onBreakdownOpen(!breakdownOpen)}
        >
          Final balance breakdown as percentages
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${breakdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {breakdownOpen ? (
          <div className="border-t border-border px-3.5 py-3.5">
            <SimpleSavingsBreakdownChart result={result} currency={currency} />
            <p className="mt-2 text-center text-xs italic text-muted-foreground">
              yearly savings pie chart
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
