'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  SOLVE_FOR_OPTIONS,
  TIMING_OPTIONS,
  type SipLumpsumFieldErrors,
  type SipLumpsumInput,
  type SipLumpsumResult,
  type TermUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function Section({
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
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left sm:px-4"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold text-accent">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}

interface SipLumpsumFormProps {
  input: SipLumpsumInput;
  errors: SipLumpsumFieldErrors;
  result: SipLumpsumResult | null;
  mainOpen: boolean;
  sipOpen: boolean;
  onMainOpenChange: (open: boolean) => void;
  onSipOpenChange: (open: boolean) => void;
  onChange: (input: SipLumpsumInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function SipLumpsumForm({
  input,
  errors,
  result,
  mainOpen,
  sipOpen,
  onMainOpenChange,
  onSipOpenChange,
  onChange,
  onCurrencyChange,
}: SipLumpsumFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const solvingDeposit = input.solveFor === 'deposit';
  const solvingLumpsum = input.solveFor === 'lumpsum';
  const solvingReturn = input.solveFor === 'return';
  const solvingTerm = input.solveFor === 'term';
  const needsTarget = input.solveFor !== 'finalBalance';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Combines compound growth on the initial lumpsum with the future value of
        SIP deposits. Currency selectors change symbols and grouping only (no
        FX conversion).
      </p>

      <Section
        title="Main specifications"
        open={mainOpen}
        onToggle={() => onMainOpenChange(!mainOpen)}
      >
        <div>
          <label htmlFor="sip-ls-solve" className={labelClass}>
            I&apos;d like to know the…
          </label>
          <select
            id="sip-ls-solve"
            className={selectClass}
            value={input.solveFor}
            onChange={(e) =>
              onChange({
                ...input,
                solveFor: e.target.value as SipLumpsumInput['solveFor'],
              })
            }
          >
            {SOLVE_FOR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {needsTarget ? (
          <div>
            <label htmlFor="sip-ls-target" className={labelClass}>
              Target final balance
              <InfoTooltip
                label="Target final balance"
                text="Desired ending balance when solving for deposit, lumpsum, return, or term."
              />
            </label>
            <FieldShell error={errors.targetFinalBalance}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="sip-ls-target"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.targetFinalBalance}
                onChange={(e) =>
                  onChange({ ...input, targetFinalBalance: e.target.value })
                }
                placeholder="2,707.04"
                aria-invalid={Boolean(errors.targetFinalBalance)}
              />
              <div className="shrink-0 pr-1">
                <CurrencySelect
                  id="sip-ls-target-ccy"
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label="Currency for target final balance"
                  showDenominationNote={false}
                />
              </div>
            </FieldShell>
            {errors.targetFinalBalance ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.targetFinalBalance}
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="sip-ls-pv" className={labelClass}>
            Initial lumpsum
            <InfoTooltip
              label="Initial lumpsum"
              text="Opening one-time investment that compounds for the full term."
            />
          </label>
          <FieldShell error={errors.initialLumpsum} muted={solvingLumpsum}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="sip-ls-pv"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                solvingLumpsum && result
                  ? formatDisplay(result.openingBalance)
                  : input.initialLumpsum
              }
              onChange={(e) =>
                onChange({ ...input, initialLumpsum: e.target.value })
              }
              readOnly={solvingLumpsum}
              placeholder="1,000.00"
              aria-invalid={Boolean(errors.initialLumpsum)}
            />
            <div className="shrink-0 pr-1">
              <CurrencySelect
                id="sip-ls-pv-ccy"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Currency for initial lumpsum"
                showDenominationNote={false}
              />
            </div>
          </FieldShell>
          {errors.initialLumpsum ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialLumpsum}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-rate" className={labelClass}>
            Expected rate of return
            <InfoTooltip
              label="Expected rate of return"
              text="Nominal annual return before converting to the deposit-period rate using the compounding frequency."
            />
          </label>
          <FieldShell error={errors.annualReturnPercent} muted={solvingReturn}>
            <input
              id="sip-ls-rate"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                solvingReturn && result
                  ? result.annualReturnPercent.toFixed(4)
                  : input.annualReturnPercent
              }
              onChange={(e) =>
                onChange({ ...input, annualReturnPercent: e.target.value })
              }
              readOnly={solvingReturn}
              placeholder="10"
              aria-invalid={Boolean(errors.annualReturnPercent)}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.annualReturnPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualReturnPercent}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-term" className={labelClass}>
            Term
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.termValue} muted={solvingTerm}>
              <input
                id="sip-ls-term"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={
                  solvingTerm && result
                    ? result.termYears.toFixed(4)
                    : input.termValue
                }
                onChange={(e) =>
                  onChange({ ...input, termValue: e.target.value })
                }
                readOnly={solvingTerm}
                placeholder="10"
                aria-invalid={Boolean(errors.termValue)}
              />
            </FieldShell>
            <select
              className={`${selectClass} w-24 shrink-0`}
              value={solvingTerm ? 'yrs' : input.termUnit}
              disabled={solvingTerm}
              onChange={(e) =>
                onChange({
                  ...input,
                  termUnit: e.target.value as TermUnit,
                })
              }
              aria-label="Term unit"
            >
              <option value="yrs">yrs</option>
              <option value="mos">mos</option>
            </select>
          </div>
          {errors.termValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-start" className={labelClass}>
            Start date
          </label>
          <FieldShell error={errors.startDate}>
            <input
              id="sip-ls-start"
              type="date"
              className={inputClass}
              value={input.startDate}
              onChange={(e) =>
                onChange({ ...input, startDate: e.target.value })
              }
              aria-invalid={Boolean(errors.startDate)}
            />
          </FieldShell>
          {errors.startDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-inflation" className={labelClass}>
            Inflation rate
            <InfoTooltip
              label="Inflation rate"
              text="Optional. When greater than zero, results also show purchasing-power of the final balance: FV / (1+f)^t."
            />
          </label>
          <FieldShell error={errors.inflationPercent}>
            <input
              id="sip-ls-inflation"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.inflationPercent}
              onChange={(e) =>
                onChange({ ...input, inflationPercent: e.target.value })
              }
              placeholder="0"
              aria-invalid={Boolean(errors.inflationPercent)}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.inflationPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationPercent}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-compound" className={labelClass}>
            Compounding frequency
            <InfoTooltip
              label="Compounding frequency"
              text="How often the nominal annual return compounds when converting to the deposit-period rate."
            />
          </label>
          <select
            id="sip-ls-compound"
            className={selectClass}
            value={input.compounding}
            onChange={(e) =>
              onChange({
                ...input,
                compounding: e.target
                  .value as SipLumpsumInput['compounding'],
              })
            }
          >
            {COMPOUNDING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section
        title="SIP Inputs"
        open={sipOpen}
        onToggle={() => onSipOpenChange(!sipOpen)}
      >
        <div>
          <label htmlFor="sip-ls-pmt" className={labelClass}>
            How much do you deposit?
          </label>
          <FieldShell error={errors.depositAmount} muted={solvingDeposit}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="sip-ls-pmt"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={
                solvingDeposit && result
                  ? formatDisplay(result.periodicDeposit)
                  : input.depositAmount
              }
              onChange={(e) =>
                onChange({ ...input, depositAmount: e.target.value })
              }
              readOnly={solvingDeposit}
              placeholder="0.00"
              aria-invalid={Boolean(errors.depositAmount)}
            />
            <div className="shrink-0 pr-1">
              <CurrencySelect
                id="sip-ls-pmt-ccy"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Currency for deposit amount"
                showDenominationNote={false}
              />
            </div>
          </FieldShell>
          {errors.depositAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depositAmount}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="sip-ls-freq" className={labelClass}>
            How often?
            <InfoTooltip
              label="Deposit frequency"
              text="How often SIP deposits are made. The period rate is matched to this frequency."
            />
          </label>
          <select
            id="sip-ls-freq"
            className={selectClass}
            value={input.depositFrequency}
            onChange={(e) =>
              onChange({
                ...input,
                depositFrequency: e.target
                  .value as SipLumpsumInput['depositFrequency'],
              })
            }
          >
            {DEPOSIT_FREQUENCY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sip-ls-when" className={labelClass}>
            When?
          </label>
          <select
            id="sip-ls-when"
            className={selectClass}
            value={input.depositTiming}
            onChange={(e) =>
              onChange({
                ...input,
                depositTiming: e.target
                  .value as SipLumpsumInput['depositTiming'],
              })
            }
          >
            {TIMING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </Section>

      {errors.form ? (
        <p className="text-sm text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}

function formatDisplay(n: number): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
