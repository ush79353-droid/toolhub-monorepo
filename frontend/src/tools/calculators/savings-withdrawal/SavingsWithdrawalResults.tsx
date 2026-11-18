import { getCurrencySymbol } from '@/tools/shared/currency';
import type { SavingsWithdrawalResult } from './types';

interface SavingsWithdrawalResultsProps {
  result: SavingsWithdrawalResult | null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/70 py-2.5 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium tabular-nums text-accent">{value}</span>
    </div>
  );
}

export function SavingsWithdrawalResults({ result }: SavingsWithdrawalResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Results</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter a valid balance, withdrawal amount, interest rate, and first withdrawal date to see
          how long your savings will last.
        </p>
      </div>
    );
  }

  const symbol = getCurrencySymbol(result.currency);

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4">
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>

      {result.neverDepletes ? (
        <p className="mt-2 text-sm leading-relaxed text-accent">
          At this withdrawal amount and interest rate, your savings are not projected to run out —
          monthly interest covers (or exceeds) the withdrawal.
        </p>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-accent">
          Your savings will last for{' '}
          <span className="font-semibold">
            {result.years} year(s) and {result.months} month(s)
          </span>{' '}
          from the first day of withdrawal.
        </p>
      )}

      {!result.neverDepletes ? (
        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[16rem]">
            <Row
              label="Monthly withdrawal"
              value={`${symbol}${result.formattedMonthlyWithdrawal}`}
            />
            <Row
              label="Total withdrawal"
              value={`${symbol}${result.formattedTotalWithdrawal}`}
            />
            <Row
              label="Interest earned"
              value={`${symbol}${result.formattedInterestEarned}`}
            />
            <Row label="# withdrawals" value={String(result.withdrawalCount)} />
            <Row label="Last withdrawal on" value={result.formattedLastWithdrawalDate} />
            <Row
              label="Balance at first withdrawal"
              value={`${symbol}${result.formattedBalanceAtFirstWithdrawal}`}
            />
            <Row
              label="Balance after last withdrawal"
              value={`${symbol}${result.formattedBalanceAfterLastWithdrawal}`}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            You may have to scroll horizontally to see all of the table.
          </p>
        </div>
      ) : null}
    </div>
  );
}
