'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEFAULT_PPF_SCHEME,
  newDepositId,
  type PpfDepositFrequency,
  type PpfExtensionMode,
  type PpfFieldErrors,
  type PpfInput,
  type PpfInvestmentMode,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface PpfFormProps {
  input: PpfInput;
  errors: PpfFieldErrors;
  onChange: (next: PpfInput) => void;
  onLoadExample: () => void;
}

export function PpfForm({
  input,
  errors,
  onChange,
  onLoadExample,
}: PpfFormProps) {
  const set = (patch: Partial<PpfInput>) => onChange({ ...input, ...patch });
  const scheme = DEFAULT_PPF_SCHEME;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational PPF projection in <strong className="text-accent">INR</strong>.
        Uses FY Apr–Mar, 5th-day eligible balance, and FY-end interest credit.
        Default rate {scheme.defaultAnnualInterestRate}% is an editable
 illustrative constant; not a guaranteed official rate.
      </p>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (₹50,000 annually · {scheme.defaultAnnualInterestRate}% · Apr
        2026)
      </button>

      <fieldset>
        <legend className={`${labelClass} mb-2`}>
          I&apos;d like to know…
          <InfoTooltip
            label="Investment mode"
            text="Fixed Investment builds a recurring schedule. Custom Investment lets you enter each deposit date and amount."
          />
        </legend>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['fixed', 'Fixed Investment'],
              ['custom', 'Custom Investment'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3.5 text-sm ${
                input.investmentMode === value
                  ? 'border-primary bg-primary/5 font-medium text-accent'
                  : 'border-border bg-white text-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="ppf-mode"
                className="accent-primary"
                checked={input.investmentMode === value}
                onChange={() =>
                  set({ investmentMode: value as PpfInvestmentMode })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {input.investmentMode === 'fixed' ? (
        <>
          <div>
            <label htmlFor="ppf-amount" className={labelClass}>
              Deposit Amount
              <InfoTooltip
                label="Deposit Amount"
                text={`Recurring contribution in INR. Annual totals must stay within ₹${scheme.minimumAnnualDeposit.toLocaleString('en-IN')}–₹${scheme.maximumAnnualDeposit.toLocaleString('en-IN')} per financial year (multiples of ₹${scheme.depositIncrement}).`}
              />
            </label>
            <FieldShell error={errors.depositAmount}>
              <span className="pointer-events-none pl-3 text-sm font-medium text-muted-foreground">
                ₹
              </span>
              <input
                id="ppf-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.depositAmount}
                aria-invalid={Boolean(errors.depositAmount)}
                onChange={(e) => set({ depositAmount: e.target.value })}
              />
            </FieldShell>
            {errors.depositAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.depositAmount}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="ppf-freq" className={labelClass}>
              Deposit Frequency
            </label>
            <FieldShell>
              <select
                id="ppf-freq"
                className={`${inputClass} appearance-none`}
                value={input.depositFrequency}
                onChange={(e) =>
                  set({
                    depositFrequency: e.target.value as PpfDepositFrequency,
                  })
                }
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-yearly</option>
                <option value="annually">Annually</option>
              </select>
            </FieldShell>
          </div>
        </>
      ) : (
        <div className="space-y-2 rounded-xl border border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] font-semibold text-accent">
              Custom deposits
            </span>
            <button
              type="button"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
              onClick={() =>
                set({
                  customDeposits: [
                    ...input.customDeposits,
                    {
                      id: newDepositId(),
                      date: input.startDate || '',
                      amount: '',
                    },
                  ],
                })
              }
            >
              Add deposit
            </button>
          </div>
          {input.customDeposits.map((row, idx) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="date"
                className="h-11 rounded-lg border border-border px-3 text-sm"
                value={row.date}
                aria-label={`Deposit ${idx + 1} date`}
                onChange={(e) => {
                  const next = [...input.customDeposits];
                  next[idx] = { ...row, date: e.target.value };
                  set({ customDeposits: next });
                }}
              />
              <div className="relative flex h-11 items-center rounded-lg border border-border">
                <span className="pl-3 text-sm text-muted-foreground">₹</span>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={row.amount}
                  aria-label={`Deposit ${idx + 1} amount`}
                  onChange={(e) => {
                    const next = [...input.customDeposits];
                    next[idx] = { ...row, amount: e.target.value };
                    set({ customDeposits: next });
                  }}
                />
              </div>
              <button
                type="button"
                className="h-11 rounded-lg border border-border px-3 text-xs text-rose-600"
                onClick={() =>
                  set({
                    customDeposits: input.customDeposits.filter(
                      (d) => d.id !== row.id,
                    ),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          {errors.customDeposits ? (
            <p className="text-xs text-rose-600">{errors.customDeposits}</p>
          ) : null}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ppf-rate" className={labelClass}>
            Interest Rate
            <InfoTooltip
              label="Interest Rate"
              text={scheme.interestRateSource}
            />
          </label>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="ppf-rate"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(e) => set({ annualInterestRate: e.target.value })}
            />
            <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
              %/yr
            </span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualInterestRate}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ppf-inflation" className={labelClass}>
            Inflation Rate
            <InfoTooltip
              label="Inflation Rate"
              text="Used only to estimate purchasing power: Real = FV / (1+i)^t. Default 0%."
            />
          </label>
          <FieldShell error={errors.inflationRate}>
            <input
              id="ppf-inflation"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={input.inflationRate}
              aria-invalid={Boolean(errors.inflationRate)}
              onChange={(e) => set({ inflationRate: e.target.value })}
            />
            <span className="pointer-events-none absolute right-3 text-sm text-muted-foreground">
              %/yr
            </span>
          </FieldShell>
          {errors.inflationRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationRate}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="ppf-start" className={labelClass}>
          Start Date
          <InfoTooltip
            label="Start Date"
            text="Account opening date. Standard maturity is 15 years from the end of the opening financial year (31 March), not a simple +15 calendar years."
          />
        </label>
        <FieldShell error={errors.startDate}>
          <input
            id="ppf-start"
            type="date"
            className={inputClass}
            value={input.startDate}
            aria-invalid={Boolean(errors.startDate)}
            onChange={(e) => set({ startDate: e.target.value })}
          />
        </FieldShell>
        {errors.startDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
        ) : null}
        <p className="mt-1.5 text-xs text-muted-foreground">
          Tenure: {scheme.standardTenureYears} years (FY-end maturity rule)
        </p>
      </div>

      <div>
        <label htmlFor="ppf-ext" className={labelClass}>
          Extension
          <InfoTooltip
            label="Extension"
            text="Optional one 5-year block after standard maturity. Extension with contributions requires eligible declaration under scheme rules."
          />
        </label>
        <FieldShell>
          <select
            id="ppf-ext"
            className={`${inputClass} appearance-none`}
            value={input.extensionMode}
            onChange={(e) =>
              set({ extensionMode: e.target.value as PpfExtensionMode })
            }
          >
            <option value="standard">Standard maturity (15 years)</option>
            <option value="extension-with-contributions">
              +5 years with contributions
            </option>
            <option value="extension-without-contributions">
              +5 years without contributions
            </option>
          </select>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
