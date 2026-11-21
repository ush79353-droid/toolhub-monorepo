'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatWeightDisplay } from './calculation';
import type {
  ChartUnitSystem,
  HeightUnit,
  PregnancyWeightGainWeekByWeekFieldErrors,
  PregnancyWeightGainWeekByWeekInput,
  PregnancyWeightGainWeekByWeekResult,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-muted-foreground outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function WeekChart({
  result,
}: {
  result: PregnancyWeightGainWeekByWeekResult;
}) {
  const series = result.series;
  if (series.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
        no data to display
      </div>
    );
  }

  const displayUnit = result.chartUnits === 'imperial' ? 'lb' : 'kg';
  const toDisplay = (kg: number) =>
    result.chartUnits === 'imperial' ? kg / 0.45359237 : kg;

  const ys = series.flatMap((p) => [
    toDisplay(p.minWeightKg),
    toDisplay(p.maxWeightKg),
  ]);
  const yMin = Math.min(...ys) * 0.98;
  const yMax = Math.max(...ys) * 1.02;
  const w = 320;
  const h = 160;
  const pad = 8;
  const xScale = (week: number) =>
    pad + ((week - 1) / 39) * (w - pad * 2);
  const yScale = (v: number) =>
    h - pad - ((v - yMin) / (yMax - yMin || 1)) * (h - pad * 2);

  const minPath = series
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${xScale(p.week).toFixed(1)},${yScale(toDisplay(p.minWeightKg)).toFixed(1)}`,
    )
    .join(' ');
  const maxPath = series
    .map(
      (p, i) =>
        `${i === 0 ? 'M' : 'L'}${xScale(p.week).toFixed(1)},${yScale(toDisplay(p.maxWeightKg)).toFixed(1)}`,
    )
    .join(' ');

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-48 w-full rounded-lg border border-border bg-white"
        role="img"
        aria-label="Weight gain by week chart with minimum and maximum recommended weight"
      >
        <path d={minPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d={maxPath} fill="none" stroke="#ef4444" strokeWidth="2" />
      </svg>
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
          Min. weight
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500" />
          Max. weight
        </span>
        <span>Weight gain by week ({displayUnit})</span>
      </div>
      <details className="rounded-lg border border-border bg-muted/15 px-3 py-2">
        <summary className="cursor-pointer text-xs font-semibold text-accent">
          Weekly table (accessible summary)
        </summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-1 pr-2">Week</th>
                <th className="py-1 pr-2">Min weight</th>
                <th className="py-1">Max weight</th>
              </tr>
            </thead>
            <tbody>
              {series.map((p) => (
                <tr key={p.week} className="border-t border-border/60">
                  <td className="py-1 pr-2 tabular-nums">{p.week}</td>
                  <td className="py-1 pr-2 tabular-nums">
                    {formatWeightDisplay(p.minWeightKg, displayUnit)}
                  </td>
                  <td className="py-1 tabular-nums">
                    {formatWeightDisplay(p.maxWeightKg, displayUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

interface Props {
  input: PregnancyWeightGainWeekByWeekInput;
  errors: PregnancyWeightGainWeekByWeekFieldErrors;
  result: PregnancyWeightGainWeekByWeekResult | null;
  onChange: (input: PregnancyWeightGainWeekByWeekInput) => void;
  onLoadExample: () => void;
}

export function PregnancyWeightGainWeekByWeekForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<PregnancyWeightGainWeekByWeekInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <fieldset className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={input.beforeOpen}
          onClick={() => set({ beforeOpen: !input.beforeOpen })}
        >
          <span>Before pregnancy</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${input.beforeOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {input.beforeOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 py-3.5">
            <div>
              <label className={labelClass} htmlFor="pwgww-height">
                Height
              </label>
              <FieldShell error={errors.height}>
                <input
                  id="pwgww-height"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.height}
                  onChange={(e) => set({ height: e.target.value })}
                />
                <select
                  className={unitSelectClass}
                  aria-label="Height unit"
                  value={input.heightUnit}
                  onChange={(e) =>
                    set({ heightUnit: e.target.value as HeightUnit })
                  }
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </FieldShell>
            </div>
            <div>
              <label className={labelClass} htmlFor="pwgww-weight">
                Weight
              </label>
              <FieldShell error={errors.weight}>
                <input
                  id="pwgww-weight"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.weight}
                  onChange={(e) => set({ weight: e.target.value })}
                />
                <select
                  className={unitSelectClass}
                  aria-label="Weight unit"
                  value={input.weightUnit}
                  onChange={(e) =>
                    set({ weightUnit: e.target.value as WeightUnit })
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </FieldShell>
            </div>
            <div>
              <label className={labelClass} htmlFor="pwgww-bmi">
                BMI
                <InfoTooltip text="BMI = kg/m² from pre-pregnancy height and weight. Selects the IOM gain band." />
              </label>
              <FieldShell muted>
                <input
                  id="pwgww-bmi"
                  className={inputClass}
                  readOnly
                  value={result?.formattedBmi ?? ''}
                  tabIndex={-1}
                />
              </FieldShell>
            </div>
          </div>
        ) : null}
      </fieldset>

      <div className="space-y-3.5 rounded-xl border border-border bg-white p-3.5">
        <p className="text-[13px] font-semibold text-accent">
          Weight during pregnancy
        </p>
        <div>
          <label className={labelClass} htmlFor="pwgww-week">
            Week
          </label>
          <FieldShell error={errors.week}>
            <input
              id="pwgww-week"
              className={inputClass}
              inputMode="numeric"
              value={input.week}
              onChange={(e) => set({ week: e.target.value })}
            />
          </FieldShell>
        </div>
        <div>
          <div className={labelClass}>Expecting twins?</div>
          <div className="flex flex-col gap-2" role="radiogroup">
            {(
              [
                [false, 'No'],
                [true, 'Yes'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={label}
                className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
                  input.twins === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="pwgww-twins"
                  checked={input.twins === value}
                  onChange={() => set({ twins: value })}
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {(
          [
            ['Minimum weight', result?.formattedMinWeight ?? ''],
            ['Maximum weight', result?.formattedMaxWeight ?? ''],
            ['Minimum weight gain', result?.formattedMinGain ?? ''],
            ['Maximum weight gain', result?.formattedMaxGain ?? ''],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <label className={labelClass}>{label}</label>
            <FieldShell muted>
              <input className={inputClass} readOnly value={value} tabIndex={-1} />
              <span className="pr-3 text-xs text-muted-foreground">
                {input.chartUnits === 'imperial' ? 'lb' : 'kg'}
              </span>
            </FieldShell>
          </div>
        ))}

        <div>
          <div className={labelClass}>Select the chart/table units</div>
          <div className="flex flex-col gap-2" role="radiogroup">
            {(
              [
                ['imperial', 'Imperial (lb)'],
                ['metric', 'Metric (kg)'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 text-sm ${
                  input.chartUnits === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="pwgww-chart-units"
                  checked={input.chartUnits === value}
                  onChange={() =>
                    set({ chartUnits: value as ChartUnitSystem })
                  }
                  className="h-4 w-4 accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {result?.unavailableMessage ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {result.unavailableMessage}
        </p>
      ) : null}

      {result ? (
        <WeekChart result={result} />
      ) : (
        <div className="space-y-2">
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            no data to display
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
              Min. weight
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-500" />
              Max. weight
            </span>
            <span>Weight gain by week</span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (165 cm · 60 kg)
      </button>
    </form>
  );
}
