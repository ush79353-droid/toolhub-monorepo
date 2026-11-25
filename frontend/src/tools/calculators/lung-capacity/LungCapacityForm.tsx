'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { fromLiters, parseNumber, toLiters } from './calculation';
import type {
  LungCapacityFieldErrors,
  LungCapacityInput,
  LungCapacityResult,
  VolumeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitSelectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-primary outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';

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

interface FormProps {
  input: LungCapacityInput;
  errors: LungCapacityFieldErrors;
  result: LungCapacityResult | null;
  onChange: (input: LungCapacityInput) => void;
}

export function LungCapacityForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<LungCapacityInput>) =>
    onChange({ ...input, ...patch });

  const switchUnit = (next: VolumeUnit) => {
    if (next === input.unit) return;
    const convert = (raw: string) => {
      const n = parseNumber(raw);
      if (n === null) return raw;
      const liters = toLiters(n, input.unit);
      const v = fromLiters(liters, next);
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 4,
        useGrouping: false,
      }).format(v);
    };
    set({
      unit: next,
      irvText: convert(input.irvText),
      tvText: convert(input.tvText),
      ervText: convert(input.ervText),
      rvText: convert(input.rvText),
    });
  };

  const volumeField = (
    id: string,
    label: string,
    tip: string,
    value: string,
    error: string | undefined,
    key: keyof Pick<
      LungCapacityInput,
      'irvText' | 'tvText' | 'ervText' | 'rvText'
    >,
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        <InfoTooltip text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          value={value}
          onChange={(e) => set({ [key]: e.target.value })}
          aria-invalid={Boolean(error)}
        />
        <select
          className={unitSelectClass}
          value={input.unit}
          onChange={(e) => switchUnit(e.target.value as VolumeUnit)}
          aria-label={`${label} unit`}
        >
          <option value="L">L</option>
          <option value="mL">mL</option>
        </select>
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );

  const capacityField = (label: string, value: string) => (
    <div>
      <div className={labelClass}>{label}</div>
      <FieldShell muted>
        <input
          readOnly
          className={inputClass}
          value={value}
          aria-label={label}
        />
        <span className="shrink-0 pr-3 font-mono text-xs text-muted-foreground">
          {input.unit}
        </span>
      </FieldShell>
    </div>
  );

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Lung volumes">
        <h3 className="text-sm font-semibold text-accent">lung volumes</h3>
        {volumeField(
          'lc-irv',
          'Inspiratory reserve volume (IRV)',
          'Extra volume that can be inspired after a normal tidal inspiration.',
          input.irvText,
          errors.irvText,
          'irvText',
        )}
        {volumeField(
          'lc-tv',
          'Tidal volume (TV)',
          'Volume inspired or expired during quiet breathing.',
          input.tvText,
          errors.tvText,
          'tvText',
        )}
        {volumeField(
          'lc-erv',
          'Expiratory reserve volume (ERV)',
          'Extra volume that can be expired after a normal tidal expiration.',
          input.ervText,
          errors.ervText,
          'ervText',
        )}
        {volumeField(
          'lc-rv',
          'Residual volume (RV)',
          'Volume remaining after maximal expiration.',
          input.rvText,
          errors.rvText,
          'rvText',
        )}
      </section>

      <section className={sectionClass} aria-label="Lung capacities">
        <h3 className="text-sm font-semibold text-accent">lung capacities</h3>
        {capacityField('Total lung capacity (TLC)', result?.formattedTlc ?? '')}
        {capacityField('Vital capacity (VC)', result?.formattedVc ?? '')}
        {capacityField(
          'Functional residual capacity (FRC)',
          result?.formattedFrc ?? '',
        )}
        {capacityField('Inspiratory capacity (IC)', result?.formattedIc ?? '')}
        {result ? (
          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        ) : null}
      </section>
    </form>
  );
}
