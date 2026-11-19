import type { NewJerseySalesTaxResult } from './types';

interface NewJerseySalesTaxResultsProps {
  result: NewJerseySalesTaxResult | null;
}

export function NewJerseySalesTaxResults({ result }: NewJerseySalesTaxResultsProps) {
  if (!result) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>
        <p className="text-sm text-muted-foreground">
          Enter a purchase amount and a valid New Jersey ZIP code to estimate sales tax.
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
          <dt className="text-muted-foreground">Applicable rate</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedTaxRatePercent}%
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Sales tax</dt>
          <dd className="tabular-nums font-semibold text-accent">
            ${result.formattedSalesTax}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2.5">
          <dt className="font-medium text-accent">Total with tax</dt>
          <dd className="tabular-nums text-base font-bold text-accent">
            ${result.formattedTotalAmount}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">{result.rateLabel}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Product-specific exemptions and Urban Enterprise Zone reduced rates are not determined
        from purchase amount and ZIP alone. Figures assume a standard taxable New Jersey purchase
        at the statewide rate.
      </p>
    </div>
  );
}
