'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, fromMcg, getSubstanceOption, toMcg } from './calculation';
import {
  MASS_UNIT_OPTIONS,
  SUBSTANCE_OPTIONS,
  type MassUnit,
  type McgIuSubstance,
  type McgToIuFieldErrors,
  type McgToIuInput,
  type McgToIuResult,
} from './types';
import { parseOptionalNumber } from './validation';

export interface McgToIuDraft {
  substance: McgIuSubstance;
  source: 'mass' | 'iu';
  massDisplay: string;
  iuDisplay: string;
  massUnit: MassUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5.5rem]';
const selectFullClass = `${selectClass} w-full font-mono text-[13px] sm:text-sm`;
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: McgToIuInput): McgToIuDraft {
  return {
    substance: input.substance,
    source: input.source,
    massDisplay:
      input.massMcg === null || !Number.isFinite(input.massMcg)
        ? ''
        : formatMeasure(fromMcg(input.massMcg, input.massUnit)),
    iuDisplay: input.iu === null || !Number.isFinite(input.iu) ? '' : formatMeasure(input.iu),
    massUnit: input.massUnit,
  };
}

export function draftToInput(draft: McgToIuDraft): McgToIuInput {
  const massRaw = parseOptionalNumber(draft.massDisplay);
  const iuRaw = parseOptionalNumber(draft.iuDisplay);
  return {
    substance: draft.substance,
    source: draft.source,
    massMcg:
      massRaw === null || !Number.isFinite(massRaw) ? massRaw : toMcg(massRaw, draft.massUnit),
    iu: iuRaw,
    massUnit: draft.massUnit,
  };
}

export function emptyDraft(): McgToIuDraft {
  return {
    substance: 'vitaminD',
    source: 'mass',
    massDisplay: '',
    iuDisplay: '',
    massUnit: 'mcg',
  };
}

interface McgToIuFormProps {
  draft: McgToIuDraft;
  errors: McgToIuFieldErrors;
  result: McgToIuResult | null;
  onDraftChange: (draft: McgToIuDraft) => void;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function McgToIuForm({ draft, errors, result, onDraftChange }: McgToIuFormProps) {
  const set = (patch: Partial<McgToIuDraft>) => onDraftChange({ ...draft, ...patch });
  const substance = getSubstanceOption(draft.substance);
  const isVitaminA = draft.substance.startsWith('vitaminA');
  const massTip = isVitaminA
    ? 'For vitamin A presets, mass is mcg RAE (retinol activity equivalents), not an arbitrary carotenoid mass. Match the form on the label.'
    : draft.substance.startsWith('vitaminE')
      ? 'For vitamin E, mass is α-tocopherol (including labeled ester equivalents). Natural and synthetic factors differ.'
      : 'Enter mass of vitamin D₂ or D₃. 1 mcg = 40 IU for both forms (NIH ODS / FDA).';

  const changeMassUnit = (next: MassUnit) => {
    const parsed = parseOptionalNumber(draft.massDisplay);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: next });
      return;
    }
    const mcg = toMcg(parsed, draft.massUnit);
    set({
      massUnit: next,
      massDisplay: formatMeasure(fromMcg(mcg, next)),
      source: draft.source,
    });
  };

  const changeSubstance = (next: McgIuSubstance) => {
    // Keep the edited source value; drop the paired field so the old factor cannot linger.
    if (draft.source === 'mass') {
      set({ substance: next, iuDisplay: '' });
      return;
    }
    set({ substance: next, massDisplay: '' });
  };

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90"
        role="note"
      >
        <strong>Important:</strong> International Units measure biological activity, not a universal
        mass. Factors are substance- and form-specific (NIH ODS / FDA labeling). This tool does not
        recommend a dose.
      </div>

      <FieldShell
        label="Substance"
        htmlFor="mcg-iu-substance"
        tip="Choose the exact labeled form. Changing substance clears the derived field so an incompatible factor is never reused."
      >
        <select
          id="mcg-iu-substance"
          className={selectFullClass}
          value={draft.substance}
          onChange={(event) => changeSubstance(event.target.value as McgIuSubstance)}
        >
          {SUBSTANCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Weight (mass)"
        htmlFor="mcg-iu-mass"
        tip={massTip}
        error={errors.massMcg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mcg-iu-mass"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.massDisplay}
              placeholder=""
              aria-invalid={Boolean(errors.massMcg)}
              onChange={(event) => set({ source: 'mass', massDisplay: event.target.value })}
            />
          </div>
          <select
            aria-label="Mass unit"
            className={selectClass}
            value={draft.massUnit}
            onChange={(event) => changeMassUnit(event.target.value as MassUnit)}
          >
            {MASS_UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="International units"
        htmlFor="mcg-iu-iu"
        tip={`${substance.sourceNote} IU = mcg ÷ ${substance.mcgPerIu} for this preset.`}
        error={errors.iu}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mcg-iu-iu"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.iuDisplay}
              placeholder=""
              aria-invalid={Boolean(errors.iu)}
              onChange={(event) => set({ source: 'iu', iuDisplay: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            IU
          </span>
        </div>
      </FieldShell>

      {result ? (
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {result.explanation}
        </p>
      ) : null}
    </div>
  );
}
