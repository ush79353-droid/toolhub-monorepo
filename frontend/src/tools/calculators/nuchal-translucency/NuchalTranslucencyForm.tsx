'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CHART_GA_MAX,
  CHART_GA_MIN,
  syncFromEstimateCrl,
  syncFromEstimateGa,
  splitGestationalAge,
} from './calculation';
import type {
  GaDisplayUnit,
  NuchalTranslucencyFieldErrors,
  NuchalTranslucencyInput,
  NuchalTranslucencyResult,
} from './types';
import { GA_DISPLAY_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const suffixClass =
  'shrink-0 border-l border-border px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

const CHART_COLORS: Record<number | 'you', string> = {
  5: '#94a3b8',
  25: '#cbd5e1',
  50: '#1e3a8a',
  75: '#7f1d1d',
  95: '#ef4444',
  you: '#3b82f6',
};

const WIDTH = 560;
const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 40, left: 44 };

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function parseLoose(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function NtChart({ result }: { result: NuchalTranslucencyResult }) {
  const assess = result.assess;
  if (!assess) return null;

  const yMin = 0;
  const yMax = 2.6;
  const xMin = CHART_GA_MIN;
  const xMax = CHART_GA_MAX;

  const xScale = (d: number) =>
    PAD.left + ((d - xMin) / (xMax - xMin)) * (WIDTH - PAD.left - PAD.right);
  const yScale = (nt: number) =>
    HEIGHT -
    PAD.bottom -
    ((nt - yMin) / (yMax - yMin)) * (HEIGHT - PAD.top - PAD.bottom);

  const youX = xScale(assess.userPoint.gaDays);
  const youY = yScale(assess.userPoint.ntMm);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white p-3">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full min-w-[280px]"
        role="img"
        aria-label={assess.accessibleChartSummary}
      >
        <title>Nuchal translucency centile curves</title>
        <desc>{assess.accessibleChartSummary}</desc>
        {[0.5, 1.0, 1.5, 2.0, 2.5].map((tick) => (
          <line
            key={tick}
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="#e2e8f0"
            strokeDasharray="2 4"
          />
        ))}
        {assess.chartCurves.map((curve) => {
          const pts = curve.points.filter(
            (p) => p.gaDays >= xMin && p.gaDays <= xMax,
          );
          const d = pts
            .map((p, i) => {
              const cmd = i === 0 ? 'M' : 'L';
              return `${cmd}${xScale(p.gaDays).toFixed(2)} ${yScale(p.ntMm).toFixed(2)}`;
            })
            .join(' ');
          return (
            <path
              key={curve.percentile}
              d={d}
              fill="none"
              stroke={CHART_COLORS[curve.percentile]}
              strokeWidth={curve.percentile === 50 ? 2.25 : 1.75}
            />
          );
        })}
        <circle cx={youX} cy={youY} r={5} fill={CHART_COLORS.you} />
        <text
          x={WIDTH / 2}
          y={HEIGHT - 8}
          textAnchor="middle"
          fill="#64748b"
          fontSize={11}
        >
          Gestational age (days)
        </text>
      </svg>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <li className="inline-flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: CHART_COLORS.you }}
          />
          Your measurement
        </li>
        {([5, 25, 50, 75, 95] as const).map((p) => (
          <li key={p} className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: CHART_COLORS[p] }}
            />
            {p}th
          </li>
        ))}
      </ul>
      <p className="mt-1 text-center text-[11px] italic text-muted-foreground">
        NT (mm) vs gestational age (days), curves mapped from CRL centile knots.
      </p>
    </div>
  );
}

function GaOutput({
  gaDays,
  unit,
}: {
  gaDays: number | null;
  unit: GaDisplayUnit;
}) {
  if (gaDays == null) {
    return <span className="text-muted-foreground" />;
  }
  if (unit === 'days') {
    return <span className="font-medium">{gaDays}</span>;
  }
  const { weeks, days } = splitGestationalAge(gaDays);
  return (
    <>
      <span className="font-medium">{weeks}</span>
      <span className="text-muted-foreground"> wks</span>
      <span className="text-muted-foreground" aria-hidden>
        {' '}
        ·{' '}
      </span>
      <span className="font-medium">{days}</span>
      <span className="text-muted-foreground"> days</span>
    </>
  );
}

interface Props {
  input: NuchalTranslucencyInput;
  errors: NuchalTranslucencyFieldErrors;
  result: NuchalTranslucencyResult | null;
  onChange: (input: NuchalTranslucencyInput) => void;
  onLoadExample: () => void;
}

