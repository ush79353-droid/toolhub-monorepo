'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AdministrationRoute,
  TylenolOverdoseFieldErrors,
  TylenolOverdoseInput,
  TylenolOverdoseResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function formatUgPerMl(n: number): string {
  const f = n.toFixed(1);
  return f.replace(/\.0$/, '');
}

interface FormProps {
  input: TylenolOverdoseInput;
  errors: TylenolOverdoseFieldErrors;
  result: TylenolOverdoseResult | null;
  onChange: (input: TylenolOverdoseInput) => void;
}

export function TylenolOverdoseForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const [toxicityOpen, setToxicityOpen] = useState(true);
  const set = (patch: Partial<TylenolOverdoseInput>) =>
    onChange({ ...input, ...patch });

  const showPlot = result?.pathway === 'nomogram_eligible';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div
        className="rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-3 text-sm text-rose-900"
        role="status"
      >
        <p className="font-semibold">Emergency referral</p>
        <p className="mt-1 text-xs leading-relaxed">
          Any suspected acetaminophen (Tylenol) overdose needs immediate Poison
          Control or emergency evaluation — even when fields are blank or the
          educational plot is unavailable. US Poison Control:{' '}
          <span className="font-semibold tabular-nums">1-800-222-1222</span>.
          This tool never determines that it is safe to stay home.
        </p>
      </div>

      <section className={sectionClass} aria-label="Patient information">
        <h3 className="text-[15px] font-semibold text-accent">
          Patient information
        </h3>

        <div>
          <label className={labelClass} htmlFor="apap-weight">
            Patient&apos;s weight
            <InfoTooltip text="Optional context only. The Rumack–Matthew concentration-vs-time plot does not use body weight. Weight is never used to invent a “safe” home dose." />
          </label>
          <div className="flex gap-0">
            <FieldShell error={errors.weightText}>
              <input
                id="apap-weight"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.weightText}
                onChange={(e) => set({ weightText: e.target.value })}
                aria-invalid={Boolean(errors.weightText)}
              />
              <select
                className={unitSelectClass}
                value={input.weightUnit}
                onChange={(e) =>
                  set({ weightUnit: e.target.value as WeightUnit })
                }
                aria-label="Weight unit"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </FieldShell>
          </div>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>Route of administration</legend>
          <div
            className="flex flex-wrap gap-4"
            role="radiogroup"
            aria-label="Route of administration"
          >
            {(
              [
                { value: 'oral', label: 'Oral (PO)' },
                { value: 'iv', label: 'Intravenous (IV)' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="apap-route"
                  className="h-4 w-4 accent-primary"
                  checked={input.route === opt.value}
                  onChange={() =>
                    set({ route: opt.value as AdministrationRoute })
                  }
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <legend className="sr-only">Acetaminophen toxicity</legend>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
          aria-expanded={toxicityOpen}
          onClick={() => setToxicityOpen((o) => !o)}
        >
          <span>Acetaminophen toxicity</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              toxicityOpen ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {toxicityOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
            <div>
              <label className={labelClass} htmlFor="apap-hours">
                Hours after ingestion
                <InfoTooltip text="Time from a single acute oral ingestion to the serum acetaminophen draw. The classic Rumack–Matthew teaching window is 4–24 hours. Levels before 4 hours are not plotted." />
              </label>
              <FieldShell error={errors.hoursAfterIngestionText}>
                <input
                  id="apap-hours"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.hoursAfterIngestionText}
                  onChange={(e) =>
                    set({ hoursAfterIngestionText: e.target.value })
                  }
                  aria-invalid={Boolean(errors.hoursAfterIngestionText)}
                />
                <span className={unitFixed}>hrs</span>
              </FieldShell>
              {errors.hoursAfterIngestionText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.hoursAfterIngestionText}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="apap-level">
                Current acetaminophen serum level
                <InfoTooltip text="Concentration in µg/mL. Numerically identical to mg/L for acetaminophen (1 µg/mL = 1 mg/L)." />
              </label>
              <FieldShell error={errors.serumLevelText}>
                <input
                  id="apap-level"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.serumLevelText}
                  onChange={(e) => set({ serumLevelText: e.target.value })}
                  aria-invalid={Boolean(errors.serumLevelText)}
                />
                <span className={unitFixed}>µg/mL</span>
              </FieldShell>
              {errors.serumLevelText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.serumLevelText}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      {result ? (
        <section
          className={sectionClass}
          aria-label="Educational nomogram result"
          aria-live="polite"
        >
          <h3 className="text-[15px] font-semibold text-accent">
            {result.statusHeadline}
          </h3>
          <p className="text-sm text-muted-foreground">{result.statusDetail}</p>

          {showPlot &&
          result.hoursAfterIngestion != null &&
          result.serumLevelUgPerMl != null &&
          result.treatmentLineUgPerMl != null &&
          result.probableLineUgPerMl != null ? (
            <div className="space-y-2">
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <dt className="text-xs text-muted-foreground">Your level</dt>
                  <dd className="font-semibold tabular-nums text-accent">
                    {formatUgPerMl(result.serumLevelUgPerMl)} µg/mL
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <dt className="text-xs text-muted-foreground">
                    US treatment line @ {formatUgPerMl(result.hoursAfterIngestion)}{' '}
                    h
                  </dt>
                  <dd className="font-semibold tabular-nums text-accent">
                    {formatUgPerMl(result.treatmentLineUgPerMl)} µg/mL
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">
                    Rumack–Matthew probable line @{' '}
                    {formatUgPerMl(result.hoursAfterIngestion)} h
                  </dt>
                  <dd className="font-semibold tabular-nums text-accent">
                    {formatUgPerMl(result.probableLineUgPerMl)} µg/mL
                  </dd>
                </div>
              </dl>
              <NomogramMiniPlot
                hours={result.hoursAfterIngestion}
                level={result.serumLevelUgPerMl}
                treatmentAtHour={result.treatmentLineUgPerMl}
                probableAtHour={result.probableLineUgPerMl}
              />
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground">{result.sourceNote}</p>
        </section>
      ) : null}

      <p className="px-1 text-center text-xs italic text-muted-foreground">
        Always double-check the calculations, the dosing information, and the
        contraindications on the leaflet. Consult your health provider before
        administering.
      </p>
    </form>
  );
}

/** Compact educational SVG — only mounted when the timed oral pathway is eligible. */
function NomogramMiniPlot({
  hours,
  level,
  treatmentAtHour,
  probableAtHour,
}: {
  hours: number;
  level: number;
  treatmentAtHour: number;
  probableAtHour: number;
}) {
  const w = 320;
  const h = 160;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const t0 = 4;
  const t1 = 24;
  const yMax = Math.max(level, probableAtHour, treatmentAtHour, 200) * 1.15;

  const xOf = (t: number) => pad.l + ((t - t0) / (t1 - t0)) * innerW;
  const yOf = (c: number) => pad.t + innerH - (c / yMax) * innerH;

  const linePath = (c4: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = t0 + ((t1 - t0) * i) / 40;
      const c = c4 * Math.pow(2, -(t - 4) / 4);
      pts.push(`${i === 0 ? 'M' : 'L'}${xOf(t).toFixed(1)},${yOf(c).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-white p-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Educational Rumack-Matthew reference: level ${formatUgPerMl(level)} micrograms per milliliter at ${formatUgPerMl(hours)} hours versus published treatment and probable lines.`}
      >
        <path
          d={linePath(200)}
          fill="none"
          stroke="currentColor"
          className="text-rose-400"
          strokeWidth="1.5"
        />
        <path
          d={linePath(150)}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <circle
          cx={xOf(hours)}
          cy={yOf(level)}
          r="4"
          className="fill-accent"
        />
        <text
          x={pad.l}
          y={h - 8}
          className="fill-muted-foreground text-[9px]"
        >
          4 h
        </text>
        <text
          x={w - pad.r - 18}
          y={h - 8}
          className="fill-muted-foreground text-[9px]"
        >
          24 h
        </text>
        <text
          x={4}
          y={pad.t + 8}
          className="fill-muted-foreground text-[9px]"
        >
          µg/mL
        </text>
      </svg>
      <figcaption className="mt-1 text-[11px] text-muted-foreground">
        Solid: probable 200-line · Dashed: US treatment 150-line · Dot: entered
        level ({formatUgPerMl(level)} vs treatment {formatUgPerMl(treatmentAtHour)}{' '}
        µg/mL). Educational plot only.
      </figcaption>
    </figure>
  );
}
