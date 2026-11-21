'use client';

import type { AltmanZScoreResult } from './types';

interface AltmanZScoreChartProps {
  result: AltmanZScoreResult;
}

/** Horizontal distress / grey / safer scale with marker (illustrative span). */
export function AltmanZScoreChart({ result }: AltmanZScoreChartProps) {
  const min = 0;
  const max = 5;
  const clamped = Math.min(max, Math.max(min, result.zScore));
  const pct = ((clamped - min) / (max - min)) * 100;
  const offScale = result.zScore < min || result.zScore > max;

  return (
    <figure className="mt-3 space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Z-Score classification scale (illustrative 0–5 axis)
      </figcaption>
      <div
        className="relative h-8 w-full overflow-hidden rounded-lg border border-border"
        role="img"
        aria-label={`Z-Score ${result.formattedZScore} in the ${result.riskLabel}. Distress below 1.81, grey 1.81–2.99, safer above 2.99.`}
      >
        <div className="absolute inset-0 flex">
          <div
            className="bg-rose-200/80"
            style={{ width: `${(1.81 / max) * 100}%` }}
            title="Distress"
          />
          <div
            className="bg-amber-200/80"
            style={{ width: `${((2.99 - 1.81) / max) * 100}%` }}
            title="Grey"
          />
          <div className="flex-1 bg-emerald-200/80" title="Safer" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-accent"
          style={{ left: `calc(${pct}% - 1px)` }}
        />
        <div
          className="absolute -top-0.5 h-9 w-2 -translate-x-1/2 rounded-sm bg-accent"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <li>
          <span className="font-medium text-rose-700">Distress</span> Z &lt; 1.81
        </li>
        <li>
          <span className="font-medium text-amber-700">Grey</span> 1.81–2.99
        </li>
        <li>
          <span className="font-medium text-emerald-700">Safer</span> Z &gt; 2.99
        </li>
        {offScale ? (
          <li>Marker clamped to axis; actual Z = {result.formattedZScore}</li>
        ) : null}
      </ul>
    </figure>
  );
}
