'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { PriceElasticityOfDemandResult } from './types';

interface PriceElasticityOfDemandResultsProps {
  result: PriceElasticityOfDemandResult | null;
}

export function PriceElasticityOfDemandResults({
  result,
}: PriceElasticityOfDemandResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(result.currency);
  const undefinedPed = result.status === 'undefinedElasticity';
  const hasPed = result.formattedPriceElasticity != null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">PED summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Price elasticity</dt>
          <dd
            className={`tabular-nums ${
              undefinedPed ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {hasPed ? result.formattedPriceElasticity : 'Unavailable'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Elasticity</dt>
          <dd className="text-right text-accent">
            {result.classification !== 'unavailable'
              ? result.classificationLabel
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="text-muted-foreground">Initial revenue</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedInitialRevenue
              ? `${symbol}${result.formattedInitialRevenue}`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Final revenue</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedFinalRevenue
              ? `${symbol}${result.formattedFinalRevenue}`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="font-medium text-accent">Revenue increase</dt>
          <dd className="font-semibold tabular-nums text-accent">
            {result.formattedRevenueIncrease ??
              result.revenueIncreaseUndefinedReason ??
              '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        PED = (%ΔQ mid) / (%ΔP mid) · R = P × Q
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Calculation breakdown
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {open ? (
          <div className="overflow-x-auto border-t border-border px-3 py-2">
            <table className="w-full min-w-[16rem] text-left text-xs">
              <tbody className="tabular-nums text-accent">
                {result.formattedPriceChange != null ? (
                  <>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        Price change
                      </td>
                      <td className="py-1 text-right">
                        {symbol}
                        {result.formattedPriceChange}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        Average price
                      </td>
                      <td className="py-1 text-right">
                        {symbol}
                        {result.formattedAveragePrice}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        % price change
                      </td>
                      <td className="py-1 text-right">
                        {result.formattedPercentPriceChange}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        Quantity change
                      </td>
                      <td className="py-1 text-right">
                        {result.formattedQuantityChange}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        Average quantity
                      </td>
                      <td className="py-1 text-right">
                        {result.formattedAverageQuantity}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 pr-2 text-muted-foreground">
                        % quantity change
                      </td>
                      <td className="py-1 text-right">
                        {result.formattedPercentQuantityChange}
                      </td>
                    </tr>
                  </>
                ) : null}
                <tr>
                  <td className="py-1 pr-2 font-medium text-accent">PED</td>
                  <td className="py-1 text-right font-medium">
                    {result.formattedPriceElasticity ?? 'Unavailable'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Classification
                  </td>
                  <td className="py-1 text-right">
                    {result.classificationLabel}
                  </td>
                </tr>
                {result.formattedRevenueChangeAmount != null ? (
                  <tr>
                    <td className="py-1 pr-2 text-muted-foreground">
                      Revenue change
                    </td>
                    <td className="py-1 text-right">
                      {symbol}
                      {result.formattedRevenueChangeAmount}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            undefinedPed ? 'text-rose-700' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/optimal-price-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Optimal Price
        </Link>
        {' · '}
        <Link
          href="/tools/income-elasticity-of-demand-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Income Elasticity
        </Link>
        {' · '}
        <Link
          href="/tools/cross-price-elasticity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cross Price Elasticity
        </Link>
        .
      </p>
    </div>
  );
}
