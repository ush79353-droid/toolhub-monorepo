'use client';

import type { CaliforniaSalesTaxResult } from './types';

interface CaliforniaSalesTaxResultsProps {
  result: CaliforniaSalesTaxResult | null;
  lookingUp?: boolean;
}

export function CaliforniaSalesTaxResults({
  result,
  lookingUp = false,
}: CaliforniaSalesTaxResultsProps) {
  if (lookingUp) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Looking up the combined sales tax rate from the official CDTFA Tax Rate
        API…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Enter purchase amount, street address, city, and California ZIP to
        estimate sales tax for a generally taxable purchase.
      </div>
    );
  }

  if (result.kind === 'unavailable') {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Results</h3>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
          <p className="font-semibold">Combined sales tax rate unavailable</p>
          <p className="mt-1.5 text-xs leading-relaxed text-amber-900/90">
            {result.unavailableMessage}
          </p>
          {result.candidates.length > 1 ? (
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-amber-900/90">
              {result.candidates.map((c) => (
                <li key={`${c.tac}-${c.rate}`}>
                  {c.jurisdiction} ({c.county} County):{' '}
                  {(c.rate * 100).toFixed(3).replace(/\.?0+$/, '')}%
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Purchase amount</dt>
            <dd className="font-medium tabular-nums text-accent">
              ${result.formattedPurchaseAmount}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Location</dt>
            <dd className="text-right font-medium text-accent">
              {result.streetAddress}, {result.city}, CA {result.zipCode}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Combined rate</dt>
            <dd className="font-medium text-accent">Unavailable</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Sales tax / total</dt>
            <dd className="font-medium text-accent">Not calculated</dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">
          Estimate withheld when CDTFA returns no match or multiple conflicting
          jurisdictions. Rates are never invented.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Purchase amount</dt>
          <dd className="font-medium tabular-nums text-accent">
            ${result.formattedPurchaseAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Combined sales tax rate</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.formattedTaxRatePercent}%
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Estimated sales tax</dt>
          <dd className="font-medium tabular-nums text-accent">
            ${result.formattedSalesTax}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border pt-2">
          <dt className="font-medium text-accent">Estimated total</dt>
          <dd className="text-base font-bold tabular-nums text-accent">
            ${result.formattedTotalAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Jurisdiction</dt>
          <dd className="text-right font-medium text-accent">
            {result.jurisdiction}
            {result.county ? ` · ${result.county} County` : ''}
          </dd>
        </div>
        {result.formattedAddress ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Matched address</dt>
            <dd className="text-right text-xs font-medium text-accent">
              {result.formattedAddress}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Lookup time</dt>
          <dd className="text-xs font-medium tabular-nums text-accent">
            {new Date(result.lookedUpAt).toLocaleString('en-US')}
          </dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Estimate for a generally taxable California purchase using the official
        CDTFA Tax Rate API. Exemptions, special product taxes, and filing
        liability are not calculated. See{' '}
        <a
          className="underline underline-offset-2"
          href="https://www.cdtfa.ca.gov/dataportal/policy.htm"
          target="_blank"
          rel="noreferrer"
        >
          CDTFA Terms of Use
        </a>
        .
      </p>
    </div>
  );
}
