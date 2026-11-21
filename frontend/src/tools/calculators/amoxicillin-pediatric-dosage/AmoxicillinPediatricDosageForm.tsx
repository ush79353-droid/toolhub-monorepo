'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AmoxicillinPediatricDosageFieldErrors,
  AmoxicillinPediatricDosageInput,
  AmoxicillinPediatricDosageResult,
  Indication,
  Route,
  StrengthMgPer5mL,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-muted-foreground outline-none';

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

function Panel({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" aria-hidden />
        )}
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function RadioRow({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
      <input
        type="radio"
        name={name}
        className="h-4 w-4 accent-primary"
        checked={checked}
        onChange={onChange}
      />
      <span className={checked ? 'font-semibold' : 'font-normal'}>
        {children}
      </span>
    </label>
  );
}

const STRENGTHS: StrengthMgPer5mL[] = [125, 200, 250, 400];

const INDICATIONS: { value: Indication; label: string }[] = [
  { value: 'general', label: 'General dosing' },
  { value: 'strep_a', label: 'Strep A' },
  { value: 'endocarditis', label: 'Endocarditis prophylaxis' },
];

const ROUTES: { value: Route; label: string }[] = [
  { value: 'oral', label: 'Oral (PO)' },
  { value: 'iv', label: 'Intravenous (IV)' },
];

interface AmoxicillinPediatricDosageFormProps {
  input: AmoxicillinPediatricDosageInput;
  errors: AmoxicillinPediatricDosageFieldErrors;
  result: AmoxicillinPediatricDosageResult | null;
  onChange: (input: AmoxicillinPediatricDosageInput) => void;
}

