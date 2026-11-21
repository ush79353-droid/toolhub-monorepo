'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AdvancedSolveTarget,
  LgdFieldErrors,
  LgdInput,
  LgdMode,
  LgdResult,
  RateSource,
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
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        {title}
        <span className="font-normal text-muted-foreground">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

const PD_HORIZONS = [
  'One year',
  'Three years',
  'Five years',
  'Other specified horizon',
] as const;

interface LgdFormProps {
  input: LgdInput;
  errors: LgdFieldErrors;
  result: LgdResult | null;
  onChange: (input: LgdInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function LgdForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: LgdFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<LgdInput>) => onChange({ ...input, ...patch });
  const [openRates, setOpenRates] = useState(true);
  const [openLgd, setOpenLgd] = useState(true);

  const setRecovery = (value: string) => {
    const cleaned = value.trim().replace(/,/g, '');
    const n = Number(cleaned);
    let lossSeverityPercent = input.lossSeverityPercent;
    if (cleaned !== '' && Number.isFinite(n) && n >= 0 && n <= 100) {
      lossSeverityPercent = String(100 - n);
    }
    set({
      rateSource: 'recoveryRate' as RateSource,
      recoveryRatePercent: value,
      lossSeverityPercent,
    });
  };

  const setSeverity = (value: string) => {
    const cleaned = value.trim().replace(/,/g, '');
    const n = Number(cleaned);
    let recoveryRatePercent = input.recoveryRatePercent;
    if (cleaned !== '' && Number.isFinite(n) && n >= 0 && n <= 100) {
      recoveryRatePercent = String(100 - n);
    }
    set({
      rateSource: 'lossSeverity' as RateSource,
      lossSeverityPercent: value,
      recoveryRatePercent,
    });
  };

  const displayRr =
    input.rateSource === 'recoveryRate'
      ? input.recoveryRatePercent
      : result
        ? String(result.recoveryRate * 100)
        : input.recoveryRatePercent;
  const displayLs =
    input.rateSource === 'lossSeverity'
      ? input.lossSeverityPercent
      : result
        ? String(result.lossSeverity * 100)
        : input.lossSeverityPercent;

  const showEadInput =
    input.mode === 'basic' ||
    input.advancedSolve === 'lgdAmount' ||
    input.advancedSolve === 'ratesFromAmounts';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        LGD amount = EAD × (1 − recovery rate). Recovery rate and loss severity
        always sum to 100% in this basic model. LGD amount is loss if default
        occurs; Expected Loss (advanced) is PD × LGD × EAD. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="lgd-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div
        role="tablist"
        aria-label="Calculator mode"
        className="grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/30 p-1"
      >
        {(
          [
            ['basic', 'Basic LGD'],
            ['advanced', 'Advanced'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={input.mode === id}
            className={`h-10 rounded-md text-xs font-semibold transition-colors ${
              input.mode === id
                ? 'bg-white text-accent shadow-sm'
                : 'text-muted-foreground hover:text-accent'
            }`}
            onClick={() => set({ mode: id as LgdMode })}
          >
            {label}
          </button>
        ))}
      </div>

      {input.mode === 'advanced' ? (
        <div>
          <label htmlFor="lgd-adv-solve" className={labelClass}>
            Advanced solve
          </label>
          <select
            id="lgd-adv-solve"
            className={selectClass}
            value={input.advancedSolve}
            onChange={(e) =>
              set({
                advancedSolve: e.target.value as AdvancedSolveTarget,
              })
            }
          >
            <option value="lgdAmount">LGD amount from EAD &amp; rates</option>
            <option value="eadFromLgd">EAD from LGD amount &amp; severity</option>
            <option value="ratesFromAmounts">
              Rates from EAD &amp; recovery amount
            </option>
          </select>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (PKR 100,000 · 80% RR → LGD 20,000)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <Section
        title="Recovery Rate / Loss Severity"
        open={openRates}
        onToggle={() => setOpenRates((v) => !v)}
      >
        <div>
          <label htmlFor="lgd-rr" className={labelClass}>
            Recovery Rate
            <InfoTooltip
              label="Recovery Rate"
              text="The percentage of exposure recovered after a borrower defaults. It may reflect collateral proceeds, repayments, guarantees, or other recoveries under the assumptions used."
            />
          </label>
          <FieldShell
            error={errors.recoveryRatePercent}
            muted={
              input.mode === 'advanced' &&
              input.advancedSolve === 'ratesFromAmounts'
            }
          >
            <input
              id="lgd-rr"
              className={inputClass}
              inputMode="decimal"
              readOnly={
                input.mode === 'advanced' &&
                input.advancedSolve === 'ratesFromAmounts'
              }
              value={
                input.mode === 'advanced' &&
                input.advancedSolve === 'ratesFromAmounts' &&
                result
                  ? String(result.recoveryRate * 100)
                  : displayRr
              }
              onChange={(e) => setRecovery(e.target.value)}
              placeholder="80"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.recoveryRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.recoveryRatePercent}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lgd-ls" className={labelClass}>
            Loss Severity
            <InfoTooltip
              label="Loss Severity"
              text="The percentage of exposure that is not recovered following default. Under a simple recovery-based model, loss severity equals one minus the recovery rate."
            />
          </label>
          <FieldShell
            error={errors.lossSeverityPercent}
            muted={
              input.mode === 'advanced' &&
              input.advancedSolve === 'ratesFromAmounts'
            }
          >
            <input
              id="lgd-ls"
              className={inputClass}
              inputMode="decimal"
              readOnly={
                input.mode === 'advanced' &&
                input.advancedSolve === 'ratesFromAmounts'
              }
              value={
                input.mode === 'advanced' &&
                input.advancedSolve === 'ratesFromAmounts' &&
                result
                  ? String(result.lossSeverity * 100)
                  : displayLs
              }
              onChange={(e) => setSeverity(e.target.value)}
              placeholder="20"
            />
            <span className="pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
          {errors.lossSeverityPercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lossSeverityPercent}
            </p>
          ) : null}
        </div>
      </Section>

