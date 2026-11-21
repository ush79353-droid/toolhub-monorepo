import {
  APPLICABLE_CREDIT_AMOUNT_2026,
  formatEstateUsd,
} from './calculation';
import type { EstateTaxResult } from './types';

interface EstateTaxResultsProps {
  result: EstateTaxResult;
}

export function EstateTaxResults({ result }: EstateTaxResultsProps) {
  const rows: { label: string; value: string; emphasize?: boolean }[] = [
    { label: 'Total gross estate', value: `$${result.formattedGrossEstate}` },
    {
      label: 'Allowable deductions',
      value: `$${result.formattedAllowableDeductions}`,
    },
    {
      label: 'Estimated taxable estate',
      value: `$${result.formattedTaxableEstate}`,
    },
    {
      label: 'Applicable estate tax exemption (2026 BEA)',
      value: `$${result.formattedBasicExclusion}`,
    },
    {
      label: 'Estimated federal estate tax',
      value: `$${result.formattedFederalEstateTax}`,
      emphasize: true,
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <dl className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 py-1.5 last:border-b-0"
          >
            <dt className="text-xs text-muted-foreground sm:text-sm">{row.label}</dt>
            <dd
              className={`text-sm tabular-nums text-accent ${
                row.emphasize ? 'text-base font-semibold' : 'font-medium'
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Applicable credit amount on the 2026 basic exclusion: $
        {formatEstateUsd(APPLICABLE_CREDIT_AMOUNT_2026)}. Tax-free lifetime gifts ($
        {formatEstateUsd(result.taxFreeLifetimeGifts)}) are shown for context only and are
        not modeled as adjusted taxable gifts.
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Many states impose their own estate or inheritance taxes. This tool estimates{' '}
        <strong className="font-medium text-accent">federal</strong> estate tax only and
        does not determine individual eligibility, marital deductions, DSUE/portability,
        special-use valuation, or a complete Form 706. Educational estimate — not tax
        advice.
      </p>
    </div>
  );
}
