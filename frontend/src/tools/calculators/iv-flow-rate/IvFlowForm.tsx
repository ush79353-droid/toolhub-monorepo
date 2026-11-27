'use client';

import type { ReactNode } from 'react';
import {
  minutesToTime,
  mlToVolume,
  parseNumber,
  timeToMinutes,
  volumeToMl,
} from './calculation';
import type {
  FlowTimeUnit,
  FlowVolumeUnit,
  IvFlowFieldErrors,
  IvFlowInput,
  IvFlowResult,
  TimeUnit,
  VolumeUnit,
} from './types';
import { InfoTooltip } from '../auto-loan/InfoTooltip';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function formatField(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return '';
  return String(Number(value.toFixed(digits)));
}

interface FormProps {
  input: IvFlowInput;
  errors: IvFlowFieldErrors;
  result: IvFlowResult | null;
  onChange: (input: IvFlowInput) => void;
}

export function IvFlowForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<IvFlowInput>) => onChange({ ...input, ...patch });

  const changeVolumeUnit = (next: VolumeUnit) => {
    const raw = parseNumber(input.volumeText);
    if (raw !== null && raw > 0) {
      const ml = volumeToMl(raw, input.volumeUnit);
      set({ volumeUnit: next, volumeText: formatField(mlToVolume(ml, next), 4) });
      return;
    }
    set({ volumeUnit: next });
  };

  const changeTimeUnit = (next: TimeUnit) => {
    const raw = parseNumber(input.timeText);
    if (raw !== null && raw > 0) {
      const min = timeToMinutes(raw, input.timeUnit);
      set({ timeUnit: next, timeText: formatField(minutesToTime(min, next), 4) });
      return;
    }
    set({ timeUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="IV flow inputs">
        <div>
          <label className={labelClass} htmlFor="ivflow-drop">
            Drop factor
            <InfoTooltip text="Tubing calibration in drops (gtts) per milliliter." />
          </label>
          <FieldShell error={errors.dropFactorText}>
            <input
              id="ivflow-drop"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.dropFactorText}
              onChange={(e) => set({ dropFactorText: e.target.value })}
              aria-invalid={Boolean(errors.dropFactorText)}
            />
            <span className={unitFixed}>gtts/mL</span>
          </FieldShell>
          {errors.dropFactorText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dropFactorText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ivflow-volume">
            Total volume of drug solution
          </label>
          <FieldShell error={errors.volumeText}>
            <input
              id="ivflow-volume"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.volumeText}
              onChange={(e) => set({ volumeText: e.target.value })}
              aria-invalid={Boolean(errors.volumeText)}
            />
            <select
              className={unitSelectClass}
              value={input.volumeUnit}
              onChange={(e) => changeVolumeUnit(e.target.value as VolumeUnit)}
              aria-label="Volume unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
          </FieldShell>
          {errors.volumeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.volumeText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ivflow-time">
            Infusion time
          </label>
          <FieldShell error={errors.timeText}>
            <input
              id="ivflow-time"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.timeText}
              onChange={(e) => set({ timeText: e.target.value })}
              aria-invalid={Boolean(errors.timeText)}
            />
            <select
              className={unitSelectClass}
              value={input.timeUnit}
              onChange={(e) => changeTimeUnit(e.target.value as TimeUnit)}
              aria-label="Infusion time unit"
            >
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </FieldShell>
          {errors.timeText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.timeText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Fluid rate results">
        <p className="text-[13px] font-semibold text-accent">Fluid rate results</p>
        <div>
          <label className={labelClass} htmlFor="ivflow-drops">
            IV flow rate (in drops)
          </label>
          <FieldShell muted>
            <input
              id="ivflow-drops"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedDrops ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>gtts/min</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="ivflow-flow">
            IV flow rate
          </label>
          <FieldShell muted>
            <input
              id="ivflow-flow"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedFlow ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <select
              className={unitSelectClass}
              value={input.flowVolumeUnit}
              onChange={(e) =>
                set({ flowVolumeUnit: e.target.value as FlowVolumeUnit })
              }
              aria-label="Flow volume unit"
            >
              <option value="mL">mL</option>
              <option value="L">L</option>
            </select>
            <span className="px-1 text-xs text-muted-foreground">/</span>
            <select
              className="h-11 shrink-0 bg-transparent pr-2 text-sm text-primary outline-none"
              value={input.flowTimeUnit}
              onChange={(e) =>
                set({ flowTimeUnit: e.target.value as FlowTimeUnit })
              }
              aria-label="Flow time unit"
            >
              <option value="min">min</option>
              <option value="h">h</option>
            </select>
          </FieldShell>
        </div>
        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>{' '}
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
