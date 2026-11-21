import type { AmoxicillinPediatricDosageResult } from './types';

interface AmoxicillinPediatricDosageResultsProps {
  result: AmoxicillinPediatricDosageResult | null;
}

/** Compact supporting readout — primary answers live in the Check your dosage fields. */
export function AmoxicillinPediatricDosageResults({
  result,
}: AmoxicillinPediatricDosageResultsProps) {
  if (!result || !result.regimenAvailable || result.doseMg == null) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-border bg-muted/15 px-4 py-3 text-sm text-accent"
      aria-live="polite"
    >
      <p className="text-[13px] font-semibold">Suggested single dose</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">
        {result.formattedDoseMg} mg
        {result.formattedDoseMl ? (
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            ({result.formattedDoseMl} mL oral)
          </span>
        ) : null}
      </p>
    </div>
  );
}
