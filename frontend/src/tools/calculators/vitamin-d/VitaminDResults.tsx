'use client';

import { formatMeasure } from './calculation';
import type { VitaminDResult } from './types';

const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const labelClass = 'text-[13px] font-medium text-accent';

interface Props {
  result: VitaminDResult | null;
}

export function VitaminDResults({ result }: Props) {
  if (!result) return null;

  const dri = result.dri;
  const serum = result.serum;

  return (
    <section
      className={sectionClass}
      aria-live="polite"
      aria-label="Vitamin D results"
    >
      <h3 className="text-sm font-semibold text-accent">
        {result.statusHeadline}
      </h3>

      {dri ? (
        <div className="space-y-1.5 text-sm text-accent">
          <p className={labelClass}>
            Dietary reference intake ({dri.lifeStageLabel})
          </p>
          <p>
            <span className="font-semibold uppercase">{dri.kind}</span>
            {': '}
            <span className="font-semibold tabular-nums">
              {formatMeasure(dri.mcgPerDay)} mcg/day
            </span>
            {' ('}
            <span className="tabular-nums">
              {formatMeasure(dri.iuPerDay, 0)} IU/day
            </span>
            )
          </p>
          {dri.ulMcgPerDay != null ? (
            <p className="text-xs text-muted-foreground">
              Tolerable Upper Intake Level (UL):{' '}
              {formatMeasure(dri.ulMcgPerDay)} mcg/day (
              {formatMeasure(dri.ulIuPerDay ?? 0, 0)} IU/day) — not a target
              dose.
            </p>
          ) : null}
        </div>
      ) : null}

      {serum ? (
        <div className="space-y-1.5 border-t border-border pt-3 text-sm text-accent">
          <p className={labelClass}>
            Serum {serum.analyteLabel} (separate from DRI)
          </p>
          <p className="tabular-nums">
            {formatMeasure(serum.valueNgPerMl)} ng/mL ·{' '}
            {formatMeasure(serum.valueNmolPerL)} nmol/L
          </p>
          <p className="font-semibold">{serum.bandLabel}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {serum.detail}
          </p>
        </div>
      ) : null}

      {!dri && !serum ? (
        <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
      ) : (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.statusDetail}
        </p>
      )}

      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
    </section>
  );
}
