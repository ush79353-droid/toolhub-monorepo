'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { PitiFieldErrors, PitiInput } from './types';

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
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface PitiFormProps {
  input: PitiInput;
  errors: PitiFieldErrors;
  onChange: (input: PitiInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function PitiForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: PitiFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter mortgage principal, term, and annual interest rate, plus annual
        property tax and homeowners insurance. PITI combines monthly principal
        &amp; interest with tax÷12 and insurance÷12.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="piti-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for PITI amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate PITI
        </a>
      </p>

      <div>
        <label htmlFor="piti-principal" className={labelClass}>
          Principal
          <InfoTooltip
            label="Principal"
            text="Mortgage loan amount borrowed (not the full purchase price)."
          />
        </label>
        <FieldShell error={errors.principal}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="piti-principal"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.principal}
            onChange={(e) => onChange({ ...input, principal: e.target.value })}
            placeholder="200,000"
            aria-invalid={Boolean(errors.principal)}
          />
        </FieldShell>
        {errors.principal ? (
          <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>
          Term
          <InfoTooltip
            label="Term"
            text="Mortgage length in years plus extra months (0–11). Total months = years×12 + months."
          />
        </legend>
        <div className="mt-1.5 flex gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor="piti-years" className="sr-only">
              Term years
            </label>
            <FieldShell error={errors.termYears}>
              <input
                id="piti-years"
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={input.termYears}
                onChange={(e) =>
                  onChange({ ...input, termYears: e.target.value })
                }
                placeholder="30"
                aria-invalid={Boolean(errors.termYears)}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                years
              </span>
            </FieldShell>
          </div>
          <div className="min-w-0 flex-1">
            <label htmlFor="piti-months" className="sr-only">
              Term months
            </label>
            <FieldShell error={errors.termMonths}>
              <input
                id="piti-months"
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={input.termMonths}
                onChange={(e) =>
                  onChange({ ...input, termMonths: e.target.value })
                }
                placeholder="0"
                aria-invalid={Boolean(errors.termMonths)}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                months
              </span>
            </FieldShell>
          </div>
        </div>
        {errors.termYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
        ) : null}
        {errors.termMonths ? (
          <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
        ) : null}
      </fieldset>

      <div>
        <label htmlFor="piti-rate" className={labelClass}>
          Interest rate
          <InfoTooltip
            label="Interest rate"
            text="Annual nominal mortgage rate. Monthly rate = APR ÷ 1200."
          />
        </label>
        <FieldShell error={errors.annualInterestRate}>
          <input
            id="piti-rate"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.annualInterestRate}
            onChange={(e) =>
              onChange({ ...input, annualInterestRate: e.target.value })
            }
            placeholder="7"
            aria-invalid={Boolean(errors.annualInterestRate)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.annualInterestRate ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualInterestRate}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="piti-tax" className={labelClass}>
          Tax
          <InfoTooltip
            label="Tax"
            text="Annual property tax. Monthly tax = annual ÷ 12."
          />
        </label>
        <FieldShell error={errors.annualPropertyTax}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="piti-tax"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.annualPropertyTax}
            onChange={(e) =>
              onChange({ ...input, annualPropertyTax: e.target.value })
            }
            placeholder="0.00"
            aria-invalid={Boolean(errors.annualPropertyTax)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            / year
          </span>
        </FieldShell>
        {errors.annualPropertyTax ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualPropertyTax}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="piti-ins" className={labelClass}>
          Insurance
          <InfoTooltip
            label="Insurance"
            text="Annual homeowners insurance premium (not PMI). Monthly = annual ÷ 12."
          />
        </label>
        <FieldShell error={errors.annualInsurance}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="piti-ins"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.annualInsurance}
            onChange={(e) =>
              onChange({ ...input, annualInsurance: e.target.value })
            }
            placeholder="0.00"
            aria-invalid={Boolean(errors.annualInsurance)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            / year
          </span>
        </FieldShell>
        {errors.annualInsurance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualInsurance}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
