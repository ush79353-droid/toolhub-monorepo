'use client';

import { Button } from '@/components/ui/button';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { AdrResult } from './types';

/** ADR stays in hundredths. This runtime formats PKR with no fraction digits. */
export function formatAdrMoney(amount: number, currency: SupportedCurrency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(value);
}

interface AdrResultsProps {
  result: AdrResult | null;
  incomplete: boolean;
  copied: boolean;
  onCopy: () => void;
}

export function AdrResults({ result, incomplete, copied, onCopy }: AdrResultsProps) {
  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">
          {incomplete ? 'Enter the known amounts' : 'Review highlighted inputs'}
        </p>
        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
          {incomplete
            ? 'ADR needs room revenue and room-nights sold. Occupancy and RevPAR stay hidden until you add inventory.'
            : 'Correct the messages above. The calculator will not show a rate it cannot compute.'}
        </p>
      </div>
    );
  }

  const money = (value: number) => formatAdrMoney(value, result.currency);
  const formula =
    result.solveFor === 'adr'
      ? `${money(result.adr)} = ${money(result.roomRevenue)} ÷ ${formatCount(result.roomsSold)} room-nights`
      : result.solveFor === 'revenue'
        ? `${money(result.roomRevenue)} = ${money(result.adr)} × ${formatCount(result.roomsSold)} room-nights`
        : `${formatCount(result.roomsSold)} room-nights = ${money(result.roomRevenue)} ÷ ${money(result.adr)}`;

  return (
    <div className="space-y-3.5" aria-live="polite">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <p className="text-xs font-medium text-primary">Average daily rate</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.adr)}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onCopy} className="h-8 bg-white px-2.5 text-xs font-medium">
            {copied ? 'Copied' : 'Copy results'}
          </Button>
        </div>
        <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground">
          ADR is room revenue per sold room-night. It is a money amount, not a percentage. A higher ADR is not
          automatically a better result: occupancy, operating cost, and demand still decide whether the rate is
          profitable.
        </p>
      </div>

      <p className="rounded-xl border border-border bg-white px-3 py-2.5 font-mono text-xs text-accent sm:text-sm">
        {formula}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <Metric label="Total room revenue" value={money(result.roomRevenue)} />
        <Metric label="Room-nights sold" value={formatCount(result.roomsSold)} />
        {result.occupancyPercent !== null ? (
          <Metric label="Occupancy" value={`${formatCount(result.occupancyPercent)}%`} />
        ) : null}
        {result.revpar !== null ? <Metric label="RevPAR" value={money(result.revpar)} /> : null}
      </div>

      {result.roomsSoldIsFractional ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          The solved room-night count is not a whole number. A real night audit records whole room-nights, so round
          this figure to the nearest night before using it as a count.
        </p>
      ) : null}

      {result.availableRoomNights !== null ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Occupancy and RevPAR use {formatCount(result.availableRoomNights)} available room-nights. RevPAR is room
          revenue divided by that inventory. It is not ADR, and it still excludes non-room revenue.
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Occupancy and RevPAR are omitted until you enter available room-nights, or physical rooms and the number of
          days.
        </p>
      )}
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
