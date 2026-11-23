'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDisplayValue, toMs } from './calculation';
import type {
  QtcFieldErrors,
  QtcInput,
  QtcResult,
  QtcTimeUnit,
} from './types';
import { TIME_UNIT_LABELS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';
const unitSuffixClass =
  'shrink-0 px-3 text-sm font-medium text-muted-foreground';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function convertTimeString(
  raw: string,
  from: QtcTimeUnit,
  to: QtcTimeUnit
): string {
  if (from === to) return raw;
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return raw;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n < 0) return raw;
  const ms = toMs(n, from);
  if (ms == null) return raw;
  return formatDisplayValue(ms, to);
}

interface Props {
  input: QtcInput;
  errors: QtcFieldErrors;
  result: QtcResult | null;
  onChange: (input: QtcInput) => void;
  onLoadExample: () => void;
}

export function QtcForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const set = (patch: Partial<QtcInput>) => onChange({ ...input, ...patch });

  const qtcDisplay =
    result != null
      ? formatDisplayValue(result.bazettMs, input.qtcUnit)
      : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-accent">
        Enter QT and heart rate (or RR) for Bazett QTc.
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational QT correction. Heart rate and RR stay synchronized. Values
        stay in your browser only — share uses the page URL.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (QT 400 ms · HR 60 → QTc 400 ms)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="qtc-qt">
          <span>QT interval</span>
          <InfoTooltip
            label="QT interval"
            text="Measured QT duration from QRS onset to T-wave end on the ECG. Enter in milliseconds or seconds."
          />
        </label>
        <FieldShell error={errors.qtValue}>
          <input
            id="qtc-qt"
            className={inputClass}
            inputMode="decimal"
            aria-label="QT interval"
            value={input.qtValue}
            aria-invalid={Boolean(errors.qtValue)}
            onChange={(e) => set({ qtValue: e.target.value })}
          />
          <select
            className={selectClass}
            aria-label="QT interval unit"
            value={input.qtUnit}
            onChange={(e) => {
              const next = e.target.value as QtcTimeUnit;
              set({
                qtUnit: next,
                qtValue: convertTimeString(
                  input.qtValue,
                  input.qtUnit,
                  next
                ),
              });
            }}
          >
            {(Object.keys(TIME_UNIT_LABELS) as QtcTimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.qtValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.qtValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="qtc-hr">
          <span>Heart rate</span>
        </label>
        <FieldShell error={errors.heartRateBpm}>
          <input
            id="qtc-hr"
            className={inputClass}
            inputMode="decimal"
            aria-label="Heart rate"
            value={input.heartRateBpm}
            aria-invalid={Boolean(errors.heartRateBpm)}
            onChange={(e) =>
              set({
                heartRateBpm: e.target.value,
                lastEdited: 'heartRate',
              })
            }
          />
          <span className={unitSuffixClass}>bpm</span>
        </FieldShell>
        {errors.heartRateBpm ? (
          <p className="mt-1 text-xs text-rose-600">{errors.heartRateBpm}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="qtc-rr">
          <span>RR interval</span>
          <InfoTooltip
            label="RR interval"
            text="R–R cycle length. Linked to heart rate: RR (s) = 60 ÷ bpm. Editing either field updates the other."
          />
        </label>
        <FieldShell error={errors.rrValue}>
          <input
            id="qtc-rr"
            className={inputClass}
            inputMode="decimal"
            aria-label="RR interval"
            value={input.rrValue}
            aria-invalid={Boolean(errors.rrValue)}
            onChange={(e) =>
              set({
                rrValue: e.target.value,
                lastEdited: 'rr',
              })
            }
          />
          <select
            className={selectClass}
            aria-label="RR interval unit"
            value={input.rrUnit}
            onChange={(e) => {
              const next = e.target.value as QtcTimeUnit;
              set({
                rrUnit: next,
                rrValue: convertTimeString(
                  input.rrValue,
                  input.rrUnit,
                  next
                ),
                lastEdited: 'rr',
              });
            }}
          >
            {(Object.keys(TIME_UNIT_LABELS) as QtcTimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {errors.rrValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.rrValue}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="qtc-out">
          <span>QTc (Bazett)</span>
        </label>
        <FieldShell>
          <input
            id="qtc-out"
            className={`${inputClass} text-muted-foreground`}
            readOnly
            tabIndex={-1}
            aria-label="QTc Bazett result"
            value={qtcDisplay}
            placeholder=""
          />
          <select
            className={selectClass}
            aria-label="QTc unit"
            value={input.qtcUnit}
            onChange={(e) =>
              set({ qtcUnit: e.target.value as QtcTimeUnit })
            }
          >
            {(Object.keys(TIME_UNIT_LABELS) as QtcTimeUnit[]).map((u) => (
              <option key={u} value={u}>
                {TIME_UNIT_LABELS[u]}
              </option>
            ))}
          </select>
        </FieldShell>
        {result ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Results appear when QT and heart rate (or RR) are entered.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={input.otherMethodsOpen}
          onClick={() =>
            set({ otherMethodsOpen: !input.otherMethodsOpen })
          }
        >
          <span>Other QT interval correction methods</span>
          {input.otherMethodsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
          )}
        </button>
        {input.otherMethodsOpen ? (
          <div className="space-y-2 border-t border-border px-3 py-3">
            {result ? (
              result.methods
                .filter((m) => m.method !== 'bazett')
                .map((m) => (
                  <div
                    key={m.method}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-accent">{m.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatDisplayValue(m.qtcMs, input.qtcUnit)}{' '}
                      {input.qtcUnit}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Fridericia, Framingham, and Hodges appear here once QT and rate
                are entered.
              </p>
            )}
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Bazett over-corrects at high rates and under-corrects at low
              rates. Compare methods educationally; do not treat an isolated
              value as a diagnosis.
            </p>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      {result ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
    </form>
  );
}
