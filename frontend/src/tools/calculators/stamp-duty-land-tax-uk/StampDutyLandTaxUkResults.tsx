'use client';

import { useState } from 'react';
import Link from 'next/link';
import { buyerScenarioLabel } from './rates';
import type { StampDutyLandTaxUkResult } from './types';

interface StampDutyLandTaxUkResultsProps {
  result: StampDutyLandTaxUkResult | null;
}

export function StampDutyLandTaxUkResults({
  result,
}: StampDutyLandTaxUkResultsProps) {
  const [showBands, setShowBands] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Estimate summary</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        £{result.formattedStampDuty}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Rates schedule</dt>
          <dd className="text-right font-medium text-accent">
            {result.scheduleLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Buyer</dt>
          <dd className="text-right font-medium text-accent">
            {buyerScenarioLabel(result.buyerScenario)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Residency</dt>
          <dd className="font-medium text-accent">
            {result.residency === 'uk' ? 'UK resident' : 'Non-UK resident'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Property price</dt>
          <dd className="tabular-nums font-medium text-accent">
            £{result.formattedPropertyPrice}
          </dd>
        </div>
        {result.usedFirstTimeBuyerRelief ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Relief</dt>
            <dd className="font-medium text-accent">First-time buyer</dd>
          </div>
        ) : null}
        {result.usedHigherRates ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Higher rates</dt>
            <dd className="font-medium text-accent">+5 pp applied</dd>
          </div>
        ) : null}
        {result.nonResidentSurchargeApplied ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Non-resident</dt>
            <dd className="font-medium text-accent">+2 pp surcharge</dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <button
        type="button"
        onClick={() => setShowBands((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showBands ? 'Hide band breakdown' : 'Show band-by-band breakdown'}
      </button>
      {showBands ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[280px] text-left text-xs">
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Band</th>
                <th className="px-3 py-2 font-medium">Portion</th>
                <th className="px-3 py-2 font-medium">Rate</th>
                <th className="px-3 py-2 font-medium">Tax</th>
              </tr>
            </thead>
            <tbody>
              {result.bands.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <td className="px-3 py-2 text-accent">{row.label}</td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    £{row.formattedPortion}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    {row.formattedRate}
                  </td>
                  <td className="px-3 py-2 tabular-nums text-accent">
                    £{row.formattedTax}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ol className="list-decimal space-y-1 px-3 py-2 pl-7 text-xs leading-relaxed text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/capital-gains-tax-uk-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Capital Gains Tax UK
        </Link>
        {' · '}
        <Link
          href="/tools/national-insurance-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          National Insurance
        </Link>
      </p>
    </div>
  );
}
