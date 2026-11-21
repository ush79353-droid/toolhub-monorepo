import type { WeightPercentileResult } from './types';

interface WeightPercentileResultsProps {
  result: WeightPercentileResult | null;
}

export function WeightPercentileResults({
  result,
}: WeightPercentileResultsProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-5">
      <h3 className="text-[15px] font-semibold text-accent">Results</h3>
      <p className="mt-1 text-xs italic text-muted-foreground">
        {result?.sourceLabel ??
          "This tool is based on WHO's child growth standards."}
      </p>

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
              <dt className="text-muted-foreground">Weight</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.formattedWeightKg} kg
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">z-score</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.formattedZScore}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">
                WHO median weight (same age/sex)
              </dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.medianWeightKg.toFixed(2)} kg
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.disclaimer}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Enter age and weight to see the WHO weight-for-age percentile.
        </p>
      )}
    </div>
  );
}