export function NuchalTranslucencyForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<NuchalTranslucencyInput>) =>
    onChange({ ...input, ...patch });

  const estGaDays = result?.estimate?.gestationalAgeDays ?? parseLoose(input.estimateGaDays);
  const assessGaDays =
    result?.assess?.gestationalAgeDays ?? parseLoose(input.assessGaDays);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational nuchal translucency (NT) centile reference for early
        pregnancy. Not genetic screening or diagnosis. Entries stay in your
        browser only.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (CRL 45 mm, NT 1.34 mm)
        </button>
        <span className="text-muted-foreground">
          {' '}
          — Robinson GA rounds to 78 days (not 79); NT centile ~82nd, not 75th.
        </span>
      </p>

      <CollapsibleSection
        title="Estimate your nuchal translucency"
        open={input.estimateSectionOpen}
        onToggle={() =>
          set({ estimateSectionOpen: !input.estimateSectionOpen })
        }
      >
        <div>
          <label className={labelClass} htmlFor="nt-crl">
            <span>Crown-rump length</span>
            <InfoTooltip
              label="Crown-rump length"
              text="CRL in millimeters. Drives gestational age (Robinson–Fleming) and expected median NT (Chung)."
            />
          </label>
          <FieldShell error={errors.crlMm}>
            <input
              id="nt-crl"
              className={inputClass}
              inputMode="decimal"
              aria-label="Crown-rump length"
              value={input.crlMm}
              aria-invalid={Boolean(errors.crlMm)}
              onChange={(e) => {
                const crlMm = e.target.value;
                const n = parseLoose(crlMm);
                const patch: Partial<NuchalTranslucencyInput> = {
                  crlMm,
                  estimateLastEdit: 'crl',
                };
                if (n != null && n > 0) {
                  const sync = syncFromEstimateCrl(n);
                  patch.estimateGaDays = sync.estimateGaDays;
                  if (input.assessGaMode === 'synced') {
                    patch.assessGaDays = sync.assessGaDays ?? '';
                  }
                }
                onChange({ ...input, ...patch });
              }}
            />
            <span className={suffixClass}>mm</span>
          </FieldShell>
          {errors.crlMm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.crlMm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="nt-est-ga">
            <span>Estimated gestational age</span>
            <InfoTooltip
              label="Estimated gestational age"
              text="Menstrual gestational age from Robinson–Fleming. Editable — updates CRL via the inverse equation. Display as total days or weeks + days."
            />
          </label>
          <FieldShell error={errors.estimateGaDays}>
            {input.gaDisplayUnit === 'days' ? (
              <input
                id="nt-est-ga"
                className={inputClass}
                inputMode="numeric"
                aria-label="Estimated gestational age in days"
                value={input.estimateGaDays}
                aria-invalid={Boolean(errors.estimateGaDays)}
                onChange={(e) => {
                  const estimateGaDays = e.target.value;
                  const n = parseLoose(estimateGaDays);
                  const patch: Partial<NuchalTranslucencyInput> = {
                    estimateGaDays,
                    estimateLastEdit: 'ga',
                  };
                  if (n != null && n > 0) {
                    const sync = syncFromEstimateGa(Math.round(n));
                    patch.crlMm = sync.crlMm;
                    if (input.assessGaMode === 'synced') {
                      patch.assessGaDays = String(Math.round(n));
                    }
                  }
                  onChange({ ...input, ...patch });
                }}
              />
            ) : (
              <div
                id="nt-est-ga"
                className="flex w-full flex-wrap items-center gap-1 px-3 text-sm tabular-nums"
              >
                <input
                  className="h-9 w-14 min-w-0 bg-transparent text-center outline-none"
                  inputMode="numeric"
                  aria-label="Gestational age weeks"
                  value={
                    estGaDays != null
                      ? String(splitGestationalAge(estGaDays).weeks)
                      : ''
                  }
                  onChange={(e) => {
                    const w = parseLoose(e.target.value);
                    const d =
                      estGaDays != null
                        ? splitGestationalAge(estGaDays).days
                        : 0;
                    if (w == null) {
                      onChange({
                        ...input,
                        estimateGaDays: '',
                        estimateLastEdit: 'ga',
                      });
                      return;
                    }
                    const total = w * 7 + d;
                    const sync = syncFromEstimateGa(total);
                    onChange({
                      ...input,
                      estimateGaDays: String(total),
                      estimateLastEdit: 'ga',
                      crlMm: sync.crlMm,
                      assessGaDays:
                        input.assessGaMode === 'synced'
                          ? String(total)
                          : input.assessGaDays,
                    });
                  }}
                />
                <span className="text-muted-foreground text-xs">wks</span>
                <input
                  className="h-9 w-14 min-w-0 bg-transparent text-center outline-none"
                  inputMode="numeric"
                  aria-label="Gestational age remainder days"
                  value={
                    estGaDays != null
                      ? String(splitGestationalAge(estGaDays).days)
                      : ''
                  }
                  onChange={(e) => {
                    const d = parseLoose(e.target.value);
                    const w =
                      estGaDays != null
                        ? splitGestationalAge(estGaDays).weeks
                        : 0;
                    if (d == null) {
                      onChange({
                        ...input,
                        estimateGaDays: '',
                        estimateLastEdit: 'ga',
                      });
                      return;
                    }
                    const total = w * 7 + Math.min(6, Math.max(0, Math.round(d)));
                    const sync = syncFromEstimateGa(total);
                    onChange({
                      ...input,
                      estimateGaDays: String(total),
                      estimateLastEdit: 'ga',
                      crlMm: sync.crlMm,
                      assessGaDays:
                        input.assessGaMode === 'synced'
                          ? String(total)
                          : input.assessGaDays,
                    });
                  }}
                />
                <span className="text-muted-foreground text-xs">days</span>
              </div>
            )}
            <select
              className={selectClass}
              aria-label="Gestational age display unit"
              value={input.gaDisplayUnit}
              onChange={(e) =>
                set({ gaDisplayUnit: e.target.value as GaDisplayUnit })
              }
            >
              {(Object.keys(GA_DISPLAY_LABELS) as GaDisplayUnit[]).map((u) => (
                <option key={u} value={u}>
                  {u === 'days' ? 'days' : 'wks'}
                </option>
              ))}
            </select>
          </FieldShell>
          {errors.estimateGaDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.estimateGaDays}</p>
          ) : null}
          {result?.estimate?.gaNote ? (
            <p className="mt-1.5 text-xs text-amber-800">{result.estimate.gaNote}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="nt-expected">
            <span>Expected nuchal translucency</span>
            <InfoTooltip
              label="Expected nuchal translucency"
              text="Median NT from Chung et al.: 0.437 + 0.01969×CRL (mm). Read-only."
            />
          </label>
          <FieldShell muted>
            <output
              id="nt-expected"
              className="px-3 text-sm font-medium tabular-nums text-accent"
            >
              {result?.estimate?.formattedExpectedNt ?? (
                <span className="font-normal text-muted-foreground">—</span>
              )}
            </output>
            <span className={suffixClass}>mm</span>
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Assess your nuchal translucency"
        open={input.assessSectionOpen}
        onToggle={() => set({ assessSectionOpen: !input.assessSectionOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="nt-measured">
            <span>Measured NT</span>
            <InfoTooltip
              label="Measured NT"
              text="Sonographic nuchal translucency thickness in millimeters from your ultrasound report."
            />
          </label>
          <FieldShell error={errors.measuredNtMm}>
            <input
              id="nt-measured"
              className={inputClass}
              inputMode="decimal"
              aria-label="Measured nuchal translucency"
              value={input.measuredNtMm}
              aria-invalid={Boolean(errors.measuredNtMm)}
              onChange={(e) => set({ measuredNtMm: e.target.value })}
            />
            <span className={suffixClass}>mm</span>
          </FieldShell>
          {errors.measuredNtMm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.measuredNtMm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="nt-assess-ga">
            <span>Gestational age</span>
            <InfoTooltip
              label="Gestational age for assessment"
              text="Gestational age in days for centile lookup. Synced from the estimate panel until you edit it here."
            />
          </label>
          <FieldShell error={errors.assessGaDays}>
            <input
              id="nt-assess-ga"
              className={inputClass}
              inputMode="numeric"
              aria-label="Gestational age in days"
              value={input.assessGaDays}
              aria-invalid={Boolean(errors.assessGaDays)}
              onChange={(e) =>
                set({
                  assessGaDays: e.target.value,
                  assessGaMode: 'manual',
                })
              }
            />
            <span className={suffixClass}>days</span>
          </FieldShell>
          {errors.assessGaDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.assessGaDays}</p>
          ) : null}
          {input.assessGaMode === 'synced' ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Synced from estimate
              {estGaDays != null ? ` (${estGaDays} days)` : ''}.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Independently edited — CRL for centiles uses entered CRL when
              available, otherwise Robinson inverse from this age (
              {assessGaDays != null ? `${assessGaDays} days` : '—'}).
            </p>
          )}
        </div>

        {result?.assess ? (
          <div className="space-y-3 rounded-xl border border-border bg-white p-3.5">
            <p className="text-sm font-medium text-accent">
              {result.assess.percentileSentence}
            </p>
            <p
              className={`text-sm ${
                result.assess.withinNormalRange
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {result.assess.withinNormalRange ? (
                <>
                  Within <strong>normal range</strong> (below interpolated 95th
                  centile for this CRL).
                </>
              ) : (
                result.assess.normalRangeNote
              )}
            </p>
            <NtChart result={result} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.assess.disclaimer}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enter measured NT and gestational age (≈45–84 mm CRL window) to see
            centile and chart.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}