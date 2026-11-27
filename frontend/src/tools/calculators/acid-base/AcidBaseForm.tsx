'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AcidBaseFieldErrors,
  AcidBaseInput,
  AcidBaseResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-primary';
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
  input: AcidBaseInput;
  errors: AcidBaseFieldErrors;
  result: AcidBaseResult | null;
  onChange: (input: AcidBaseInput) => void;
}

export function AcidBaseForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<AcidBaseInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Arterial blood gas">
        <p className="text-sm font-semibold text-accent">Arterial blood gas</p>

        <div>
          <label className={labelClass} htmlFor="ab-ph">
            pH
            <InfoTooltip text="Arterial blood pH. Used with PCO₂ and HCO₃ for educational acid–base framing." />
          </label>
          <FieldShell error={errors.phText}>
            <input
              id="ab-ph"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.phText}
              onChange={(e) => set({ phText: e.target.value })}
              aria-invalid={Boolean(errors.phText)}
            />
          </FieldShell>
          {errors.phText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.phText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ab-pco2">
            PCO₂
            <InfoTooltip text="Arterial partial pressure of carbon dioxide." />
          </label>
          <FieldShell error={errors.pco2Text}>
            <input
              id="ab-pco2"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pco2Text}
              onChange={(e) => set({ pco2Text: e.target.value })}
              aria-invalid={Boolean(errors.pco2Text)}
            />
            <span className={unitFixed}>mmHg</span>
          </FieldShell>
          {errors.pco2Text ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pco2Text}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ab-hco3">
            Bicarbonate (HCO₃⁻)
            <InfoTooltip text="Serum/plasma bicarbonate used for both ABG framing and the anion gap." />
          </label>
          <FieldShell error={errors.bicarbonateText}>
            <input
              id="ab-hco3"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bicarbonateText}
              onChange={(e) => set({ bicarbonateText: e.target.value })}
              aria-invalid={Boolean(errors.bicarbonateText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.bicarbonateText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bicarbonateText}</p>
          ) : null}
        </div>

        {result?.abgHeadline ? (
          <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs leading-relaxed text-accent">
            <p className="font-semibold">{result.abgHeadline}</p>
            {result.abgDetail ? (
              <p className="mt-1 text-accent/90">{result.abgDetail}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className={sectionClass} aria-label="Anion gap values">
        <p className="text-sm font-semibold text-accent">Anion gap values</p>

        <div>
          <label className={labelClass} htmlFor="ab-cl">
            Chloride (Cl⁻)
            <InfoTooltip text="Serum chloride. mEq/L equals mmol/L for Cl⁻." />
          </label>
          <FieldShell error={errors.chlorideText}>
            <input
              id="ab-cl"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.chlorideText}
              onChange={(e) => set({ chlorideText: e.target.value })}
              aria-invalid={Boolean(errors.chlorideText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.chlorideText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.chlorideText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ab-na">
            Sodium (Na⁺)
            <InfoTooltip text="Serum sodium. mEq/L equals mmol/L for Na⁺." />
          </label>
          <FieldShell error={errors.sodiumText}>
            <input
              id="ab-na"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sodiumText}
              onChange={(e) => set({ sodiumText: e.target.value })}
              aria-invalid={Boolean(errors.sodiumText)}
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
          {errors.sodiumText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sodiumText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ab-alb">
            Albumin
            <InfoTooltip text="Serum albumin for Figge-style correction. Corrected AG stays blank until albumin is entered." />
          </label>
          <FieldShell error={errors.albuminText}>
            <input
              id="ab-alb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.albuminText}
              onChange={(e) => set({ albuminText: e.target.value })}
              aria-invalid={Boolean(errors.albuminText)}
            />
            <span className={unitFixed}>g/dL</span>
          </FieldShell>
          {errors.albuminText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.albuminText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Results">
        <div>
          <label className={labelClass} htmlFor="ab-ag">
            Anion gap
            <InfoTooltip text="AG = Na − Cl − HCO₃ (mEq/L)." />
          </label>
          <FieldShell muted>
            <input
              id="ab-ag"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedAnionGap ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="ab-cag">
            Corrected anion gap
            <InfoTooltip text="cAG = AG + 2.5 × (4.0 − albumin g/dL)." />
          </label>
          <FieldShell muted>
            <input
              id="ab-cag"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={result?.formattedCorrected ?? ''}
              aria-live="polite"
              aria-readonly="true"
            />
            <span className={unitFixed}>mEq/L</span>
          </FieldShell>
        </div>

        {result?.statusHeadline ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-accent">{result.statusHeadline}</span>
            {result.statusDetail ? ` ${result.statusDetail}` : ''}
          </p>
        ) : null}
      </section>
    </form>
  );
}
