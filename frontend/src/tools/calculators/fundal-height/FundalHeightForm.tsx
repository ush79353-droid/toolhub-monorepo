'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FundalHeightFieldErrors,
  FundalHeightInput,
  FundalHeightResult,
  FundalMode,
  LengthUnit,
  VertexStation,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function fmt(n: number | null | undefined, digits = 3): string {
  if (n == null || !Number.isFinite(n)) return '';
  return (Math.round(n * 10 ** digits) / 10 ** digits).toFixed(digits);
}

interface FormProps {
  input: FundalHeightInput;
  errors: FundalHeightFieldErrors;
  result: FundalHeightResult | null;
  onChange: (input: FundalHeightInput) => void;
}

export function FundalHeightForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<FundalHeightInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational INTERGROWTH SFH — not clinical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Uses Papageorghiou et al. BMJ 2016 standards (~16–40 weeks). Share uses
          the page URL only.
        </p>
      </div>

      <section className={sectionClass}>
        <p className={labelClass}>Calculation type:</p>
        <div role="radiogroup" aria-label="Calculation type" className="space-y-2">
          {(
            [
              ['percentile', 'SFH percentile'],
              ['dating', 'SFH to gestational age'],
              ['fetalWeight', 'SFH to fetal weight'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="fh-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === value}
                onChange={() => set({ mode: value as FundalMode })}
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className={sectionClass} aria-label="SFH inputs">
        {input.mode === 'percentile' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="fh-weeks">
                GA weeks
                <InfoTooltip text="Completed gestational weeks." />
              </label>
              <FieldShell error={errors.gaWeeksText}>
                <input
                  id="fh-weeks"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.gaWeeksText}
                  onChange={(e) => set({ gaWeeksText: e.target.value })}
                />
              </FieldShell>
            </div>
            <div>
              <label className={labelClass} htmlFor="fh-days">
                GA days
                <InfoTooltip text="Residual days 0–6." />
              </label>
              <FieldShell error={errors.gaDaysText}>
                <input
                  id="fh-days"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                  value={input.gaDaysText}
                  onChange={(e) => set({ gaDaysText: e.target.value })}
                />
              </FieldShell>
            </div>
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="fh-sfh">
            Measured SFH
            <InfoTooltip text="Symphysis–fundal height measurement." />
          </label>
          <FieldShell error={errors.measuredSfhText}>
            <input
              id="fh-sfh"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.measuredSfhText}
              onChange={(e) => set({ measuredSfhText: e.target.value })}
            />
            <select
              aria-label="SFH unit"
              className={selectClass}
              value={input.sfhUnit}
              onChange={(e) => set({ sfhUnit: e.target.value as LengthUnit })}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
        </div>

        {input.mode === 'percentile' ? (
          <>
            <div>
              <p className={labelClass}>
                Expected SFH
                <InfoTooltip text="INTERGROWTH median for the entered gestational age." />
              </p>
              <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
                <input
                  type="text"
                  readOnly
                  aria-label="Expected SFH"
                  className="h-11 w-full bg-transparent text-sm tabular-nums outline-none"
                  value={fmt(result?.expectedSfhCm, 3)}
                />
                <span className="pr-1 font-mono text-xs text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
            <div>
              <p className={labelClass}>
                SFH standard deviation (SD)
                <InfoTooltip text="INTERGROWTH SD equation." />
              </p>
              <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
                <input
                  type="text"
                  readOnly
                  aria-label="SFH SD"
                  className="h-11 w-full bg-transparent text-sm tabular-nums outline-none"
                  value={fmt(result?.sdCm, 3)}
                />
                <span className="pr-1 font-mono text-xs text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
            {result?.percentile != null ? (
              <p className="text-sm text-accent">
                Percentile:{' '}
                <span className="font-semibold tabular-nums">
                  {fmt(result.percentile, 1)}
                </span>
                {result.zScore != null ? (
                  <span className="text-muted-foreground">
                    {' '}
                    (z = {fmt(result.zScore, 2)})
                  </span>
                ) : null}
              </p>
            ) : null}
          </>
        ) : null}

        {input.mode === 'dating' && result?.datedExactWeeks != null ? (
          <p className="text-sm text-accent">
            Estimated GA:{' '}
            <span className="font-semibold tabular-nums">
              {fmt(result.datedExactWeeks, 2)} weeks
            </span>
          </p>
        ) : null}

        {input.mode === 'fetalWeight' ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-3">
            <p className="text-[13px] text-muted-foreground">
              Johnson teaching estimate (vertex). Not an INTERGROWTH standard.
            </p>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={input.motherOver91kg}
                onChange={(e) => set({ motherOver91kg: e.target.checked })}
              />
              Mother weight &gt; 91 kg (200 lb)
            </label>
            <div>
              <p className={labelClass}>Vertex station</p>
              <div role="radiogroup" className="flex flex-wrap gap-4">
                {(
                  [
                    ['above', 'Above ischial spine (12)'],
                    ['below', 'Below ischial spine (11)'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className="inline-flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      name="fh-vertex"
                      className="h-4 w-4 accent-primary"
                      checked={input.vertexStation === value}
                      onChange={() =>
                        set({ vertexStation: value as VertexStation })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            {result?.fetalWeightG != null ? (
              <p className="text-sm text-accent">
                Estimated fetal weight:{' '}
                <span className="font-semibold tabular-nums">
                  {Math.round(result.fetalWeightG)} g
                </span>
              </p>
            ) : null}
          </div>
        ) : null}

        <FundalChart result={result} />
      </section>
    </form>
  );
}

function FundalChart({ result }: { result: FundalHeightResult | null }) {
  const chart = result?.chart ?? [];
  if (chart.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        no data to display
      </div>
    );
  }
  const w = 320;
  const h = 180;
  const pad = { l: 36, r: 8, t: 8, b: 28 };
  const minX = chart[0]!.week;
  const maxX = chart[chart.length - 1]!.week;
  const allY = chart.flatMap((p) => [
    p.p3,
    p.p5,
    p.p10,
    p.p50,
    p.p90,
    p.p95,
    p.p97,
  ]);
  const minY = Math.min(...allY) - 1;
  const maxY = Math.max(...allY) + 1;
  const sx = (x: number) =>
    pad.l + ((x - minX) / (maxX - minX)) * (w - pad.l - pad.r);
  const sy = (y: number) =>
    pad.t + (1 - (y - minY) / (maxY - minY)) * (h - pad.t - pad.b);
  const path = (key: keyof (typeof chart)[0]) =>
    chart
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.week)},${sy(p[key] as number)}`)
      .join(' ');

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full rounded-lg border border-border bg-white"
        role="img"
        aria-label="SFH centile chart by gestational age"
      >
        <text x={4} y={h / 2} className="fill-muted-foreground text-[8px]" transform={`rotate(-90 8 ${h / 2})`}>
          fundal height (cm)
        </text>
        <path d={path('p3')} fill="none" stroke="#6b7280" strokeWidth="1" />
        <path d={path('p5')} fill="none" stroke="#9f1239" strokeWidth="1" />
        <path d={path('p10')} fill="none" stroke="#eab308" strokeWidth="1" />
        <path d={path('p50')} fill="none" stroke="#9ca3af" strokeWidth="1.5" />
        <path d={path('p90')} fill="none" stroke="#1e3a8a" strokeWidth="1" />
        <path d={path('p95')} fill="none" stroke="#881337" strokeWidth="1" />
        <path d={path('p97')} fill="none" stroke="#78350f" strokeWidth="1" />
        {result?.userPoint ? (
          <circle
            cx={sx(result.userPoint.week)}
            cy={sy(result.userPoint.sfhCm)}
            r="3.5"
            fill="#2563eb"
          />
        ) : null}
        <text
          x={w / 2}
          y={h - 4}
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          gestational age in weeks
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Legend: you · 3rd · 5th · 10th · 50th · 90th · 95th · 97th
      </p>
    </div>
  );
}
