'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatAuditCScore } from './calculation';
import type {
  AuditCBinge,
  AuditCFieldErrors,
  AuditCFrequency,
  AuditCInput,
  AuditCQuantity,
  AuditCResult,
  AuditCSex,
} from './types';
import { BINGE_OPTIONS, FREQUENCY_OPTIONS, QUANTITY_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const selectClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

function FieldShell({
  muted,
  children,
}: {
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted
          ? 'border-sky-200 bg-sky-50/60'
          : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

interface FormProps {
  input: AuditCInput;
  errors: AuditCFieldErrors;
  result: AuditCResult | null;
  onChange: (input: AuditCInput) => void;
}

export function AuditCForm({ input, errors, result, onChange }: FormProps) {
  const set = (patch: Partial<AuditCInput>) => onChange({ ...input, ...patch });
  const scoreDisplay =
    result?.score != null ? formatAuditCScore(result.score) : '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sex">
        <div>
          <span className={labelClass} id="auditc-sex-label">
            Sex
            <InfoTooltip text="Sex sets the teaching positive-screen threshold (women ≥3, men ≥4). Starts unset." />
          </span>
          <div
            role="radiogroup"
            aria-labelledby="auditc-sex-label"
            className="flex flex-wrap gap-4 pt-1"
          >
            {(
              [
                { value: 'female', label: 'Female' },
                { value: 'male', label: 'Male' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 text-sm text-accent"
              >
                <input
                  type="radio"
                  name="auditc-sex"
                  value={opt.value}
                  checked={input.sex === opt.value}
                  onChange={() => set({ sex: opt.value as AuditCSex })}
                  className="h-4 w-4 accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.sex ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sex}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-label="In the past year">
        <h3 className="text-sm font-semibold text-accent">In the past year…</h3>

        <div>
          <label className={labelClass} htmlFor="auditc-frequency">
            How often did you drink alcohol?
          </label>
          <select
            id="auditc-frequency"
            className={selectClass}
            value={input.frequency}
            onChange={(e) =>
              set({ frequency: e.target.value as AuditCFrequency })
            }
          >
            <option value="">Select</option>
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="auditc-quantity">
            How many drinks did you have on an average drinking day?
            <InfoTooltip text="A standard drink is typically about 14 g of pure alcohol (US teaching definition)." />
          </label>
          <select
            id="auditc-quantity"
            className={selectClass}
            value={input.quantity}
            onChange={(e) =>
              set({ quantity: e.target.value as AuditCQuantity })
            }
          >
            <option value="">Select</option>
            {QUANTITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="auditc-binge">
            How often did you have 6 or more drinks at once?
          </label>
          <select
            id="auditc-binge"
            className={selectClass}
            value={input.binge}
            onChange={(e) => set({ binge: e.target.value as AuditCBinge })}
          >
            <option value="">Select</option>
            {BINGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="auditc-result">
            Result
            <InfoTooltip text="AUDIT-C total 0–12. Blank until sex and all three items are selected." />
          </label>
          <FieldShell muted>
            <input
              id="auditc-result"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={scoreDisplay}
              aria-live="polite"
            />
            <span className={unitFixed}>/ 12</span>
          </FieldShell>
        </div>

        {result?.score != null && result.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-accent">
              {result.screenBand === 'positive'
                ? 'Positive screen. '
                : 'Negative screen. '}
            </span>
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}
