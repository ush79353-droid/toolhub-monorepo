'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BloodDonationDueDateFieldErrors,
  BloodDonationDueDateInput,
  BloodDonationDueDateResult,
  BloodDonationPeriodUnit,
  BloodDonationSexMode,
} from './types';
import { recommendationTextForMode, resolvePresetPeriod } from './types';

/** Days ↔ weeks exact conversion; months are not interconverted. */
function convertPeriodValue(
  value: number,
  from: BloodDonationPeriodUnit,
  to: BloodDonationPeriodUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (from === to) return value;
  if (from === 'months' || to === 'months') return null;
  const days = from === 'days' ? value : value * 7;
  if (to === 'days') return days;
  if (to === 'weeks') return days / 7;
  return null;
}

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  highlight,
  children,
}: {
  error?: string;
  highlight?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        highlight
          ? 'border-primary/70 ring-1 ring-primary/30'
          : 'border-border'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface BloodDonationDueDateFormProps {
  input: BloodDonationDueDateInput;
  errors: BloodDonationDueDateFieldErrors;
  result: BloodDonationDueDateResult | null;
  onChange: (input: BloodDonationDueDateInput) => void;
}

export function BloodDonationDueDateForm({
  input,
  errors,
  result,
  onChange,
}: BloodDonationDueDateFormProps) {
  const periodLocked = input.sexMode !== 'custom';

  const setSex = (sexMode: BloodDonationSexMode) => {
    const preset = resolvePresetPeriod(sexMode);
    if (preset) {
      onChange({
        ...input,
        sexMode,
        periodValue: String(preset.periodValue),
        periodUnit: preset.periodUnit,
      });
      return;
    }
    onChange({ ...input, sexMode });
  };

  const changeUnit = (next: BloodDonationPeriodUnit) => {
    if (periodLocked) return;
    const n = Number(input.periodValue.trim().replace(/,/g, ''));
    if (Number.isFinite(n) && n >= 0) {
      const converted = convertPeriodValue(n, input.periodUnit, next);
      if (converted != null) {
        const display =
          next === 'weeks' || next === 'days'
            ? String(converted)
            : String(converted);
        onChange({ ...input, periodUnit: next, periodValue: display });
        return;
      }
    }
    onChange({ ...input, periodUnit: next });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational whole-blood wait estimator using NHS Blood and Transplant /
        WHO-style minimums (12 weeks male, 16 weeks female). Not a medical
        clearance — confirm with your blood service for donation type and local
        rules.
      </p>

      <div>
        <div className={labelClass}>
          Sex
          <InfoTooltip
            label="Sex"
            text="Preset intervals follow sex-assigned-at-birth whole-blood waiting times used by NHS Blood and Transplant (12 weeks male, 16 weeks female). Choose Custom period to enter any wait your service allows."
          />
        </div>
        <div
          className="flex flex-wrap gap-3"
          role="radiogroup"
          aria-label="Sex"
        >
          {(
            [
              ['male', 'Male'],
              ['female', 'Female'],
              ['custom', 'Custom period'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="bdd-sex"
                value={value}
                checked={input.sexMode === value}
                onChange={() => setSex(value)}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="bdd-period" className={labelClass}>
          Period between donations
          <InfoTooltip
            label="Period between donations"
            text="Minimum wait after the last whole-blood donation before the earliest next donation date. Male and Female presets are locked; Custom period lets you edit the value and unit."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.periodValue}>
            <input
              id="bdd-period"
              type="text"
              inputMode="decimal"
              className={`${inputClass} ${periodLocked ? 'text-muted-foreground' : ''}`}
              value={input.periodValue}
              readOnly={periodLocked}
              aria-readonly={periodLocked}
              onChange={(e) =>
                onChange({ ...input, periodValue: e.target.value })
              }
              aria-invalid={Boolean(errors.periodValue)}
            />
          </FieldShell>
          <select
            className={`${selectClass} w-[6.5rem]`}
            value={input.periodUnit}
            disabled={periodLocked}
            onChange={(e) =>
              changeUnit(e.target.value as BloodDonationPeriodUnit)
            }
            aria-label="Period unit"
          >
            <option value="weeks">wks</option>
            <option value="days">days</option>
            <option value="months">mos</option>
          </select>
        </div>
        {errors.periodValue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodValue}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {recommendationTextForMode(input.sexMode)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bdd-last" className={labelClass}>
          Last donation date
          <InfoTooltip
            label="Last donation date"
            text="Calendar date of your most recent whole-blood donation. Calculation uses date-only math (no time zones)."
          />
        </label>
        <FieldShell error={errors.lastDonationDate}>
          <input
            id="bdd-last"
            type="date"
            className={inputClass}
            value={input.lastDonationDate}
            onChange={(e) =>
              onChange({ ...input, lastDonationDate: e.target.value })
            }
            aria-invalid={Boolean(errors.lastDonationDate)}
          />
        </FieldShell>
        {errors.lastDonationDate ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.lastDonationDate}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="bdd-next" className={labelClass}>
          Next donation date
          <InfoTooltip
            label="Next donation date"
            text="Earliest calendar date after adding the wait interval to the last donation date. Confirm eligibility with your blood service before booking."
          />
        </label>
        <FieldShell highlight={Boolean(result)}>
          <input
            id="bdd-next"
            type="text"
            readOnly
            className={`${inputClass} ${result ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
            value={result?.formattedNextDonation ?? ''}
            placeholder="—"
            aria-live="polite"
          />
        </FieldShell>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {result.explanation}
          </p>
        ) : null}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </form>
  );
}