      <Section
        title="LGD (Loss Given Default)"
        open={openLgd}
        onToggle={() => setOpenLgd((v) => !v)}
      >
        {showEadInput ? (
          <div>
            <label htmlFor="lgd-ead" className={labelClass}>
              Expected Exposure
              <InfoTooltip
                label="Expected Exposure"
                text="The estimated amount outstanding or economically exposed at the time of borrower default. In credit risk modeling, this is generally referred to as Exposure at Default (EAD)."
              />
            </label>
            <FieldShell
              error={errors.expectedExposure}
              muted={
                input.mode === 'advanced' &&
                input.advancedSolve === 'eadFromLgd'
              }
            >
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="lgd-ead"
                className={inputClass}
                inputMode="decimal"
                readOnly={
                  input.mode === 'advanced' &&
                  input.advancedSolve === 'eadFromLgd'
                }
                value={
                  input.mode === 'advanced' &&
                  input.advancedSolve === 'eadFromLgd' &&
                  result
                    ? String(result.exposureAtDefault)
                    : input.expectedExposure
                }
                onChange={(e) => set({ expectedExposure: e.target.value })}
                placeholder="100000"
              />
            </FieldShell>
            {errors.expectedExposure ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.expectedExposure}
              </p>
            ) : null}
          </div>
        ) : null}

        {input.mode === 'advanced' &&
        input.advancedSolve === 'ratesFromAmounts' ? (
          <div>
            <label htmlFor="lgd-rec-amt" className={labelClass}>
              Recovery amount
            </label>
            <FieldShell error={errors.recoveryAmount}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="lgd-rec-amt"
                className={inputClass}
                inputMode="decimal"
                value={input.recoveryAmount}
                onChange={(e) => set({ recoveryAmount: e.target.value })}
                placeholder="80000"
              />
            </FieldShell>
            {errors.recoveryAmount ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.recoveryAmount}
              </p>
            ) : null}
          </div>
        ) : null}

        {input.mode === 'advanced' &&
        input.advancedSolve === 'eadFromLgd' ? (
          <div>
            <label htmlFor="lgd-amt-in" className={labelClass}>
              Loss Given Default (amount)
            </label>
            <FieldShell error={errors.lossGivenDefaultAmount}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="lgd-amt-in"
                className={inputClass}
                inputMode="decimal"
                value={input.lossGivenDefaultAmount}
                onChange={(e) =>
                  set({ lossGivenDefaultAmount: e.target.value })
                }
                placeholder="25000"
              />
            </FieldShell>
            {errors.lossGivenDefaultAmount ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.lossGivenDefaultAmount}
              </p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label htmlFor="lgd-out" className={labelClass}>
            Loss Given Default
            <InfoTooltip
              label="Loss Given Default"
              text="The monetary amount expected to be lost if a borrower defaults, calculated by multiplying exposure at default by the loss severity rate."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="lgd-out"
              className={inputClass}
              readOnly
              aria-readonly
              value={result ? String(result.lossGivenDefault) : ''}
              placeholder="—"
            />
          </FieldShell>
        </div>

        {input.mode === 'advanced' ? (
          <>
            <div>
              <label htmlFor="lgd-pd" className={labelClass}>
                Probability of Default (PD)
                <InfoTooltip
                  label="Probability of Default (PD)"
                  text="The estimated probability that a borrower will default over a specified period. EL = PD × LGD rate × EAD is not the same as LGD amount."
                />
              </label>
              <FieldShell error={errors.probabilityOfDefaultPercent}>
                <input
                  id="lgd-pd"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.probabilityOfDefaultPercent}
                  onChange={(e) =>
                    set({ probabilityOfDefaultPercent: e.target.value })
                  }
                  placeholder="5"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.probabilityOfDefaultPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.probabilityOfDefaultPercent}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="lgd-pd-h" className={labelClass}>
                PD horizon assumption
              </label>
              <select
                id="lgd-pd-h"
                className={selectClass}
                value={input.pdHorizonLabel}
                onChange={(e) => set({ pdHorizonLabel: e.target.value })}
              >
                {PD_HORIZONS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : null}
      </Section>
    </form>
  );
}
