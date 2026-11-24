'use client';

import type { FiberInput, FiberResult } from './types';
import { formatFiberGrams, OptimumLabel } from './FiberForm';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

interface Props {
  input: FiberInput;
  result: FiberResult | null;
  onFiberUnitChange?: (unit: FiberInput['fiberUnit']) => void;
}

export function FiberResults({ input, result, onFiberUnitChange }: Props) {
  if (!result) return null;

  const hasOptimum = result.energyScaledFiberG != null;

  return (
    <section className={sectionClass} aria-live="polite" aria-label="Fiber per day">
      <h3 className="text-sm font-semibold text-accent">Fiber per day</h3>

      <div>
        <label className={labelClass} htmlFor="fiber-optimum">
          <OptimumLabel />
        </label>
        <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/20">
          <input
            id="fiber-optimum"
            className={inputClass}
            readOnly
            value={formatFiberGrams(result.energyScaledFiberG)}
            aria-label="Recommended optimum fiber"
          />
          <select
            className={unitSelectClass}
            value={input.fiberUnit}
            onChange={(e) =>
              onFiberUnitChange?.(e.target.value as FiberInput['fiberUnit'])
            }
            aria-label="Fiber unit"
          >
            <option value="g">g</option>
          </select>
        </div>
      </div>

      {result.aiFiberG != null ? (
        <p className="text-xs text-muted-foreground">
          IOM Adequate Intake ({result.aiLabel ?? 'age/sex'}):{' '}
          <strong className="text-accent">
            {formatFiberGrams(result.aiFiberG)} g/day
          </strong>
          {' — '}kept distinct from the energy-scaled optimum above.
        </p>
      ) : null}

      {!hasOptimum ? (
        <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      )}

      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
    </section>
  );
}
