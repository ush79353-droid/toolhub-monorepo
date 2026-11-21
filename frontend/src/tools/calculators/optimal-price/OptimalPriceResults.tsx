'use client';

import Link from 'next/link';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { OptimalPriceResult } from './types';

interface OptimalPriceResultsProps {
  result: OptimalPriceResult | null;
}

export function OptimalPriceResults({ result }: OptimalPriceResultsProps) {
  const [open, setOpen] = useState(false);
  if (!result) return null;
  const symbol = getCurrencySymbol(result.currency);
  const noOpt = result.status === 'noFiniteOptimum';

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Pricing summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Constant elasticity</dt>
          <dd className="tabular-nums text-accent">
            {result.formattedConstantElasticity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Optimal price</dt>
          <dd
            className={`tabular-nums ${noOpt ? 'text-rose-700' : 'text-accent'}`}
          >
            {noOpt
              ? 'Unavailable'
              : `${symbol}${result.formattedOptimalPrice}`}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Optimal quantity</dt>
          <dd
            className={`tabular-nums ${noOpt ? 'text-rose-700' : 'text-accent'}`}
          >
            {noOpt ? 'Unavailable' : result.formattedOptimalQuantity}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-1.5">
          <dt className="font-medium text-accent">Profit at optimum</dt>
          <dd
            className={`font-semibold tabular-nums ${
              noOpt ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {noOpt
              ? 'Unavailable'
              : `${symbol}${result.formattedProfitAtOptimal}`}
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        P* = MC × ε/(ε+1) · Q* = Q₀(P*/P₀)^ε · π = (P−MC)Q
      </p>

      <div className="mt-3 rounded-lg border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-accent"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Optimal price calculation breakdown
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
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Marginal cost
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedMarginalCost}
                  </td>
                </tr>
                {result.formattedMarginalRevenue ? (
                  <tr>
                    <td className="py-1 pr-2 text-muted-foreground">
                      Observed MR
                    </td>
                    <td className="py-1 text-right">
                      {symbol}
                      {result.formattedMarginalRevenue}
                    </td>
                  </tr>
                ) : null}
                {result.formattedImpliedMr ? (
                  <tr>
                    <td className="py-1 pr-2 text-muted-foreground">
                      Implied MR @ P₁
                    </td>
                    <td className="py-1 text-right">
                      {symbol}
                      {result.formattedImpliedMr}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Initial price / qty
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedInitialPrice} / {result.initialQuantity}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Final price / qty
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedFinalPrice} / {result.finalQuantity}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Constant elasticity
                  </td>
                  <td className="py-1 text-right">
                    {result.formattedConstantElasticity}
                  </td>
                </tr>
                {result.formattedMidpointElasticity ? (
                  <tr>
                    <td className="py-1 pr-2 text-muted-foreground">
                      Midpoint elasticity
                    </td>
                    <td className="py-1 text-right">
                      {result.formattedMidpointElasticity}
                    </td>
                  </tr>
                ) : null}
                <tr className="border-t border-border font-semibold">
                  <td className="py-1 pr-2">Optimal price / qty</td>
                  <td className="py-1 text-right">
                    {noOpt
                      ? '—'
                      : `${symbol}${result.formattedOptimalPrice} / ${result.formattedOptimalQuantity}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Profit @ initial
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedProfitAtInitial}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-2 text-muted-foreground">
                    Profit @ final
                  </td>
                  <td className="py-1 text-right">
                    {symbol}
                    {result.formattedProfitAtFinal}
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-1 pr-2">Profit @ optimal</td>
                  <td className="py-1 text-right">
                    {noOpt
                      ? '—'
                      : `${symbol}${result.formattedProfitAtOptimal}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {result.warningMessage ? (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            noOpt || result.status === 'mrInconsistent'
              ? 'text-rose-700'
              : 'text-amber-800'
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
          href="/tools/cross-price-elasticity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cross Price Elasticity
        </Link>
        {' · '}
        <Link
          href="/tools/lerner-index-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Lerner Index
        </Link>
        .
      </p>
    </div>
  );
}
