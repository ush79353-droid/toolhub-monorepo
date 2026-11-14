'use client';

import * as React from 'react';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { CompoundGrowthChart } from './CompoundGrowthChart';
import type { CompoundGrowthInput, CompoundGrowthResult } from './types';

interface CompoundGrowthResultsProps {
  input: CompoundGrowthInput;
  result: CompoundGrowthResult | null;
}

function moneyCell(symbol: string, value: string) {
  return (
    <td className="px-2.5 py-2 text-right tabular-nums text-accent">
      {symbol}
      {value}
    </td>
  );
}

export function CompoundGrowthResults({ input, result }: CompoundGrowthResultsProps) {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  if (!result) return null;

  const symbol = getCurrencySymbol(input.currency);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <p className="text-sm leading-relaxed text-accent">
          The final balance is{' '}
          <span className="font-semibold">
            {symbol}
            {result.formattedFinalBalance}
          </span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-accent">
          The total compounded growth is{' '}
          <span className="font-semibold">
            {symbol}
            {result.formattedTotalCompoundedGrowth}
          </span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Compounded growth = final balance − total deposits (initial + additional).
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-muted/40 text-left text-muted-foreground">
            <tr>
              <th className="px-2.5 py-2 font-medium"> </th>
              <th className="px-2.5 py-2 text-right font-medium">Initial deposit</th>
              <th className="px-2.5 py-2 text-right font-medium">Additional</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <th className="px-2.5 py-2 text-left font-medium text-accent">Principal balance</th>
              {moneyCell(symbol, result.formattedInitialPrincipal)}
              {moneyCell(symbol, result.formattedAdditionalPrincipal)}
            </tr>
            <tr className="border-t border-border">
              <th className="px-2.5 py-2 text-left font-medium text-accent">Compound growth</th>
              {moneyCell(symbol, result.formattedGrowthOnInitial)}
              {moneyCell(symbol, result.formattedGrowthOnAdditional)}
            </tr>
            <tr className="border-t border-border">
              <th className="px-2.5 py-2 text-left font-medium text-accent">Final balance</th>
              {moneyCell(symbol, result.formattedFinalInitial)}
              {moneyCell(symbol, result.formattedFinalAdditional)}
            </tr>
          </tbody>
        </table>
      </div>

      <CompoundGrowthChart years={result.years} />

      <div>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          onClick={() => setShowBreakdown((v) => !v)}
          aria-expanded={showBreakdown}
        >
          {showBreakdown ? 'Hide yearly breakdown' : 'Yearly breakdown'}
        </button>
        {showBreakdown ? (
          <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-border">
            <table className="min-w-full text-xs">
              <thead className="sticky top-0 bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-2 py-1.5 font-medium">Year</th>
                  <th className="px-2 py-1.5 text-right font-medium">Add. principal</th>
                  <th className="px-2 py-1.5 text-right font-medium">Growth (init.)</th>
                  <th className="px-2 py-1.5 text-right font-medium">Growth (add.)</th>
                  <th className="px-2 py-1.5 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.years.map((row) => (
                  <tr key={row.year} className="border-t border-border">
                    <td className="px-2 py-1.5 tabular-nums">{row.year}</td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {symbol}
                      {row.additionalPrincipal.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {symbol}
                      {row.growthOnInitial.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">
                      {symbol}
                      {row.growthOnAdditional.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums font-medium">
                      {symbol}
                      {row.balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
