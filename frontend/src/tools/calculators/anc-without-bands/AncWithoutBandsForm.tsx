'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatCount } from './calculation';
import type {
  AncWithoutBandsFieldErrors,
  AncWithoutBandsInput,
  AncWithoutBandsResult,
  LabReportMode,
} from './types';
import { modeUsesBands, primaryFieldLabel } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

const LAB_MODES: { value: LabReportMode; label: string }[] = [
  { value: 'neut', label: 'NEUT' },
  { value: 'poly', label: 'POLY' },
  { value: 'poly_plus_bands', label: 'POLY + Bands' },
  { value: 'segs_plus_bands', label: 'SEGS + Bands' },
];

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
  input: AncWithoutBandsInput;
  errors: AncWithoutBandsFieldErrors;
  result: AncWithoutBandsResult | null;
  onChange: (input: AncWithoutBandsInput) => void;
}

export function AncWithoutBandsForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AncWithoutBandsInput>) =>
    onChange({ ...input, ...patch });

  const setMode = (labReportMode: LabReportMode) => {
    if (!modeUsesBands(labReportMode)) {
      set({ labReportMode, bandsPercentText: '' });
      return;
    }
    set({ labReportMode });
  };

  const ancDisplay =
    result?.ancCellsPerMicroliter != null
      ? formatCount(result.ancCellsPerMicroliter)
      : '';
  const primaryLabel = primaryFieldLabel(input.labReportMode);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="WBC count">
        <div>
          <label className={labelClass} htmlFor="anc-wb-wbc">
            WBC count — white blood cell count
            <InfoTooltip text="Total white blood cell count from the CBC, reported in thousands per microliter (×10³/µL)." />
          </label>
          <FieldShell error={errors.wbcText}>
            <input
              id="anc-wb-wbc"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.wbcText}
              onChange={(e) => set({ wbcText: e.target.value })}
              aria-invalid={Boolean(errors.wbcText)}
            />
            <span className={unitFixed} aria-hidden>
              ×10³/µL
            </span>
          </FieldShell>
          {errors.wbcText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.wbcText}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="Lab report layout">
        <p className={labelClass}>
          Your lab report data
          <InfoTooltip text="Select how your differential reports neutrophils—some panels include band forms inside NEUT, others list POLY, or separate segs and bands." />
        </p>
        <fieldset className="space-y-2">
          <legend className="sr-only">Lab report differential layout</legend>
          {LAB_MODES.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent px-1 py-1.5 text-sm text-accent hover:bg-muted/30"
            >
              <input
                type="radio"
                name="lab-report-mode"
                className="h-4 w-4 accent-primary"
                checked={input.labReportMode === opt.value}
                onChange={() => setMode(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </fieldset>
      </section>

      <section className={sectionClass} aria-label="Neutrophil percentage">
        <div>
          <label className={labelClass} htmlFor="anc-wb-primary-pct">
            {primaryLabel}
            <InfoTooltip text="Neutrophil differential percentage matching the selected lab-report row." />
          </label>
          <FieldShell error={errors.primaryPercentText}>
            <input
              id="anc-wb-primary-pct"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.primaryPercentText}
              onChange={(e) => set({ primaryPercentText: e.target.value })}
              aria-invalid={Boolean(errors.primaryPercentText)}
            />
            <span className={`${unitFixed} text-primary`}>%</span>
          </FieldShell>
          {errors.primaryPercentText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.primaryPercentText}</p>
          ) : null}
        </div>

        {modeUsesBands(input.labReportMode) ? (
          <div>
            <label className={labelClass} htmlFor="anc-wb-bands-pct">
              Bands
              <InfoTooltip text="Neutrophilic band forms as a separate differential percentage." />
            </label>
            <FieldShell error={errors.bandsPercentText}>
              <input
                id="anc-wb-bands-pct"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.bandsPercentText}
                onChange={(e) => set({ bandsPercentText: e.target.value })}
                aria-invalid={Boolean(errors.bandsPercentText)}
              />
              <span className={`${unitFixed} text-primary`}>%</span>
            </FieldShell>
            {errors.bandsPercentText ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bandsPercentText}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="anc-wb-result">
            ANC — absolute neutrophil count
          </label>
          <FieldShell muted>
            <input
              id="anc-wb-result"
              type="text"
              readOnly
              tabIndex={0}
              className={`${inputClass} text-muted-foreground`}
              value={ancDisplay}
              aria-live="polite"
            />
            <span className={unitFixed} aria-hidden>
              cells/µL
            </span>
          </FieldShell>
          {result?.statusDetail && result.ancCellsPerMicroliter != null ? (
            <p className="mt-1.5 text-xs text-muted-foreground">{result.statusDetail}</p>
          ) : null}
        </div>
      </section>
    </form>
  );
}