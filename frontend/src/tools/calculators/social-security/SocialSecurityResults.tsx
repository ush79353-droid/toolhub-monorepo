'use client';

import * as React from 'react';
import { formatUsd } from './calculation';
import type { SocialSecurityResult } from './types';

interface SocialSecurityResultsProps {
  result: SocialSecurityResult | null;
}

export function SocialSecurityResults({ result }: SocialSecurityResultsProps) {
  const [showTable, setShowTable] = React.useState(false);

  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Full retirement age</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.fraLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Ideal application age</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.idealClaimAge}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Starting monthly at ideal age</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIdealStartingMonthly}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Cumulative benefits (nominal)
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIdealCumulative}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Invested value at life expectancy
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIdealInvested}
          </dd>
        </div>
        {result.formattedBreakEvenVs62 ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Nominal break-even vs age 62
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedBreakEvenVs62}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Ideal age maximizes the future value of COLA-adjusted checks invested at{' '}
        {result.annualReturnPercent}% / yr through age {result.lifeExpectancy}.
        PIA used: {result.formattedPiaMonthly}/mo at FRA.
      </p>

      <button
        type="button"
        className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
        onClick={() => setShowTable((v) => !v)}
        aria-expanded={showTable}
      >
        {showTable ? 'Hide' : 'Show'} ages 62–70 comparison
      </button>

      {showTable ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-2.5 py-2 font-medium">Age</th>
                <th className="px-2.5 py-2 font-medium">Start $/mo</th>
                <th className="px-2.5 py-2 font-medium">% of PIA</th>
                <th className="px-2.5 py-2 font-medium">Nominal Σ</th>
                <th className="px-2.5 py-2 font-medium">Invested @ LE</th>
              </tr>
            </thead>
            <tbody>
              {result.scenarios.map((s) => {
                const isIdeal = s.claimAge === result.idealClaimAge;
                return (
                  <tr
                    key={s.claimAge}
                    className={
                      isIdeal
                        ? 'bg-brand-softTeal/50 font-medium text-accent'
                        : 'text-accent'
                    }
                  >
                    <td className="px-2.5 py-1.5 tabular-nums">{s.claimAge}</td>
                    <td className="px-2.5 py-1.5 tabular-nums">
                      {formatUsd(s.startingMonthlyBenefit)}
                    </td>
                    <td className="px-2.5 py-1.5 tabular-nums">
                      {(s.multiplier * 100).toFixed(1)}%
                    </td>
                    <td className="px-2.5 py-1.5 tabular-nums">
                      {formatUsd(s.cumulativeNominal)}
                    </td>
                    <td className="px-2.5 py-1.5 tabular-nums">
                      {formatUsd(s.investedTerminalValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-amber-900/90" role="note">
        {result.disclaimer}
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Rules: {result.rulesEffective}. {result.rulesSource}
      </p>
    </div>
  );
}
