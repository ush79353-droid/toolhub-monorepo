import type { AleveDosageResult } from './types';

interface AleveDosageResultsProps {
  result: AleveDosageResult | null;
}

export function AleveDosageResults({ result }: AleveDosageResultsProps) {
  if (!result) {
    return (
      <div className="rounded-xl border border-border bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
        Choose an indication and drug type to see the labeled schedule summary.
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
        <span className="font-semibold">{result.typicalDosageLine}</span>
      </p>

      <p>{result.unitEquivalenceLine}</p>

      {result.initialLine ? (
        <p className="italic text-foreground/90">{result.initialLine}</p>
      ) : null}

      {result.followUpBullets.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 italic text-foreground/90">
          {result.followUpBullets.map((b) => (
            <li key={b.text}>{b.text}</li>
          ))}
        </ul>
      ) : null}

      {result.maxLines.length > 0 ? (
        <div className="space-y-1">
          {result.maxLines.map((line) => (
            <p key={line} className="font-medium">
              {line}
            </p>
          ))}
        </div>
      ) : null}

      <p className="text-[13px] text-muted-foreground">{result.saltNote}</p>

      <ul className="space-y-1.5 border-t border-border pt-3 text-[13px] text-foreground/85">
        {result.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
    </div>
  );
}
