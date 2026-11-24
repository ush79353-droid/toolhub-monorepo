'use client';

import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure, getAnalyteOption } from './calculation';
import {
  ANALYTE_OPTIONS,
  type AnalyteId,
  type ConcentrationSource,
  type MmollToMgdlFieldErrors,
  type MmollToMgdlInput,
  type MmollToMgdlResult,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MmollToMgdlDraft {
  analyte: AnalyteId;
  presetSource: ConcentrationSource;
  presetMmolLDisplay: string;
  presetMgDlDisplay: string;
  customOpen: boolean;
  customMolarMassDisplay: string;
  customSource: ConcentrationSource;
  customMmolLDisplay: string;
  customMgDlDisplay: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectFullClass =
  'h-11 w-full shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 font-mono text-[13px] font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:text-sm';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: MmollToMgdlInput): MmollToMgdlDraft {
  return {
    analyte: input.analyte,
    presetSource: input.preset.source,
    presetMmolLDisplay:
      input.preset.mmolL === null || !Number.isFinite(input.preset.mmolL)
        ? ''
        : formatMeasure(input.preset.mmolL),
    presetMgDlDisplay:
      input.preset.mgDl === null || !Number.isFinite(input.preset.mgDl)
        ? ''
        : formatMeasure(input.preset.mgDl),
    customOpen: input.customOpen,
    customMolarMassDisplay:
      input.customMolarMass === null || !Number.isFinite(input.customMolarMass)
        ? ''
        : formatMeasure(input.customMolarMass),
    customSource: input.custom.source,
    customMmolLDisplay:
      input.custom.mmolL === null || !Number.isFinite(input.custom.mmolL)
        ? ''
        : formatMeasure(input.custom.mmolL),
    customMgDlDisplay:
      input.custom.mgDl === null || !Number.isFinite(input.custom.mgDl)
        ? ''
        : formatMeasure(input.custom.mgDl),
  };
}

export function draftToInput(draft: MmollToMgdlDraft): MmollToMgdlInput {
  const presetMmol = parseOptionalNumber(draft.presetMmolLDisplay);
  const presetMg = parseOptionalNumber(draft.presetMgDlDisplay);
  const customMw = parseOptionalNumber(draft.customMolarMassDisplay);
  const customMmol = parseOptionalNumber(draft.customMmolLDisplay);
  const customMg = parseOptionalNumber(draft.customMgDlDisplay);
  return {
    analyte: draft.analyte,
    preset: {
      source: draft.presetSource,
      mmolL: presetMmol,
      mgDl: presetMg,
    },
    customOpen: draft.customOpen,
    customMolarMass: customMw,
    custom: {
      source: draft.customSource,
      mmolL: customMmol,
      mgDl: customMg,
    },
  };
}

export function emptyDraft(): MmollToMgdlDraft {
  return inputToDraft({
    analyte: 'glucose',
    preset: { source: 'mmolL', mmolL: null, mgDl: null },
    customOpen: true,
    customMolarMass: null,
    custom: { source: 'mmolL', mmolL: null, mgDl: null },
  });
}

interface MmollToMgdlFormProps {
  draft: MmollToMgdlDraft;
  errors: MmollToMgdlFieldErrors;
  result: MmollToMgdlResult | null;
  onDraftChange: (draft: MmollToMgdlDraft) => void;
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

export function MmollToMgdlForm({ draft, errors, result, onDraftChange }: MmollToMgdlFormProps) {
  const set = (patch: Partial<MmollToMgdlDraft>) => onDraftChange({ ...draft, ...patch });
  const analyte = getAnalyteOption(draft.analyte);

  const changeAnalyte = (next: AnalyteId) => {
    // Keep the edited preset source value; drop the paired field so the old MW cannot linger.
    if (draft.presetSource === 'mmolL') {
      set({ analyte: next, presetMgDlDisplay: '' });
      return;
    }
    set({ analyte: next, presetMmolLDisplay: '' });
  };

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90"
        role="note"
      >
        <strong>Important:</strong> mmol/L ↔ mg/dL depends on the analyte molar mass. There is no
        universal factor. This page converts units only and does not interpret lab results.
      </div>

      <FieldShell
        label="Molecule"
        htmlFor="mmoll-mgdl-analyte"
        tip="Choose the analyte printed on the laboratory report. Changing molecule clears the derived concentration so an incompatible molar mass is never reused."
      >
        <select
          id="mmoll-mgdl-analyte"
          className={selectFullClass}
          value={draft.analyte}
          onChange={(event) => changeAnalyte(event.target.value as AnalyteId)}
        >
          {ANALYTE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Molar mass"
        htmlFor="mmoll-mgdl-preset-mw"
        tip={`${analyte.sourceNote} Factor = MW ÷ 10 (mg/dL per mmol/L).`}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30">
            <input
              id="mmoll-mgdl-preset-mw"
              readOnly
              tabIndex={0}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={formatMeasure(analyte.molarMassGPerMol)}
              aria-readonly="true"
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            g/mol
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="mmol/L"
        htmlFor="mmoll-mgdl-preset-mmol"
        tip="Millimoles per litre. Editing this field updates mg/dL for the selected molecule."
        error={errors.presetMmolL}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mmoll-mgdl-preset-mmol"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.presetMmolLDisplay}
              placeholder=""
              aria-invalid={Boolean(errors.presetMmolL)}
              onChange={(event) =>
                set({ presetSource: 'mmolL', presetMmolLDisplay: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mmol/L
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="mg/dL"
        htmlFor="mmoll-mgdl-preset-mgdl"
        tip="Milligrams per decilitre. Editing this field updates mmol/L for the selected molecule."
        error={errors.presetMgDl}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mmoll-mgdl-preset-mgdl"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.presetMgDlDisplay}
              placeholder=""
              aria-invalid={Boolean(errors.presetMgDl)}
              onChange={(event) =>
                set({ presetSource: 'mgDl', presetMgDlDisplay: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mg/dL
          </span>
        </div>
      </FieldShell>

      {result?.preset ? (
        <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {result.preset.explanation}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
          onClick={() => set({ customOpen: !draft.customOpen })}
          aria-expanded={draft.customOpen}
        >
          <span className="text-sm font-semibold text-accent">Custom molar mass</span>
          {draft.customOpen ? (
            <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
          )}
        </button>
        {draft.customOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Independent of the preset molecule panel. Enter a positive molar mass, then either
              concentration.
            </p>

            <FieldShell
              label="Customized molar mass"
              htmlFor="mmoll-mgdl-custom-mw"
              tip="Must be positive (g/mol). Non-positive values are rejected and neither concentration is converted."
              error={errors.customMolarMass}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mmoll-mgdl-custom-mw"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.customMolarMassDisplay}
                    placeholder=""
                    aria-invalid={Boolean(errors.customMolarMass)}
                    onChange={(event) => set({ customMolarMassDisplay: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  g/mol
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="mmol/L"
              htmlFor="mmoll-mgdl-custom-mmol"
              tip="Custom-panel millimoles per litre. Does not change the preset molecule fields."
              error={errors.customMmolL}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mmoll-mgdl-custom-mmol"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.customMmolLDisplay}
                    placeholder=""
                    aria-invalid={Boolean(errors.customMmolL)}
                    onChange={(event) =>
                      set({ customSource: 'mmolL', customMmolLDisplay: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  mmol/L
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="mg/dL"
              htmlFor="mmoll-mgdl-custom-mgdl"
              tip="Custom-panel milligrams per decilitre. Does not change the preset molecule fields."
              error={errors.customMgDl}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mmoll-mgdl-custom-mgdl"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.customMgDlDisplay}
                    placeholder=""
                    aria-invalid={Boolean(errors.customMgDl)}
                    onChange={(event) =>
                      set({ customSource: 'mgDl', customMgDlDisplay: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  mg/dL
                </span>
              </div>
            </FieldShell>

            {result?.custom ? (
              <p className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                {result.custom.explanation}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
