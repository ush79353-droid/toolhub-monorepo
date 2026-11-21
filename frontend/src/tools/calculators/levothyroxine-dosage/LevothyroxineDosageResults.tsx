import type { LevothyroxineDosageResult } from './types';

interface Props {
  result: LevothyroxineDosageResult | null;
}

export function LevothyroxineDosageResults({ result }: Props) {
  const doseDisplay =
    result?.doseMcgPerDay != null && Number.isFinite(result.doseMcgPerDay)
      ? String(result.doseMcgPerDay)
      : '';

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-4 sm:p-5">
      <div>
        <p className="mb-1.5 text-[13px] font-medium text-accent">
          Levothyroxine dose
        </p>
        <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
          <input
            type="text"
            readOnly
            aria-label="Levothyroxine dose mcg per day"
            className="h-11 w-full min-w-0 bg-transparent text-sm tabular-nums text-accent outline-none"
            value={doseDisplay}
            placeholder=""
          />
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            mcg per day
          </span>
        </div>
      </div>

      {result ? (
        <div className="space-y-2 border-t border-border pt-3 text-sm">
          <p className="font-semibold text-accent">{result.statusHeadline}</p>
          <p className="leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
          {result.weightKg != null || result.idealBodyWeightKg != null ? (
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
              {result.weightKg != null ? (
                <li>Actual weight: {result.weightKg.toFixed(1)} kg</li>
              ) : null}
              {result.idealBodyWeightKg != null ? (
                <li>
                  Devine ideal body weight: {result.idealBodyWeightKg.toFixed(1)}{' '}
                  kg
                </li>
              ) : null}
              {result.dosingWeightKg != null ? (
                <li>
                  Dosing weight (lesser of actual and IBW):{' '}
                  {result.dosingWeightKg.toFixed(1)} kg
                </li>
              ) : null}
            </ul>
          ) : null}
          {result.educationalLines.length > 0 ? (
            <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-foreground/85">
              {result.educationalLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
          <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
        </div>
      ) : null}
    </div>
  );
}
