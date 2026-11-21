import type { SkinfoldBodyFatResult } from './types';

interface SkinfoldBodyFatResultsProps {
  result: SkinfoldBodyFatResult | null;
}

export function SkinfoldBodyFatResults({ result }: SkinfoldBodyFatResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-2 rounded-xl border border-border bg-white px-4 py-3 text-[13px] leading-relaxed text-foreground/85 sm:text-sm">
      <p>
        Estimated body fat:{' '}
        <span className="font-semibold text-accent">
          {result.formattedBodyFatPercent}%
        </span>{' '}
        ({result.sex}, age band {result.ageBandLabel}).
      </p>
      <p className="font-mono text-xs text-muted-foreground sm:text-[13px]">
        {result.formulaNote}
      </p>
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
    </div>
  );
}
