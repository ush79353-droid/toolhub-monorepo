'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, proteinFromGdl, proteinToGdl, parseNumber } from './calculation';
import type {
  LightsCriteriaFieldErrors,
  LightsCriteriaInput,
  LightsCriteriaResult,
  ProteinUnit,
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
  input: LightsCriteriaInput;
  errors: LightsCriteriaFieldErrors;
  result: LightsCriteriaResult;
  onChange: (input: LightsCriteriaInput) => void;
}

export function LightsCriteriaForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<LightsCriteriaInput>) =>
    onChange({ ...input, ...patch });

  const switchProteinUnit = (next: ProteinUnit) => {
    if (next === input.proteinUnit) return;
    const pleural = parseNumber(input.pleuralProteinText);
    const serum = parseNumber(input.serumProteinText);
    const patch: Partial<LightsCriteriaInput> = { proteinUnit: next };
    if (pleural !== null) {
      const gDl = proteinToGdl(pleural, input.proteinUnit);
      patch.pleuralProteinText = formatMeasure(proteinFromGdl(gDl, next), 4);
    }
    if (serum !== null) {
      const gDl = proteinToGdl(serum, input.proteinUnit);
      patch.serumProteinText = formatMeasure(proteinFromGdl(gDl, next), 4);
    }
    set(patch);
  };

  const classificationLabel =
    result.classification === 'exudate'
      ? 'Exudate'
      : result.classification === 'transudate'
        ? 'Transudate'
        : result.classification === 'invalid'
          ? 'Invalid input'
          : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Light's criteria inputs">
        <div>
          <label className={labelClass} htmlFor="lights-pleural-protein">
            Pleural fluid protein
            <InfoTooltip text="Protein concentration in pleural fluid. Use the same unit as serum protein. Ratio >0.5 (strict) supports exudate." />
          </label>
          <FieldShell error={errors.pleuralProteinText}>
            <input
              id="lights-pleural-protein"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pleuralProteinText}
              onChange={(e) => set({ pleuralProteinText: e.target.value })}
              aria-invalid={Boolean(errors.pleuralProteinText)}
            />
            <select
              className={unitSelectClass}
              value={input.proteinUnit}
              onChange={(e) =>
                switchProteinUnit(e.target.value as ProteinUnit)
              }
              aria-label="Protein unit"
            >
              <option value="g_dl">g/dL</option>
              <option value="g_l">g/L</option>
            </select>
          </FieldShell>
          {errors.pleuralProteinText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.pleuralProteinText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lights-serum-protein">
            Serum protein
            <InfoTooltip text="Simultaneous serum total protein in the same unit as pleural protein." />
          </label>
          <FieldShell error={errors.serumProteinText}>
            <input
              id="lights-serum-protein"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumProteinText}
              onChange={(e) => set({ serumProteinText: e.target.value })}
              aria-invalid={Boolean(errors.serumProteinText)}
            />
            <span className="shrink-0 px-2 text-sm text-muted-foreground">
              {input.proteinUnit === 'g_dl' ? 'g/dL' : 'g/L'}
            </span>
          </FieldShell>
          {errors.serumProteinText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.serumProteinText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lights-pleural-ldh">
            Pleural fluid LDH
            <InfoTooltip text="Pleural fluid lactate dehydrogenase in U/L. Used for LDH ratio and absolute criterion vs ⅔×ULN." />
          </label>
          <FieldShell error={errors.pleuralLdhText}>
            <input
              id="lights-pleural-ldh"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.pleuralLdhText}
              onChange={(e) => set({ pleuralLdhText: e.target.value })}
              aria-invalid={Boolean(errors.pleuralLdhText)}
            />
            <span className="shrink-0 px-2 text-sm text-muted-foreground">
              U/L
            </span>
          </FieldShell>
          {errors.pleuralLdhText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.pleuralLdhText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lights-serum-ldh">
            Serum LDH
            <InfoTooltip text="Serum LDH in U/L for the LDH ratio (pleural/serum >0.6 is exudative)." />
          </label>
          <FieldShell error={errors.serumLdhText}>
            <input
              id="lights-serum-ldh"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.serumLdhText}
              onChange={(e) => set({ serumLdhText: e.target.value })}
              aria-invalid={Boolean(errors.serumLdhText)}
            />
            <span className="shrink-0 px-2 text-sm text-muted-foreground">
              U/L
            </span>
          </FieldShell>
          {errors.serumLdhText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.serumLdhText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lights-ldh-uln">
            Upper normal limit of LDH
            <InfoTooltip text="Your lab’s serum LDH upper reference limit (U/L). Absolute criterion: pleural LDH > (2/3) × this value." />
          </label>
          <FieldShell error={errors.ldhUpperLimitText}>
            <input
              id="lights-ldh-uln"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ldhUpperLimitText}
              onChange={(e) => set({ ldhUpperLimitText: e.target.value })}
              aria-invalid={Boolean(errors.ldhUpperLimitText)}
            />
            <span className="shrink-0 px-2 text-sm text-muted-foreground">
              U/L
            </span>
          </FieldShell>
          {errors.ldhUpperLimitText ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.ldhUpperLimitText}
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="lights-result">
            Classification
            <InfoTooltip text="Exudate if any Light’s criterion is met with a strict greater-than cut-off. Transudate only when all three criteria are assessable and negative." />
          </label>
          <FieldShell muted>
            <input
              id="lights-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={classificationLabel}
              aria-live="polite"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        {result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}

        <p className="text-sm">
          <a
            href="#introduction"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Check out <strong>how to use this calculator!</strong>
          </a>
        </p>
      </section>
    </form>
  );
}
