'use client';

import * as React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import type { ArmMortgageResult } from './types';

function money(cents: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(cents / 100, currency);
}

export function ArmMortgageResults({
  result,
  copied,
  onCopy,
}: {
  result: ArmMortgageResult | null;
  copied: boolean;
  onCopy: () => void;
}) {
  const [showSchedule, setShowSchedule] = React.useState(false);
  if (!result) return null;
  const currency = result.currency;
  const points = result.balanceCurve;
  const maxBal = Math.max(...points.map((p) => p.balanceCents), 1);
  const payPoints = result.paymentCurve;
  const maxPay = Math.max(...payPoints.map((p) => p.paymentCents), 1);

  const line = (values: { x: number; y: number }[]) =>
    values
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');

  const balancePath = line(
    points.map((p, i) => ({
      x: (i / Math.max(points.length - 1, 1)) * 280,
      y: 70 - (p.balanceCents / maxBal) * 62,
    }))
  );
  const paymentPath = line(
    payPoints.map((p, i) => ({
      x: (i / Math.max(payPoints.length - 1, 1)) * 280,
      y: 70 - (p.paymentCents / maxPay) * 62,
    }))
  );

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium text-accent">Initial principal & interest</p>
            <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
              {money(result.initialPaymentCents, currency)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">/ mo</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Fixed for {result.fixedMonths} months, then every {result.adjustEveryMonths} months. Projected, not guaranteed.
            </p>
          </div>
          <Button type="button" variant="outline" className="h-8 bg-white px-2.5 text-xs font-medium" onClick={onCopy}>
            {copied ? 'Copied' : 'Copy Results'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          ['After first reset', result.firstAdjustedPaymentCents ? money(result.firstAdjustedPaymentCents, currency) : '—'],
          ['Highest modeled P&I', money(result.maxPaymentCents, currency)],
          ['Lowest modeled P&I', money(result.minPaymentCents, currency)],
          ['Total interest', money(result.totalInterestCents, currency)],
          ['Total principal', money(result.totalPrincipalCents, currency)],
          ['Housing payment', money(result.initialHousingPaymentCents, currency)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-white p-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <figure className="rounded-xl border border-border bg-white p-3">
          <figcaption className="text-xs font-medium text-accent">Balance over time</figcaption>
          <svg viewBox="0 0 280 80" className="mt-2 h-20 w-full" role="img" aria-label="Declining mortgage balance">
            <path d={balancePath} fill="none" stroke="#087E8B" strokeWidth="2" />
          </svg>
        </figure>
        <figure className="rounded-xl border border-border bg-white p-3">
          <figcaption className="text-xs font-medium text-accent">Payment over time</figcaption>
          <svg viewBox="0 0 280 80" className="mt-2 h-20 w-full" role="img" aria-label="Modeled payment changes">
            <path d={paymentPath} fill="none" stroke="#163C43" strokeWidth="2" />
          </svg>
        </figure>
      </div>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => setShowSchedule((open) => !open)}
          aria-expanded={showSchedule}
        >
          Amortization schedule ({result.paymentCount} payments)
          <span className="text-xs font-normal text-primary">{showSchedule ? 'Hide' : 'View'}</span>
        </button>
        {showSchedule ? (
          <div className="brand-scroll max-h-[320px] overflow-auto border-t border-border">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="sticky top-0 bg-muted text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <tr>
                  {['#', 'Date', 'Rate', 'Payment', 'Principal', 'Interest', 'Balance'].map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.paymentNumber} className={row.rateAdjusted ? 'bg-brand-softTeal/60' : 'hover:bg-muted/35'}>
                    <td className="px-3 py-2 tabular-nums">{row.paymentNumber}</td>
                    <td className="px-3 py-2">{row.date}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {row.annualRate.toFixed(2)}%{row.rateAdjusted ? ' *' : ''}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{money(row.paymentCents, currency)}</td>
                    <td className="px-3 py-2 tabular-nums">{money(row.principalCents, currency)}</td>
                    <td className="px-3 py-2 tabular-nums">{money(row.interestCents, currency)}</td>
                    <td className="px-3 py-2 tabular-nums">{money(row.balanceCents, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Highlighted schedule rows are modeled rate resets. Caps limit increases only. Housing extras are excluded from
          interest. This is an educational projection, not a lender disclosure.
        </p>
      </div>
    </div>
  );
}
