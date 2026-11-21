import Link from 'next/link';
import { RELATED_PERCENTILE_LINKS } from './content';
import type { BmiPercentileResult } from './types';

interface BmiPercentileResultsProps {
  result: BmiPercentileResult | null;
}

export function BmiPercentileResults({ result }: BmiPercentileResultsProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <h3 className="text-[15px] font-semibold text-accent">Result</h3>

      {result ? (
        <div className="mt-3 space-y-2">
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {result.formattedPercentile}
            <span className="ml-1 text-base font-medium text-muted-foreground">
              percentile
            </span>
          </p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            <div>
              <dt className="text-muted-foreground">BMI</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.formattedBmi} kg/m²
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">z-score</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.formattedZScore}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">WHO median BMI (same age/sex)</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.medianBmi.toFixed(2)} kg/m²
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Enter age and BMI (or height and weight) to see the WHO BMI-for-age
          percentile.
        </p>
      )}

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-sm font-medium text-accent">
          Check out other percentile calculators:
        </p>
        <ul className="mt-2 space-y-1.5">
          {RELATED_PERCENTILE_LINKS.map((item) => (
            <li key={item.href} className="flex items-center gap-2 text-sm">
              <span className="text-primary" aria-hidden>
                ✓
              </span>
              <Link
                href={item.href}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {result?.sourceLabel ??
            "This tool is based on WHO's child growth standards."}
        </p>
      </div>
    </div>
  );
}
