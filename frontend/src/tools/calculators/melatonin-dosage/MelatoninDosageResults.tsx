import type { MelatoninDosageResult } from './types';

interface MelatoninDosageResultsProps {
  result: MelatoninDosageResult | null;
}

export function MelatoninDosageResults({ result }: MelatoninDosageResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
        Choose an indication and medication type to see label information. Leave
        therapy duration blank unless you want a course-length check — no dose is
        inferred from empty defaults.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white px-4 py-4 text-sm leading-relaxed text-accent sm:text-[15px]">
      {result.mismatchMessage ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-[13px] text-amber-950">
          {result.mismatchMessage}
        </p>
      ) : null}

      <p>
        <span className="font-semibold">{result.headline}</span>
      </p>

      <p className="text-[13px] text-muted-foreground">
        {result.indicationLabel} · {result.medicationLabel}
      </p>

      {result.scheduleLines.length > 0 ? (
        <ul className="list-disc space-y-1.5 pl-5">
          {result.scheduleLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {result.durationLines.length > 0 ? (
        <div className="space-y-1 border-t border-border pt-3">
          {result.durationLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}

      {result.unitLines.length > 0 ? (
        <div className="space-y-1">
          {result.unitLines.map((line) => (
            <p key={line} className="font-medium">
              {line}
            </p>
          ))}
        </div>
      ) : null}

      <ul className="space-y-1.5 border-t border-border pt-3 text-[13px] text-foreground/85">
        {result.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
    </div>
  );
}
