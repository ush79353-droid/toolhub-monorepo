'use client';

import type { DrugHalfLifeResult } from './types';
import { DOSAGE_MASS_UNIT_LABELS, HALF_LIFE_TIME_UNIT_LABELS } from './types';

interface Props {
  result: DrugHalfLifeResult | null;
}

function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.001 || abs >= 1_000_000)) {
    return value.toExponential(3);
  }
  const digits = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  return Number(value.toPrecision(digits)).toLocaleString('en-US', {
    maximumFractionDigits: 8,
  });
}

function formatConcentrationPct(fraction: number): string {
  if (!Number.isFinite(fraction)) return '—';
  const pct = fraction * 100;
  if (pct >= 1) return `${pct.toFixed(2)}%`;
  if (pct >= 0.01) return `${pct.toFixed(4)}%`;
  return `${pct.toExponential(2)}%`;
}

function formatElapsed(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Number.isInteger(value)) return String(value);
  return Number(value.toPrecision(8)).toString();
}

export function DrugHalfLifeResults({ result }: Props) {
  if (!result) return null;

  const timeLabel = HALF_LIFE_TIME_UNIT_LABELS[result.timeUnit];
  const doseLabel = DOSAGE_MASS_UNIT_LABELS[result.dosageUnit];

  if (result.cycles.length === 0) {
    return (
      <section
        className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-accent">{result.statusHeadline}</p>
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      </section>
    );
  }

  return (
    <section
      className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
      aria-live="polite"
      aria-label="Half-life elimination table"
    >
      <div>
        <p className="text-sm font-semibold text-accent">{result.statusHeadline}</p>
        <p className="mt-1 text-xs text-muted-foreground">{result.statusDetail}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[280px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Cycle
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Time ({timeLabel})
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Dosage ({doseLabel})
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Concentration
              </th>
            </tr>
          </thead>
          <tbody>
            {result.cycles.map((row) => (
              <tr key={row.cycleIndex} className="border-t border-border">
                <td className="px-3 py-2 tabular-nums text-accent">{row.cycleIndex}</td>
                <td className="px-3 py-2 tabular-nums text-accent">
                  {formatElapsed(row.elapsedTime)}
                </td>
                <td className="px-3 py-2 tabular-nums text-accent">
                  {formatMass(row.remainingDosage)}
                </td>
                <td className="px-3 py-2 tabular-nums text-accent">
                  {formatConcentrationPct(row.concentrationFraction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{result.assumptions}</p>
      <p className="text-xs italic leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </section>
  );
}
