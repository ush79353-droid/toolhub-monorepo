'use client';

import { useState } from 'react';
import { formatCurrencyValue } from '@/tools/shared/currency';
import { fmt } from './calculation';
import type { TicketOptimizerResult, TicketType } from './types';

interface TicketOptimizerResultsProps {
  result: TicketOptimizerResult | null;
}

const TYPE_LABEL: Record<TicketType, string> = {
  single: 'Single tickets',
  shortTerm: 'Short-term passes',
  longTerm: 'Long-term passes',
};

export function TicketOptimizerResults({
  result,
}: TicketOptimizerResultsProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
        Enter trips, travel duration, and ticket prices to find the cheapest
        valid combination.
      </div>
    );
  }

  const money = (n: number) => formatCurrencyValue(n, result.currency);

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Cheapest ticket combination
      </h3>

      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.minimumCostDisplay}
        <span className="ml-1.5 text-sm font-normal text-muted-foreground">
          minimum total
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total required trips</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.totalTrips}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Individual tickets only</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.individualCostDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Recommended total</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.minimumCostDisplay}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total savings</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.savingsDisplay}
            {result.savingsPercentage != null
              ? ` (${fmt(result.savingsPercentage, 1)}%)`
              : ''}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average cost per trip</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.averageCostDisplay ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tickets to purchase</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.ticketsPurchased}
          </dd>
        </div>
      </dl>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[280px] text-left text-xs sm:text-sm">
          <caption className="sr-only">Recommended ticket breakdown</caption>
          <thead className="border-b border-border bg-muted/30 text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">
                Ticket type
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Qty
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {result.recommendations.map((row) => (
              <tr key={row.ticketType} className="border-b border-border/60">
                <td className="px-3 py-2 text-accent">
                  {TYPE_LABEL[row.ticketType]}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-accent">
                  {row.quantity}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-accent">
                  {money(row.totalPrice)}
                </td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="px-3 py-2 text-accent">Total</td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-right tabular-nums text-accent">
                {result.minimumCostDisplay}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {result.strategies.length > 1 ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[280px] text-left text-xs sm:text-sm">
            <caption className="sr-only">Strategy comparison</caption>
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  Strategy
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Cost
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Savings
                </th>
              </tr>
            </thead>
            <tbody>
              {result.strategies.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-border/60 ${
                    s.isOptimal ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-3 py-2 text-accent">
                    {s.label}
                    {s.isOptimal ? (
                      <span className="ml-1 text-[11px] font-medium text-primary">
                        (cheapest)
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-accent">
                    {money(s.totalCost)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-accent">
                    {money(s.savings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {result.scheduleAssumption}
      </p>
      {result.tieBreakNote ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {result.tieBreakNote}
        </p>
      ) : null}

      <button
        type="button"
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        onClick={() => setShowSteps((v) => !v)}
      >
        {showSteps ? 'Hide' : 'Show'} formula breakdown
      </button>
      {showSteps && result.formulaSteps.length ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-white p-3 font-mono text-xs leading-relaxed text-accent">
          {result.formulaSteps.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}
