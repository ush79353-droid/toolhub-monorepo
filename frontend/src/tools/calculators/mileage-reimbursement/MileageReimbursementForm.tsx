'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertDistanceAmount } from './calculation';
import { OFFICIAL_MILEAGE_RATES } from './rates';
import type {
  DistanceUnit,
  MileageReimbursementFieldErrors,
  MileageReimbursementInput,
  MileageReimbursementResult,
  MileageRatePeriodId,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface MileageReimbursementFormProps {
  input: MileageReimbursementInput;
  errors: MileageReimbursementFieldErrors;
  result: MileageReimbursementResult | null;
  onChange: (input: MileageReimbursementInput) => void;
}

export function MileageReimbursementForm({
  input,
  errors,
  result,
  onChange,
}: MileageReimbursementFormProps) {
  const set = (patch: Partial<MileageReimbursementInput>) => {
    onChange({ ...input, ...patch });
  };

  const changeUnit = (
    key: 'business' | 'medical' | 'charity',
    next: DistanceUnit
  ) => {
    const distKey =
      key === 'business'
        ? 'businessDistance'
        : key === 'medical'
          ? 'medicalDistance'
          : 'charityDistance';
    const unitKey =
      key === 'business'
        ? 'businessUnit'
        : key === 'medical'
          ? 'medicalUnit'
          : 'charityUnit';
    const from = input[unitKey];
    if (from === next) return;
    const raw = input[distKey].trim().replace(/,/g, '');
    const amount = Number(raw);
    if (raw !== '' && Number.isFinite(amount) && amount >= 0) {
      const converted = convertDistanceAmount(amount, from, next);
      if (Number.isFinite(converted)) {
        set({
          [unitKey]: next,
          [distKey]: String(converted),
        } as Partial<MileageReimbursementInput>);
        return;
      }
    }
    set({ [unitKey]: next } as Partial<MileageReimbursementInput>);
  };

  const distanceRow = (
    id: string,
    label: string,
    tip: string,
    valueKey: 'businessDistance' | 'medicalDistance' | 'charityDistance',
    unitKey: 'businessUnit' | 'medicalUnit' | 'charityUnit',
    unitKind: 'business' | 'medical' | 'charity',
    error?: string
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={input[valueKey]}
            aria-invalid={Boolean(error)}
            onChange={(e) => set({ [valueKey]: e.target.value })}
          />
        </FieldShell>
        <div className="w-[88px] shrink-0 sm:w-[100px]">
          <select
            className={selectClass}
            value={input[unitKey]}
            aria-label={`${label} unit`}
            onChange={(e) =>
              changeUnit(unitKind, e.target.value as DistanceUnit)
            }
          >
            <option value="mi">mi</option>
            <option value="km">km</option>
          </select>
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="mileage-tax-year">
          <span>Tax year</span>
          <InfoTooltip
            label="Tax year"
            text="IRS standard mileage rate period. 2026 is split Jan–Jun / Jul–Dec because official rates change mid-year and this tool has no travel-date field."
          />
        </label>
        <select
          id="mileage-tax-year"
          className={selectClass}
          value={input.periodId}
          aria-invalid={Boolean(errors.periodId)}
          onChange={(e) =>
            set({ periodId: e.target.value as MileageRatePeriodId })
          }
        >
          {OFFICIAL_MILEAGE_RATES.map((row) => (
            <option key={row.id} value={row.id}>
              {row.label}
            </option>
          ))}
        </select>
        {errors.periodId ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodId}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="mileage-business-rate">
          <span>Business</span>
          <InfoTooltip
            label="Business"
            text="Verified IRS business standard mileage rate (USD per mile) for the selected period. Read-only."
          />
        </label>
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="mileage-business-rate"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedBusinessRate ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            per mile
          </span>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="mileage-medical-rate">
          <span>Medical</span>
          <InfoTooltip
            label="Medical"
            text="Verified IRS medical standard mileage rate (USD per mile) for the selected period. Read-only."
          />
        </label>
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="mileage-medical-rate"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedMedicalRate ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            per mile
          </span>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="mileage-charity-rate">
          <span>Charity</span>
          <InfoTooltip
            label="Charity"
            text="Verified IRS charitable mileage rate (USD per mile; I.R.C. §170(i) 14¢). Read-only."
          />
        </label>
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="mileage-charity-rate"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedCharityRate ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            per mile
          </span>
        </FieldShell>
      </div>

      {distanceRow(
        'mileage-business-dist',
        'Miles driven for business purpose',
        'Business driving distance. Use mi or km; unit changes preserve physical distance (1 mi = 1.609344 km).',
        'businessDistance',
        'businessUnit',
        'business',
        errors.businessDistance
      )}
      {distanceRow(
        'mileage-medical-dist',
        'Miles driven for medical purpose',
        'Medical driving distance with independent mi/km selector.',
        'medicalDistance',
        'medicalUnit',
        'medical',
        errors.medicalDistance
      )}
      {distanceRow(
        'mileage-charity-dist',
        'Miles driven for charity purpose',
        'Charitable driving distance with independent mi/km selector.',
        'charityDistance',
        'charityUnit',
        'charity',
        errors.charityDistance
      )}

      <div>
        <label className={labelClass} htmlFor="mileage-deduction">
          <span>Mileage deduction</span>
          <InfoTooltip
            label="Mileage deduction"
            text="Nominal combined amount: business + medical + charity using IRS standard rates. Not an automatic tax-return deduction or employer reimbursement."
          />
        </label>
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="mileage-deduction"
            className={`${inputClass} font-semibold text-primary`}
            readOnly
            tabIndex={-1}
            value={result?.formattedTotal ?? ''}
            aria-live="polite"
          />
        </FieldShell>
      </div>

      {result ? (
        <p className="text-xs text-muted-foreground">
          Rates: {result.sourceNote}. Fixed USD. Educational estimate only —
          eligibility and itemized-deduction limits still apply.
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
