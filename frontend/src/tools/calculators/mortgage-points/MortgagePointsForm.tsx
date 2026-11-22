'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  discountedRatePercent,
  pointsCostFromPercent,
  pointsFromCost,
} from './calculation';
import { MortgagePointsChart } from './MortgagePointsChart';
import {
  COMPOUNDING_FREQUENCY_OPTIONS,
  POINTS_PAYMENT_TYPE_OPTIONS,
  type CompoundingFrequency,
  type MortgagePointsFieldErrors,
  type MortgagePointsInput,
  type MortgagePointsResult,
  type PointsPaymentType,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface MortgagePointsFormProps {
  input: MortgagePointsInput;
  errors: MortgagePointsFieldErrors;
  result: MortgagePointsResult | null;
  onChange: (input: MortgagePointsInput) => void;
  onReset: () => void;
}

export function MortgagePointsForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: MortgagePointsFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [optionIOpen, setOptionIOpen] = React.useState(true);
  const [optionIIOpen, setOptionIIOpen] = React.useState(true);

  const loanSymbol = getCurrencySymbol(input.loanCurrency);
  const costISymbol = getCurrencySymbol(input.optionICostCurrency);
  const costIISymbol = getCurrencySymbol(input.optionIICostCurrency);
  const resultSymbol = getCurrencySymbol(result?.currency ?? input.loanCurrency);

  const set = (patch: Partial<MortgagePointsInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const costInCurrency = (
    loanAmount: number,
    points: number,
    costCurrency: SupportedCurrency,
    loanCurrency: SupportedCurrency
  ): string | null => {
    const costLoan = pointsCostFromPercent(loanAmount, points);
    if (costCurrency === loanCurrency) {
      return moneyAmountToInputString(costLoan);
    }
    if (!canConvertPair(loanCurrency, costCurrency)) return null;
    const converted = convertCurrency({
      amount: costLoan,
      from: loanCurrency,
      to: costCurrency,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const applyDiscountRates = (
    next: MortgagePointsInput,
    pointsI: number,
    pointsII: number
  ): MortgagePointsInput => {
    if (!next.manualAdjust) return next;
    const initial = Number(next.initialRatePercent);
    const discount = Number(next.discountPercentPerPoint);
    if (!Number.isFinite(initial) || !Number.isFinite(discount)) return next;
    return {
      ...next,
      optionIRatePercent: moneyAmountToInputString(
        Math.max(0, discountedRatePercent(initial, pointsI, discount))
      ),
      optionIIRatePercent: moneyAmountToInputString(
        Math.max(0, discountedRatePercent(initial, pointsII, discount))
      ),
    };
  };

  const handleLoanCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.loanCurrency) return;
    const nextAmount = convertFieldAmount(input.loanAmount, input.loanCurrency, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    if (
      (input.optionICostCurrency !== next &&
        !canConvertPair(input.optionICostCurrency, next)) ||
      (input.optionIICostCurrency !== next &&
        !canConvertPair(input.optionIICostCurrency, next))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, loanCurrency: next, loanAmount: nextAmount });
  };

  const handleCostCurrencyChange = (
    option: 'I' | 'II',
    next: SupportedCurrency
  ) => {
    if (option === 'I') {
      if (next === input.optionICostCurrency) return;
      const nextAmount = convertFieldAmount(
        input.optionICost,
        input.optionICostCurrency,
        next
      );
      if (nextAmount === null) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({
        ...input,
        optionICostCurrency: next,
        optionICost: nextAmount,
      });
      return;
    }
    if (next === input.optionIICostCurrency) return;
    const nextAmount = convertFieldAmount(
      input.optionIICost,
      input.optionIICostCurrency,
      next
    );
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      optionIICostCurrency: next,
      optionIICost: nextAmount,
    });
  };

  const handleLoanAmountChange = (raw: string) => {
    const loan = parseMoneyInput(raw);
    const pointsI = parseMoneyInput(input.optionIPoints);
    const pointsII = parseMoneyInput(input.optionIIPoints);
    const next: MortgagePointsInput = { ...input, loanAmount: raw };
    if (Number.isFinite(loan) && loan > 0) {
      if (Number.isFinite(pointsI) && pointsI >= 0) {
        const c = costInCurrency(
          loan,
          pointsI,
          input.optionICostCurrency,
          input.loanCurrency
        );
        if (c !== null) next.optionICost = c;
      }
      if (Number.isFinite(pointsII) && pointsII >= 0) {
        const c = costInCurrency(
          loan,
          pointsII,
          input.optionIICostCurrency,
          input.loanCurrency
        );
        if (c !== null) next.optionIICost = c;
      }
    }
    setConversionError(null);
    onChange(next);
  };

  const handlePointsChange = (option: 'I' | 'II', raw: string) => {
    const loan = parseMoneyInput(input.loanAmount);
    const points = parseMoneyInput(raw);
    let next: MortgagePointsInput =
      option === 'I'
        ? { ...input, optionIPoints: raw }
        : { ...input, optionIIPoints: raw };

    if (Number.isFinite(loan) && loan > 0 && Number.isFinite(points) && points >= 0) {
      const costCurrency =
        option === 'I' ? input.optionICostCurrency : input.optionIICostCurrency;
      const c = costInCurrency(loan, points, costCurrency, input.loanCurrency);
      if (c !== null) {
        if (option === 'I') next.optionICost = c;
        else next.optionIICost = c;
      }
    }

    const pointsI =
      option === 'I'
        ? Number.isFinite(points)
          ? points
          : Number(input.optionIPoints)
        : Number(input.optionIPoints);
    const pointsII =
      option === 'II'
        ? Number.isFinite(points)
          ? points
          : Number(input.optionIIPoints)
        : Number(input.optionIIPoints);
    next = applyDiscountRates(next, pointsI, pointsII);
    setConversionError(null);
    onChange(next);
  };

  const handleCostChange = (option: 'I' | 'II', raw: string) => {
    const loan = parseMoneyInput(input.loanAmount);
    const costRaw = parseMoneyInput(raw);
    let next: MortgagePointsInput =
      option === 'I'
        ? { ...input, optionICost: raw }
        : { ...input, optionIICost: raw };

    if (Number.isFinite(loan) && loan > 0 && Number.isFinite(costRaw) && costRaw >= 0) {
      const from =
        option === 'I' ? input.optionICostCurrency : input.optionIICostCurrency;
      let costLoan = costRaw;
      if (from !== input.loanCurrency) {
        if (!canConvertPair(from, input.loanCurrency)) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          onChange(next);
          return;
        }
        const converted = convertCurrency({
          amount: costRaw,
          from,
          to: input.loanCurrency,
          rates: rates.rates,
        });
        if (!converted.ok) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          onChange(next);
          return;
        }
        costLoan = converted.amount;
      }
      const pts = pointsFromCost(loan, costLoan);
      if (pts !== null) {
        const ptsStr = moneyAmountToInputString(pts);
        if (option === 'I') next.optionIPoints = ptsStr;
        else next.optionIIPoints = ptsStr;
        next = applyDiscountRates(
          next,
          option === 'I' ? pts : Number(input.optionIPoints),
          option === 'II' ? pts : Number(input.optionIIPoints)
        );
      }
    }
    setConversionError(null);
    onChange(next);
  };

  const handleInitialRateChange = (raw: string) => {
    let next: MortgagePointsInput = { ...input, initialRatePercent: raw };
    next = applyDiscountRates(
      next,
      Number(input.optionIPoints),
      Number(input.optionIIPoints)
    );
    setConversionError(null);
    onChange(next);
  };

  const handleDiscountChange = (raw: string) => {
    let next: MortgagePointsInput = {
      ...input,
      discountPercentPerPoint: raw,
    };
    next = applyDiscountRates(
      next,
      Number(input.optionIPoints),
      Number(input.optionIIPoints)
    );
    setConversionError(null);
    onChange(next);
  };

  const handleManualAdjust = (checked: boolean) => {
    let next: MortgagePointsInput = { ...input, manualAdjust: checked };
    if (checked) {
      next = applyDiscountRates(
        next,
        Number(input.optionIPoints),
        Number(input.optionIIPoints)
      );
    }
    setConversionError(null);
    onChange(next);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Mortgage setup
        </legend>

        <div>
          <label className={labelClass} htmlFor="mp-loan-amount">
            <span>Original loan amount</span>
            <InfoTooltip
              label="Original loan amount"
              text="Mortgage principal before points. Changing currency converts this amount with stored rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanAmount}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {loanSymbol}
              </span>
              <input
                id="mp-loan-amount"
                className={inputClass}
                inputMode="decimal"
                value={input.loanAmount}
                aria-invalid={Boolean(errors.loanAmount)}
                onChange={(e) => handleLoanAmountChange(e.target.value)}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mp-loan-currency"
                value={input.loanCurrency}
                onChange={handleLoanCurrencyChange}
                aria-label="Original loan amount currency"
              />
            </div>
          </div>
          {errors.loanAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanAmount}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mp-mortgage-term">
            <span>Mortgage term</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.mortgageTerm}>
              <input
                id="mp-mortgage-term"
                className={inputClass}
                inputMode="decimal"
                value={input.mortgageTerm}
                aria-invalid={Boolean(errors.mortgageTerm)}
                onChange={(e) => set({ mortgageTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="mp-term-unit"
                className={selectClass}
                value={input.termUnit}
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
                aria-label="Mortgage term unit"
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.mortgageTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.mortgageTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mp-initial-rate">
            <span>Initial interest rate</span>
          </label>
          <FieldShell error={errors.initialRatePercent}>
            <input
              id="mp-initial-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.initialRatePercent}
              aria-invalid={Boolean(errors.initialRatePercent)}
              onChange={(e) => handleInitialRateChange(e.target.value)}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.initialRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mp-compounding">
            <span>Compounding frequency</span>
            <InfoTooltip
              label="Compounding frequency"
              text="Monthly (UK & US) uses APR÷12. Semi-annually (Canada) compounds twice a year before converting to an equivalent monthly rate."
            />
          </label>
          <select
            id="mp-compounding"
            className={selectClass}
            value={input.compounding}
            onChange={(e) =>
              set({ compounding: e.target.value as CompoundingFrequency })
            }
          >
            {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="mp-due-date">
            <span>Due date</span>
            <InfoTooltip
              label="Due date"
              text="First monthly payment date. Used to label years on the annual balances chart."
            />
          </label>
          <FieldShell error={errors.dueDate}>
            <input
              id="mp-due-date"
              type="date"
              className={inputClass}
              value={input.dueDate}
              aria-invalid={Boolean(errors.dueDate)}
              onChange={(e) => set({ dueDate: e.target.value })}
            />
          </FieldShell>
          {errors.dueDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={input.manualAdjust}
            onChange={(e) => handleManualAdjust(e.target.checked)}
          />
          <span>Set discount percentages and type of payments manually</span>
        </label>

        {input.manualAdjust ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="mp-discount">
                <span>Discount percentage</span>
                <InfoTooltip
                  label="Discount percentage"
                  text="Rate reduction gained per 1.0 mortgage point. Default 0.25%. Updates Option I and Option II rates automatically."
                />
              </label>
              <FieldShell error={errors.discountPercentPerPoint}>
                <input
                  id="mp-discount"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.discountPercentPerPoint}
                  aria-invalid={Boolean(errors.discountPercentPerPoint)}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.discountPercentPerPoint ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.discountPercentPerPoint}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mp-payment-type">
                <span>Type of payment</span>
              </label>
              <select
                id="mp-payment-type"
                className={selectClass}
                value={input.paymentType}
                onChange={(e) =>
                  set({ paymentType: e.target.value as PointsPaymentType })
                }
              >
                {POINTS_PAYMENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1">
          <button
            type="button"
            className="text-[13px] font-semibold text-accent"
            onClick={() => setOptionIOpen((v) => !v)}
            aria-expanded={optionIOpen}
          >
            Option I {optionIOpen ? '▾' : '▸'}
          </button>
        </legend>
        {optionIOpen ? (
          <>
            <div>
              <label className={labelClass} htmlFor="mp-opt1-points">
                <span>Mortgage points</span>
                <InfoTooltip
                  label="Mortgage points"
                  text="Number of discount points. 1 point = 1% of the original loan amount."
                />
              </label>
              <FieldShell error={errors.optionIPoints}>
                <input
                  id="mp-opt1-points"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.optionIPoints}
                  aria-invalid={Boolean(errors.optionIPoints)}
                  onChange={(e) => handlePointsChange('I', e.target.value)}
                />
              </FieldShell>
              {errors.optionIPoints ? (
                <p className="mt-1 text-xs text-rose-600">{errors.optionIPoints}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mp-opt1-cost">
                <span>Cost of mortgage points</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.optionICost}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {costISymbol}
                  </span>
                  <input
                    id="mp-opt1-cost"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.optionICost}
                    aria-invalid={Boolean(errors.optionICost)}
                    onChange={(e) => handleCostChange('I', e.target.value)}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mp-opt1-cost-currency"
                    value={input.optionICostCurrency}
                    onChange={(c) => handleCostCurrencyChange('I', c)}
                    aria-label="Option I points cost currency"
                  />
                </div>
              </div>
              {errors.optionICost ? (
                <p className="mt-1 text-xs text-rose-600">{errors.optionICost}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mp-opt1-rate">
                <span>New interest rate</span>
              </label>
              <FieldShell error={errors.optionIRatePercent}>
                <input
                  id="mp-opt1-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.optionIRatePercent}
                  aria-invalid={Boolean(errors.optionIRatePercent)}
                  onChange={(e) => set({ optionIRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.optionIRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.optionIRatePercent}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1">
          <button
            type="button"
            className="text-[13px] font-semibold text-accent"
            onClick={() => setOptionIIOpen((v) => !v)}
            aria-expanded={optionIIOpen}
          >
            Option II {optionIIOpen ? '▾' : '▸'}
          </button>
        </legend>
        {optionIIOpen ? (
          <>
            <div>
              <label className={labelClass} htmlFor="mp-opt2-points">
                <span>Mortgage points</span>
                <InfoTooltip
                  label="Mortgage points"
                  text="Number of discount points. 1 point = 1% of the original loan amount."
                />
              </label>
              <FieldShell error={errors.optionIIPoints}>
                <input
                  id="mp-opt2-points"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.optionIIPoints}
                  aria-invalid={Boolean(errors.optionIIPoints)}
                  onChange={(e) => handlePointsChange('II', e.target.value)}
                />
              </FieldShell>
              {errors.optionIIPoints ? (
                <p className="mt-1 text-xs text-rose-600">{errors.optionIIPoints}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mp-opt2-cost">
                <span>Cost of mortgage points</span>
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.optionIICost}>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {costIISymbol}
                  </span>
                  <input
                    id="mp-opt2-cost"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.optionIICost}
                    aria-invalid={Boolean(errors.optionIICost)}
                    onChange={(e) => handleCostChange('II', e.target.value)}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="mp-opt2-cost-currency"
                    value={input.optionIICostCurrency}
                    onChange={(c) => handleCostCurrencyChange('II', c)}
                    aria-label="Option II points cost currency"
                  />
                </div>
              </div>
              {errors.optionIICost ? (
                <p className="mt-1 text-xs text-rose-600">{errors.optionIICost}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="mp-opt2-rate">
                <span>New interest rate</span>
              </label>
              <FieldShell error={errors.optionIIRatePercent}>
                <input
                  id="mp-opt2-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.optionIIRatePercent}
                  aria-invalid={Boolean(errors.optionIIRatePercent)}
                  onChange={(e) => set({ optionIIRatePercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.optionIIRatePercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.optionIIRatePercent}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </fieldset>

      {conversionError || errors.form || ratesStatus.warning ? (
        <div className="space-y-1">
          {conversionError ? (
            <p className="text-xs text-rose-600">{conversionError}</p>
          ) : null}
          {errors.form ? (
            <p className="text-xs text-rose-600">{errors.form}</p>
          ) : null}
          {ratesStatus.warning && !conversionError && !errors.form ? (
            <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-sm font-semibold text-accent">Results</h3>
            <p className="text-xs text-muted-foreground">
              Baseline payment {resultSymbol}
              {result.formattedBaselineMonthlyPayment}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium"> </th>
                  <th className="py-2 px-2 font-semibold text-accent">Option I</th>
                  <th className="py-2 pl-2 font-semibold text-accent">Option II</th>
                </tr>
              </thead>
              <tbody className="tabular-nums text-accent">
                {(
                  [
                    ['Principal', 'formattedPrincipal'],
                    ['Monthly payment', 'formattedMonthlyPayment'],
                    ['Monthly savings', 'formattedMonthlySavings'],
                    ['Mortgage rate', 'formattedRate'],
                    ['Break even', 'formattedBreakEven'],
                    ['Total interest', 'formattedTotalInterest'],
                    ['Total payments', 'formattedTotalPayments'],
                  ] as const
                ).map(([label, key]) => (
                  <tr key={label} className="border-b border-border/70">
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{label}</td>
                    <td className="py-2 px-2 font-medium">
                      {key === 'formattedRate' || key === 'formattedBreakEven'
                        ? result.optionI[key]
                        : `${resultSymbol}${result.optionI[key]}`}
                    </td>
                    <td className="py-2 pl-2 font-medium">
                      {key === 'formattedRate' || key === 'formattedBreakEven'
                        ? result.optionII[key]
                        : `${resultSymbol}${result.optionII[key]}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <MortgagePointsChart points={result.chart} currency={result.currency} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 px-3 text-xs font-medium"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
