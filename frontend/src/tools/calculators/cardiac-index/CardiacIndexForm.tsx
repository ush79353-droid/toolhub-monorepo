'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  contentToUnit,
  estimatedVo2MlPerMin,
  formatCardiacIndex,
  heightToCm,
  mostellerBsaM2,
  oxygenContentMlPerDl,
  parseNumber,
  tensionToTorr,
  weightToKg,
} from './calculation';
import type {
  CardiacIndexFieldErrors,
  CardiacIndexInput,
  CardiacIndexResult,
  HeightUnit,
  KnowsCardiacOutput,
  TensionUnit,
  WeightUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-r-lg border-l border-border bg-muted/30 px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed =
  'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: CardiacIndexInput;
  errors: CardiacIndexFieldErrors;
  result: CardiacIndexResult | null;
  onChange: (input: CardiacIndexInput) => void;
}

export function CardiacIndexForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<CardiacIndexInput>) =>
    onChange({ ...input, ...patch });

  const switchMode = (mode: KnowsCardiacOutput) => {
    if (mode === input.knowsCardiacOutput) return;
    // Clear obsolete branch fields when switching (prompt requirement).
    if (mode === 'yes') {
      onChange({
        ...input,
        knowsCardiacOutput: 'yes',
        hemoglobinText: '',
        oxygenConsumptionText: '',
        arterialSaturationText: '',
        arterialTensionText: '',
        venousSaturationText: '',
        venousTensionText: '',
      });
    } else {
      onChange({
        ...input,
        knowsCardiacOutput: 'no',
        cardiacOutputText: '',
      });
    }
  };

  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);
  let liveBsa: number | null = null;
  if (heightRaw != null && weightRaw != null && heightRaw > 0 && weightRaw > 0) {
    try {
      liveBsa = mostellerBsaM2(
        heightToCm(heightRaw, input.heightUnit),
        weightToKg(weightRaw, input.weightUnit),
      );
    } catch {
      liveBsa = null;
    }
  }
  const liveVo2 =
    input.oxygenConsumptionText.trim() !== ''
      ? parseNumber(input.oxygenConsumptionText)
      : liveBsa != null
        ? estimatedVo2MlPerMin(liveBsa)
        : null;

  const previewContent = (
    satText: string,
    tenText: string,
    tenUnit: TensionUnit,
  ): number | null => {
    const hb = parseNumber(input.hemoglobinText);
    const sat = parseNumber(satText);
    const ten = parseNumber(tenText);
    if (hb == null || sat == null || ten == null) return null;
    if (!(hb > 0) || sat < 0 || sat > 100 || ten < 0) return null;
    try {
      const mlDl = oxygenContentMlPerDl(
        hb,
        sat,
        tensionToTorr(ten, tenUnit),
      );
      return contentToUnit(mlDl, 'mL/L');
    } catch {
      return null;
    }
  };

  const artPreview = previewContent(
    input.arterialSaturationText,
    input.arterialTensionText,
    input.arterialTensionUnit,
  );
  const venPreview = previewContent(
    input.venousSaturationText,
    input.venousTensionText,
    input.venousTensionUnit,
  );

  const ciDisplay = formatCardiacIndex(result?.cardiacIndexLPerMinPerM2 ?? null);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-[13px] leading-relaxed text-accent">
        <p className="font-semibold text-amber-950">
          Educational hemodynamics — not clinical advice
        </p>
        <p className="mt-1.5 text-foreground/85">
          Cardiac index is cardiac output divided by Mosteller body surface area.
          Values stay in your browser; share uses the page URL only.
        </p>
      </div>

      <section className={sectionClass} aria-label="Cardiac index inputs">
        <div>
          <p className={labelClass}>Do you know the cardiac output?</p>
          <div
            role="radiogroup"
            aria-label="Do you know the cardiac output?"
            className="flex flex-wrap gap-4"
          >
            {(
              [
                ['yes', 'Yes'],
                ['no', 'No'],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="ci-knows-co"
                  className="h-4 w-4 accent-primary"
                  checked={input.knowsCardiacOutput === value}
                  onChange={() => switchMode(value)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {input.knowsCardiacOutput === 'yes' ? (
          <div>
            <label className={labelClass} htmlFor="ci-co">
              Cardiac output
              <InfoTooltip text="Enter measured or previously calculated cardiac output in liters per minute." />
            </label>
            <FieldShell error={errors.cardiacOutputText}>
              <input
                id="ci-co"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.cardiacOutputText}
                onChange={(e) => set({ cardiacOutputText: e.target.value })}
                aria-invalid={Boolean(errors.cardiacOutputText)}
              />
              <span className={unitFixed}>L/min</span>
            </FieldShell>
            {errors.cardiacOutputText ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.cardiacOutputText}
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="ci-height">
            Height
          </label>
          <FieldShell error={errors.heightText}>
            <input
              id="ci-height"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.heightText}
              onChange={(e) => set({ heightText: e.target.value })}
              aria-invalid={Boolean(errors.heightText)}
            />
            <select
              aria-label="Height unit"
              className={selectClass}
              value={input.heightUnit}
              onChange={(e) => {
                const next = e.target.value as HeightUnit;
                const n = parseNumber(input.heightText);
                if (n != null && n > 0) {
                  const cm = heightToCm(n, input.heightUnit);
                  const converted =
                    next === 'in' ? cm / 2.54 : cm;
                  set({
                    heightUnit: next,
                    heightText: String(
                      Math.round(converted * 10000) / 10000,
                    ),
                  });
                } else {
                  set({ heightUnit: next });
                }
              }}
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </FieldShell>
          {errors.heightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.heightText}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ci-weight">
            Weight
          </label>
          <FieldShell error={errors.weightText}>
            <input
              id="ci-weight"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.weightText}
              onChange={(e) => set({ weightText: e.target.value })}
              aria-invalid={Boolean(errors.weightText)}
            />
            <select
              aria-label="Weight unit"
              className={selectClass}
              value={input.weightUnit}
              onChange={(e) => {
                const next = e.target.value as WeightUnit;
                const n = parseNumber(input.weightText);
                if (n != null && n > 0) {
                  const kg = weightToKg(n, input.weightUnit);
                  const converted =
                    next === 'lb' ? kg / 0.45359237 : kg;
                  set({
                    weightUnit: next,
                    weightText: String(
                      Math.round(converted * 10000) / 10000,
                    ),
                  });
                } else {
                  set({ weightUnit: next });
                }
              }}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </FieldShell>
          {errors.weightText ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weightText}</p>
          ) : null}
        </div>

        {input.knowsCardiacOutput === 'no' ? (
          <>
            <div>
              <label className={labelClass} htmlFor="ci-bsa">
                Body surface area
              </label>
              <FieldShell>
                <input
                  id="ci-bsa"
                  type="text"
                  readOnly
                  className={`${inputClass} bg-muted/15`}
                  value={
                    liveBsa != null
                      ? (Math.round(liveBsa * 10000) / 10000).toFixed(4)
                      : ''
                  }
                  aria-label="Body surface area Mosteller"
                />
                <span className={unitFixed}>m²</span>
              </FieldShell>
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-vo2">
                O₂ consumption
                <InfoTooltip text="Leave blank to use the estimated resting VO₂ = 125 × BSA mL/min, or enter a measured value." />
              </label>
              <FieldShell error={errors.oxygenConsumptionText}>
                <input
                  id="ci-vo2"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.oxygenConsumptionText}
                  placeholder={
                    liveVo2 != null && input.oxygenConsumptionText.trim() === ''
                      ? String(Math.round(liveVo2 * 10) / 10)
                      : undefined
                  }
                  onChange={(e) =>
                    set({ oxygenConsumptionText: e.target.value })
                  }
                  aria-invalid={Boolean(errors.oxygenConsumptionText)}
                />
                <span className={unitFixed}>mL/min</span>
              </FieldShell>
              {input.oxygenConsumptionText.trim() === '' && liveVo2 != null ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimated from BSA (editable).
                </p>
              ) : null}
              {errors.oxygenConsumptionText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.oxygenConsumptionText}
                </p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="ci-hb">
                Hemoglobin
              </label>
              <FieldShell error={errors.hemoglobinText}>
                <input
                  id="ci-hb"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.hemoglobinText}
                  onChange={(e) => set({ hemoglobinText: e.target.value })}
                  aria-invalid={Boolean(errors.hemoglobinText)}
                />
                <span className={unitFixed}>g/dL</span>
              </FieldShell>
              {errors.hemoglobinText ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.hemoglobinText}
                </p>
              ) : null}
            </div>

            <BloodPanel
              title="Arterial blood"
              open={input.arterialOpen}
              onToggle={() => set({ arterialOpen: !input.arterialOpen })}
              satId="ci-art-sat"
              satValue={input.arterialSaturationText}
              satError={errors.arterialSaturationText}
              onSat={(v) => set({ arterialSaturationText: v })}
              tenId="ci-art-ten"
              tenValue={input.arterialTensionText}
              tenUnit={input.arterialTensionUnit}
              tenError={errors.arterialTensionText}
              onTen={(v) => set({ arterialTensionText: v })}
              onTenUnit={(u) => set({ arterialTensionUnit: u })}
              concValue={artPreview}
            />

            <BloodPanel
              title="Venous blood"
              open={input.venousOpen}
              onToggle={() => set({ venousOpen: !input.venousOpen })}
              satId="ci-ven-sat"
              satValue={input.venousSaturationText}
              satError={errors.venousSaturationText}
              onSat={(v) => set({ venousSaturationText: v })}
              tenId="ci-ven-ten"
              tenValue={input.venousTensionText}
              tenUnit={input.venousTensionUnit}
              tenError={errors.venousTensionText}
              onTen={(v) => set({ venousTensionText: v })}
              onTenUnit={(u) => set({ venousTensionUnit: u })}
              concValue={venPreview}
            />
          </>
        ) : null}
      </section>

      <section
        className={sectionClass}
        aria-labelledby="ci-results-heading"
      >
        <h3
          id="ci-results-heading"
          className="text-[15px] font-semibold text-accent"
        >
          Results
        </h3>
        <div>
          <label className={labelClass} htmlFor="ci-result">
            Cardiac index
          </label>
          <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
            <input
              id="ci-result"
              type="text"
              readOnly
              aria-label="Cardiac index liters per minute per square meter"
              className="h-11 w-full min-w-0 bg-transparent text-sm tabular-nums text-accent outline-none"
              value={ciDisplay}
            />
            <span className={unitFixed}>L/min/m²</span>
          </div>
        </div>
        {result?.statusDetail ? (
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
        {result?.mode === 'no' && result.cardiacOutputLPerMin != null ? (
          <p className="text-[13px] text-muted-foreground">
            Fick cardiac output:{' '}
            <span className="font-medium tabular-nums text-accent">
              {(Math.round(result.cardiacOutputLPerMin * 100) / 100).toFixed(2)}{' '}
              L/min
            </span>
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </section>
    </form>
  );
}

function BloodPanel({
  title,
  open,
  onToggle,
  satId,
  satValue,
  satError,
  onSat,
  tenId,
  tenValue,
  tenUnit,
  tenError,
  onTen,
  onTenUnit,
  concValue,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  satId: string;
  satValue: string;
  satError?: string;
  onSat: (v: string) => void;
  tenId: string;
  tenValue: string;
  tenUnit: TensionUnit;
  tenError?: string;
  onTen: (v: string) => void;
  onTenUnit: (u: TensionUnit) => void;
  concValue: number | null;
}) {
  return (
    <section className={sectionClass}>
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="text-primary" aria-hidden>
          {open ? '▲' : '▼'}
        </span>
        <h4 className="text-[15px] font-semibold text-accent">{title}</h4>
      </button>
      {open ? (
        <div className="space-y-3.5">
          <div>
            <label className={labelClass} htmlFor={satId}>
              Oxygen saturation
            </label>
            <FieldShell error={satError}>
              <input
                id={satId}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={satValue}
                onChange={(e) => onSat(e.target.value)}
              />
              <span className={unitFixed}>%</span>
            </FieldShell>
            {satError ? (
              <p className="mt-1 text-xs text-rose-600">{satError}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor={tenId}>
              Oxygen tension
            </label>
            <FieldShell error={tenError}>
              <input
                id={tenId}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={tenValue}
                onChange={(e) => onTen(e.target.value)}
              />
              <select
                aria-label={`${title} tension unit`}
                className={selectClass}
                value={tenUnit}
                onChange={(e) => onTenUnit(e.target.value as TensionUnit)}
              >
                <option value="Torr">Torr</option>
                <option value="kPa">kPa</option>
              </select>
            </FieldShell>
            {tenError ? (
              <p className="mt-1 text-xs text-rose-600">{tenError}</p>
            ) : null}
          </div>
          <div>
            <p className={labelClass}>Oxygen concentration</p>
            <div className="relative flex h-11 items-center rounded-lg border border-border bg-muted/15 px-3">
              <input
                type="text"
                readOnly
                aria-label={`${title} oxygen concentration`}
                className="h-11 w-full min-w-0 bg-transparent text-sm tabular-nums text-accent outline-none"
                value={
                  concValue != null
                    ? (Math.round(concValue * 100) / 100).toFixed(2)
                    : ''
                }
              />
              <span className={unitFixed}>mL/L</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
