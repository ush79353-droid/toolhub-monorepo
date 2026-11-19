'use client';

import type { OhioSalesTaxResult } from './types';

interface OhioSalesTaxResultsProps {
  result: OhioSalesTaxResult | null;
}

export function OhioSalesTaxResults({ result }: OhioSalesTaxResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Enter a purchase amount and an Ohio ZIP code to check rate availability.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
      <h3 className="text-[13px] font-semibold text-accent">Results</h3>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
        <p className="font-semibold">Combined sales tax rate unavailable</p>
        <p className="mt-1.5 text-xs leading-relaxed text-amber-900/90">
          {result.unavailableMessage}
        </p>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Purchase amount</dt>
          <dd className="font-medium tabular-nums text-accent">
            ${result.formattedPurchaseAmount}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">ZIP code</dt>
          <dd className="font-medium tabular-nums text-accent">{result.zipCode}</dd>
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
        Fixed USD. Exemptions and special product rules are not inferred from these
        two inputs.
      </p>
    </div>
  );
}
