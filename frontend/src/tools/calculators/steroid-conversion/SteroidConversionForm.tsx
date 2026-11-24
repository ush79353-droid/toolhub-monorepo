'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DURATION_GROUP_LABEL,
  DURATION_GROUP_ORDER,
  STEROID_DRUGS,
  type DurationGroup,
  type SteroidDrugId,
} from './drug-data';
import { formatDoseMg } from './calculation';
import type {
  SteroidConversionInput,
  SteroidConversionResult,
  SteroidFieldErrors,
} from './types';
import { createEmptyDoses } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function AccordionSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
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
        <div className="space-y-3.5 border-t border-border px-4 py-3">{children}</div>
      ) : null}
    </div>
  );
}

interface FormProps {
  input: SteroidConversionInput;
  errors: SteroidFieldErrors;
  result: SteroidConversionResult | null;
  onChange: (input: SteroidConversionInput) => void;
}

export function SteroidConversionForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const setDose = (id: SteroidDrugId, value: string) => {
    const doses = createEmptyDoses();
    doses[id] = value;
    onChange({ doses });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs text-muted-foreground">
        Enter one systemic corticosteroid dose (mg) to see approximate
        anti-inflammatory equivalents. Educational comparison only—not for
        tapering, switching, or prescribing. Mineralocorticoid activity is not
        comparable across agents. Systemic table only (not topical / inhaled /
        intra-articular).
      </p>

      {DURATION_GROUP_ORDER.map((group: DurationGroup) => (
        <AccordionSection
          key={group}
          title={DURATION_GROUP_LABEL[group]}
          defaultOpen
        >
          {STEROID_DRUGS.filter((d) => d.durationGroup === group).map((drug) => {
            const isSource = result?.activeSourceId === drug.id;
            const showConverted =
              !isSource &&
              result?.convertedDoses[drug.id] != null &&
              input.doses[drug.id].trim() === '';
            const fieldValue = showConverted
              ? formatDoseMg(result!.convertedDoses[drug.id])
              : input.doses[drug.id];
            return (
              <div key={drug.id}>
                <label className={labelClass} htmlFor={`steroid-${drug.id}`}>
                  {drug.label}
                  <InfoTooltip
                    label={`${drug.label} info`}
                    text={drug.tooltip}
                  />
                </label>
                <FieldShell error={errors[drug.id]} muted={showConverted}>
                  <input
                    id={`steroid-${drug.id}`}
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={fieldValue}
                    readOnly={showConverted}
                    onChange={(e) => setDose(drug.id, e.target.value)}
                    aria-invalid={Boolean(errors[drug.id])}
                  />
                  <span className="shrink-0 pr-3 font-mono text-xs text-primary">
                    mg
                  </span>
                </FieldShell>
                {errors[drug.id] ? (
                  <p className="mt-1 text-xs text-rose-600">{errors[drug.id]}</p>
                ) : null}
              </div>
            );
          })}
        </AccordionSection>
      ))}

      {result?.statusDetail ? (
        <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
      ) : null}
    </form>
  );
}