export function AmoxicillinPediatricDosageForm({
  input,
  errors,
  result,
  onChange,
}: AmoxicillinPediatricDosageFormProps) {
  const [recommendedOpen, setRecommendedOpen] = useState(true);
  const [checkOpen, setCheckOpen] = useState(true);

  const set = (patch: Partial<AmoxicillinPediatricDosageInput>) =>
    onChange({ ...input, ...patch });

  const requirementDisplay =
    input.lastEdited === 'requirement'
      ? input.requirementMgPerKg
      : result?.formattedRequirement || input.requirementMgPerKg;

  const doseDisplay =
    input.lastEdited === 'dose'
      ? input.doseValue
      : input.doseUnit === 'mL'
        ? result?.formattedDoseMl || input.doseValue
        : result?.formattedDoseMg || input.doseValue;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational pediatric amoxicillin dose helper (ages 1 month–18 years).
        Labeled oral regimens use WHO-style general ranges, CDC/IDSA strep A,
        and AHA endocarditis prophylaxis. Not a prescription.
      </p>

      <Panel
        title="Recommended dosage"
        open={recommendedOpen}
        onToggle={() => setRecommendedOpen((v) => !v)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="amox-age" className={labelClass}>
              Age
            </label>
            <FieldShell error={errors.age}>
              <input
                id="amox-age"
                className={inputClass}
                inputMode="decimal"
                value={input.age}
                aria-invalid={Boolean(errors.age)}
                onChange={(e) =>
                  set({ age: e.target.value, lastEdited: 'params' })
                }
              />
              <select
                className={selectClass}
                aria-label="Age unit"
                value={input.ageUnit}
                onChange={(e) =>
                  set({
                    ageUnit: e.target.value as 'mos' | 'yrs',
                    lastEdited: 'params',
                  })
                }
              >
                <option value="mos">mos</option>
                <option value="yrs">yrs</option>
              </select>
            </FieldShell>
            {errors.age ? (
              <p className="mt-1 text-xs text-rose-600">{errors.age}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="amox-weight" className={labelClass}>
              Weight
            </label>
            <FieldShell error={errors.weight}>
              <input
                id="amox-weight"
                className={inputClass}
                inputMode="decimal"
                value={input.weight}
                aria-invalid={Boolean(errors.weight)}
                onChange={(e) =>
                  set({ weight: e.target.value, lastEdited: 'params' })
                }
              />
              <select
                className={selectClass}
                aria-label="Weight unit"
                value={input.weightUnit}
                onChange={(e) =>
                  set({
                    weightUnit: e.target.value as 'kg' | 'lb',
                    lastEdited: 'params',
                  })
                }
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </FieldShell>
            {errors.weight ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
            ) : null}
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Strength</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {STRENGTHS.map((s) => (
              <RadioRow
                key={s}
                name="amox-strength"
                checked={input.strength === s}
                onChange={() => set({ strength: s, lastEdited: 'params' })}
              >
                {s} mg/5 mL
              </RadioRow>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className={labelClass}>
            Indication
            <InfoTooltip
              label="Indication"
              text="General uses WHO-style mg/kg/dose ranges. Strep A uses CDC/IDSA oral amoxicillin. Endocarditis prophylaxis uses the AHA oral amoxicillin single dose (IV amoxicillin is not used—AHA lists ampicillin instead)."
            />
          </legend>
          <div className="space-y-2">
            {INDICATIONS.map((opt) => (
              <RadioRow
                key={opt.value}
                name="amox-indication"
                checked={input.indication === opt.value}
                onChange={() =>
                  set({ indication: opt.value, lastEdited: 'params' })
                }
              >
                {opt.label}
              </RadioRow>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Route</legend>
          <div className="space-y-2">
            {ROUTES.map((opt) => (
              <RadioRow
                key={opt.value}
                name="amox-route"
                checked={input.route === opt.value}
                onChange={() =>
                  set({
                    route: opt.value,
                    doseUnit: opt.value === 'iv' ? 'mg' : input.doseUnit,
                    lastEdited: 'params',
                  })
                }
              >
                {opt.label}
              </RadioRow>
            ))}
          </div>
          {errors.route ? (
            <p className="text-xs text-amber-800">{errors.route}</p>
          ) : null}
        </fieldset>
      </Panel>

      <Panel
        title="Check your dosage"
        open={checkOpen}
        onToggle={() => setCheckOpen((v) => !v)}
      >
        <div>
          <label htmlFor="amox-req" className={labelClass}>
            Dosage requirement
          </label>
          <FieldShell error={errors.requirementMgPerKg}>
            <input
              id="amox-req"
              className={inputClass}
              inputMode="decimal"
              value={requirementDisplay}
              aria-invalid={Boolean(errors.requirementMgPerKg)}
              onChange={(e) =>
                set({
                  requirementMgPerKg: e.target.value,
                  lastEdited: 'requirement',
                })
              }
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">
              mg/kg/dose
            </span>
          </FieldShell>
          {errors.requirementMgPerKg ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.requirementMgPerKg}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="amox-dose" className={labelClass}>
            Your dose
          </label>
          <FieldShell error={errors.doseValue}>
            <input
              id="amox-dose"
              className={inputClass}
              inputMode="decimal"
              value={doseDisplay}
              aria-invalid={Boolean(errors.doseValue)}
              onChange={(e) =>
                set({ doseValue: e.target.value, lastEdited: 'dose' })
              }
            />
            <select
              className={selectClass}
              aria-label="Dose unit"
              value={input.doseUnit}
              onChange={(e) =>
                set({
                  doseUnit: e.target.value as 'mg' | 'mL',
                  lastEdited: 'params',
                })
              }
            >
              <option value="mg">mg</option>
              <option value="mL" disabled={input.route === 'iv'}>
                mL
              </option>
            </select>
          </FieldShell>
          {errors.doseValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.doseValue}</p>
          ) : null}
        </div>

        {result?.regimenAvailable ? (
          <div className="space-y-1 rounded-lg border border-border bg-muted/15 px-3 py-2 text-xs text-muted-foreground">
            {result.rangeNote ? <p>{result.rangeNote}</p> : null}
            {result.frequencyNote ? <p>{result.frequencyNote}</p> : null}
            {result.formattedDoseMl && input.route === 'oral' ? (
              <p>
                Oral volume at {result.strength} mg/5 mL:{' '}
                <span className="font-semibold text-accent">
                  {result.formattedDoseMl} mL
                </span>
                {result.cappedToMax ? ' (capped at max single dose)' : ''}
              </p>
            ) : null}
            <p className="text-[11px]">{result.sourceNote}</p>
          </div>
        ) : null}

        <p className="flex gap-2 text-xs leading-relaxed text-amber-900">
          <span aria-hidden className="shrink-0 font-bold text-amber-600">
            *
          </span>
          <span>{result?.disclaimer}</span>
        </p>
      </Panel>
    </form>
  );
}
