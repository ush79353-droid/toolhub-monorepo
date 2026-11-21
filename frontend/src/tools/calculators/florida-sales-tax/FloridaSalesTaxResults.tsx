import type { FloridaSalesTaxResult } from './types';

interface FloridaSalesTaxResultsProps {
  result: FloridaSalesTaxResult | null;
}

export function FloridaSalesTaxResults({ result }: FloridaSalesTaxResultsProps) {
  if (!result) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>
        <p className="text-sm text-muted-foreground">
          Enter a purchase amount and a Florida ZIP code to estimate state sales
          tax and county discretionary surtax.
        </p>
      </div>
    );
  }

  if (result.status === 'ambiguous' || result.status === 'county_required') {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>
        <p className="text-sm font-semibold text-accent">
          Select a county to continue
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.rateLabel}
        </p>
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.candidateCounties.map((c) => (
            <li key={c.fips}>{c.name} County</li>
          ))}
        </ul>
      </div>
    );
  }

  if (result.status === 'zip_unknown') {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>
        <p className="text-sm font-semibold text-accent">
          County rate unavailable for this ZIP
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.rateLabel}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
        Results
      </div>

      <dl className="space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">County</dt>
          <dd className="font-semibold text-accent">
            {result.countyName} County
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Combined rate</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedCombinedRatePercent}%
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">State sales tax (6%)</dt>
          <dd className="tabular-nums font-semibold text-accent">
            ${result.formattedStateTax}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">
            County discretionary surtax ({result.formattedSurtaxRatePercent}%)
          </dt>
          <dd className="tabular-nums font-semibold text-accent">
            ${result.formattedCountySurtax}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Total estimated sales tax</dt>
          <dd className="tabular-nums font-semibold text-accent">
            ${result.formattedTotalTax}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2.5">
          <dt className="font-medium text-accent">Total with tax</dt>
          <dd className="tabular-nums text-base font-bold text-accent">
            ${result.formattedTotalAmount}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.rateLabel}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.assumptionNote}
      </p>
    </div>
  );
}
