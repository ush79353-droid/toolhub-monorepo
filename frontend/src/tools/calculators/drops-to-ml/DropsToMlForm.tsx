'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calibrateDropsPerMl,
  dropsPerMlFromVolumePerDrop,
  formatMeasure,
  mlPerDrop,
} from './calculation';
import {
  DEFAULT_DROPS_PER_ML,
  type CalcSource,
  type DropsToMlFieldErrors,
  type DropsToMlInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber, validateCalibration } from './validation';

export interface DropsToMlDraft {
  source: CalcSource;
  drops: string;
  ml: string;
  dropsPerMl: string;
  /** Mirror of 1 / dropsPerMl for editing volume-per-drop. */
  volumePerDrop: string;
  settingsOpen: boolean;
  calibrateOpen: boolean;
  observedDrops: string;
  measuredMl: string;
  calibrationError: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: DropsToMlInput,
  extras?: Partial<DropsToMlDraft>
): DropsToMlDraft {
  const factor = input.dropsPerMl;
  return {
    source: input.source,
    drops: input.drops === null ? '' : formatMeasure(input.drops),
    ml: input.ml === null ? '' : formatMeasure(input.ml),
    dropsPerMl: factor === null ? '' : formatMeasure(factor),
    volumePerDrop:
      factor !== null && factor > 0 ? formatMeasure(mlPerDrop(factor)) : '',
    settingsOpen: false,
    calibrateOpen: false,
    observedDrops: '',
    measuredMl: '',
    calibrationError: '',
    moreOpen: false,
    ...extras,
  };
}

export function draftToInput(draft: DropsToMlDraft): DropsToMlInput {
  return {
    source: draft.source,
    drops: parseOptionalNumber(draft.drops),
    ml: parseOptionalNumber(draft.ml),
    dropsPerMl: parseOptionalNumber(draft.dropsPerMl),
  };
}

interface DropsToMlFormProps {
  draft: DropsToMlDraft;
  errors: DropsToMlFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: DropsToMlDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
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

export function DropsToMlForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: DropsToMlFormProps) {
  const set = (patch: Partial<DropsToMlDraft>) => onDraftChange({ ...draft, ...patch });

  const changeDropsPerMl = (raw: string) => {
    const parsed = parseOptionalNumber(raw);
    const volumePerDrop =
      parsed !== null && Number.isFinite(parsed) && parsed > 0
        ? formatMeasure(mlPerDrop(parsed))
        : draft.volumePerDrop;
    set({ dropsPerMl: raw, volumePerDrop });
  };

  const changeVolumePerDrop = (raw: string) => {
    const parsed = parseOptionalNumber(raw);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ volumePerDrop: raw });
      return;
    }
    set({
      volumePerDrop: raw,
      dropsPerMl: formatMeasure(dropsPerMlFromVolumePerDrop(parsed)),
    });
  };

  const applyCalibration = () => {
    const observed = parseOptionalNumber(draft.observedDrops);
    const measured = parseOptionalNumber(draft.measuredMl);
    const check = validateCalibration(observed, measured);
    if (!check.isValid) {
      set({ calibrationError: check.error ?? 'Invalid calibration inputs.' });
      return;
    }
    const factor = calibrateDropsPerMl(observed!, measured!);
    set({
      dropsPerMl: formatMeasure(factor),
      volumePerDrop: formatMeasure(mlPerDrop(factor)),
      calibrationError: '',
      calibrateOpen: false,
      settingsOpen: true,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Drops"
        htmlFor="drops-ml-drops"
        tip="Editing drops recalculates milliliters using the active drops-per-mL factor."
        error={errors.drops}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="drops-ml-drops"
              inputMode="decimal"
              className={inputClass}
              value={draft.drops}
              placeholder="Enter number of drops"
              aria-invalid={Boolean(errors.drops)}
              onChange={(event) =>
                set({ source: 'drops', drops: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass}>drops</span>
        </div>
      </FieldShell>

      <FieldShell
        label="Milliliters (mL)"
        htmlFor="drops-ml-ml"
        tip="Editing milliliters recalculates the estimated drop count."
        error={errors.ml}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="drops-ml-ml"
              inputMode="decimal"
              className={inputClass}
              value={draft.ml}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.ml)}
              onChange={(event) => set({ source: 'ml', ml: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass}>mL</span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        Drop volume varies by liquid and dispensing device. This calculator uses an
        assumed or user-supplied drop factor and is intended for general measurement
        conversions. For medication or clinical use, follow the product&apos;s
        instructions and use an appropriately calibrated device.
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.settingsOpen}
          onClick={() => set({ settingsOpen: !draft.settingsOpen })}
        >
          <span>Drop size settings</span>
          {draft.settingsOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.settingsOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-2">
            <FieldShell
              label="Drops per mL"
              htmlFor="drops-ml-factor"
              tip="Default reference assumption is 20 drops/mL (≈ 0.05 mL per drop). This is not universally exact."
              error={errors.dropsPerMl}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="drops-ml-factor"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.dropsPerMl}
                    placeholder="20"
                    aria-invalid={Boolean(errors.dropsPerMl)}
                    onChange={(event) => changeDropsPerMl(event.target.value)}
                  />
                </div>
                <span className={unitBadgeClass}>drops/mL</span>
              </div>
            </FieldShell>
            <FieldShell
              label="Volume per drop (mL)"
              htmlFor="drops-ml-per-drop"
              tip="Editing this updates drops per mL as 1 ÷ volume per drop."
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="drops-ml-per-drop"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.volumePerDrop}
                    placeholder="0.05"
                    onChange={(event) => changeVolumePerDrop(event.target.value)}
                  />
                </div>
                <span className={unitBadgeClass}>mL</span>
              </div>
            </FieldShell>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() =>
                set({
                  dropsPerMl: formatMeasure(DEFAULT_DROPS_PER_ML),
                  volumePerDrop: formatMeasure(mlPerDrop(DEFAULT_DROPS_PER_ML)),
                })
              }
            >
              Restore default factor (20)
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.calibrateOpen}
          onClick={() => set({ calibrateOpen: !draft.calibrateOpen })}
        >
          <span>Calibrate your dropper</span>
          {draft.calibrateOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.calibrateOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-2">
            <p className="text-xs text-muted-foreground">
              Enter an observed drop count and measured volume for your liquid and
              dropper. Calibration is condition-specific and is not a clinical or
              certified measurement.
            </p>
            <FieldShell label="Observed drops" htmlFor="drops-ml-obs">
              <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="drops-ml-obs"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.observedDrops}
                  placeholder="e.g. 50"
                  onChange={(event) =>
                    set({ observedDrops: event.target.value, calibrationError: '' })
                  }
                />
              </div>
            </FieldShell>
            <FieldShell label="Measured volume (mL)" htmlFor="drops-ml-meas">
              <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="drops-ml-meas"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.measuredMl}
                  placeholder="e.g. 2"
                  onChange={(event) =>
                    set({ measuredMl: event.target.value, calibrationError: '' })
                  }
                />
              </div>
            </FieldShell>
            {draft.calibrationError ? (
              <p className="text-xs text-red-600" role="alert">
                {draft.calibrationError}
              </p>
            ) : null}
            <Button type="button" className="h-10" onClick={applyCalibration}>
              Apply calibrated factor
            </Button>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatMeasure(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid conversion to see related volume units.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
