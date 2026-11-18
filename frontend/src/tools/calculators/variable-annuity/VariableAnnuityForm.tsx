'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, Share2 } from 'lucide-react';
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
  ANNUITY_TYPE_OPTIONS,
  FILING_STATUS_OPTIONS,
  FREQUENCY_OPTIONS,
  KNOW_TARGET_OPTIONS,
  TAX_METHOD_OPTIONS,
  type AnnuityType,
  type FilingStatus,
  type Frequency,
  type KnowTarget,
  type TaxMethod,
  type VariableAnnuityFieldErrors,
  type VariableAnnuityInput,
  type VariableAnnuityResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface VariableAnnuityFormProps {
  input: VariableAnnuityInput;
  errors: VariableAnnuityFieldErrors;
  result: VariableAnnuityResult | null;
  onChange: (input: VariableAnnuityInput) => void;
}

export function VariableAnnuityForm({
  input,
  errors,
  result,
  onChange,
}: VariableAnnuityFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [mainOpen, setMainOpen] = React.useState(true);
  const [taxOpen, setTaxOpen] = React.useState(true);
  const [resultsOpen, setResultsOpen] = React.useState(true);

  const startSymbol = getCurrencySymbol(input.startingBalanceCurrency);
  const contribSymbol = getCurrencySymbol(input.contributionCurrency);
  const incomeSymbol = getCurrencySymbol(input.annualIncomeCurrency);
  const resultSymbol = result ? getCurrencySymbol(result.currency) : startSymbol;

  const set = (patch: Partial<VariableAnnuityInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const syncAgesToLength = (currentAge: string, withdrawalAge: string) => {
    const c = Number(currentAge);
    const w = Number(withdrawalAge);
    if (Number.isFinite(c) && Number.isFinite(w) && w > c) {
      set({ currentAge, withdrawalAge, lengthYears: String(w - c) });
      return;
    }
    set({ currentAge, withdrawalAge });
  };

  const syncLengthToWithdrawal = (lengthYears: string) => {
    const len = Number(lengthYears);
    const c = Number(input.currentAge);
    if (Number.isFinite(len) && Number.isFinite(c) && len > 0) {
      set({ lengthYears, withdrawalAge: String(c + len) });
      return;
    }
    set({ lengthYears });
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
    amountRaw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(amountRaw);
    if (!Number.isFinite(amount)) return amountRaw;
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

  const handleMoneyCurrencyChange = (
    field: 'startingBalanceCurrency' | 'contributionCurrency' | 'annualIncomeCurrency',
    amountField: 'startingBalance' | 'contribution' | 'annualIncome',
    next: SupportedCurrency
  ) => {
    const from = input[field];
    if (next === from) return;

    if (field === 'startingBalanceCurrency') {
      for (const other of [input.contributionCurrency, input.annualIncomeCurrency]) {
        if (other !== next && !canConvertPair(next, other)) {
          setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
          return;
        }
      }
    } else if (
      input.startingBalanceCurrency !== next &&
      !canConvertPair(input.startingBalanceCurrency, next)
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const nextAmount = convertFieldAmount(input[amountField], from, next);
    if (nextAmount === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [field]: next, [amountField]: nextAmount });
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
          Annuity specifications
        </legend>
        <div>
          <label className={labelClass} htmlFor="va-know">
            I&apos;d like to know...
          </label>
          <select
            id="va-know"
            className={selectClass}
            value={input.knowTarget}
            onChange={(e) => set({ knowTarget: e.target.value as KnowTarget })}
          >
            {KNOW_TARGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setMainOpen((v) => !v)}
        >
          <legend className="text-[13px] font-semibold text-accent">Main specifications</legend>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${mainOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mainOpen ? (
          <div className="mt-3.5 space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="va-start">
                <span>Starting balance</span>
                <InfoTooltip
                  label="Starting balance"
                  text="Initial amount in the annuity at the start of the accumulation period."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.startingBalance}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {startSymbol}
                  </span>
                  <input
                    id="va-start"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.startingBalance}
                    aria-invalid={Boolean(errors.startingBalance)}
                    onChange={(e) => set({ startingBalance: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="va-start-currency"
                    value={input.startingBalanceCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'startingBalanceCurrency',
                        'startingBalance',
                        next
                      )
                    }
                    aria-label="Starting balance currency"
                  />
                </div>
              </div>
              {errors.startingBalance ? (
                <p className="mt-1 text-xs text-rose-600">{errors.startingBalance}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-age">
                Current age
              </label>
              <FieldShell error={errors.currentAge}>
                <input
                  id="va-age"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.currentAge}
                  aria-invalid={Boolean(errors.currentAge)}
                  onChange={(e) => syncAgesToLength(e.target.value, input.withdrawalAge)}
                />
              </FieldShell>
              {errors.currentAge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.currentAge}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-wd-age">
                <span>Withdrawal age</span>
                <InfoTooltip
                  label="Withdrawal age"
                  text="Age when accumulation ends. Length of annuity is withdrawal age minus current age."
                />
              </label>
              <FieldShell error={errors.withdrawalAge}>
                <input
                  id="va-wd-age"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.withdrawalAge}
                  aria-invalid={Boolean(errors.withdrawalAge)}
                  onChange={(e) => syncAgesToLength(input.currentAge, e.target.value)}
                />
              </FieldShell>
              {errors.withdrawalAge ? (
                <p className="mt-1 text-xs text-rose-600">{errors.withdrawalAge}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-length">
                Length of annuity
              </label>
              <FieldShell error={errors.lengthYears}>
                <input
                  id="va-length"
                  className={`${inputClass} pr-10`}
                  inputMode="decimal"
                  value={input.lengthYears}
                  aria-invalid={Boolean(errors.lengthYears)}
                  onChange={(e) => syncLengthToWithdrawal(e.target.value)}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  yrs
                </span>
              </FieldShell>
              {errors.lengthYears ? (
                <p className="mt-1 text-xs text-rose-600">{errors.lengthYears}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-contrib">
                <span>Contribution</span>
                <InfoTooltip
                  label="Contribution"
                  text="Recurring deposit each payment period. Grows by the annual growth rate when that rate is not zero."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.contribution}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {contribSymbol}
                  </span>
                  <input
                    id="va-contrib"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.contribution}
                    aria-invalid={Boolean(errors.contribution)}
                    onChange={(e) => set({ contribution: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="va-contrib-currency"
                    value={input.contributionCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'contributionCurrency',
                        'contribution',
                        next
                      )
                    }
                    aria-label="Contribution currency"
                  />
                </div>
              </div>
              {errors.contribution ? (
                <p className="mt-1 text-xs text-rose-600">{errors.contribution}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-pay-freq">
                Annuity payment frequency
              </label>
              <select
                id="va-pay-freq"
                className={selectClass}
                value={input.paymentFrequency}
                onChange={(e) =>
                  set({ paymentFrequency: e.target.value as Frequency })
                }
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="va-type">
                <span>Type of annuity</span>
                <InfoTooltip
                  label="Type of annuity"
                  text="Annuity due deposits at the beginning of each period; ordinary annuity deposits at the end."
                />
              </label>
              <select
                id="va-type"
                className={selectClass}
                value={input.annuityType}
                onChange={(e) => set({ annuityType: e.target.value as AnnuityType })}
              >
                {ANNUITY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="va-rate">
                Expected rate of return
              </label>
              <FieldShell error={errors.rateOfReturnPercent}>
                <input
                  id="va-rate"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.rateOfReturnPercent}
                  aria-invalid={Boolean(errors.rateOfReturnPercent)}
                  onChange={(e) => set({ rateOfReturnPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.rateOfReturnPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.rateOfReturnPercent}</p>
              ) : null}
            </div>

            <div>
              <label className={labelClass} htmlFor="va-comp">
                <span>Compounding frequency</span>
                <InfoTooltip
                  label="Compounding frequency"
                  text="How often the nominal annual return compounds. Converted to an equivalent rate per payment period."
                />
              </label>
              <select
                id="va-comp"
                className={selectClass}
                value={input.compoundingFrequency}
                onChange={(e) =>
                  set({ compoundingFrequency: e.target.value as Frequency })
                }
              >
                {FREQUENCY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="va-growth">
                Annual growth rate
              </label>
              <FieldShell error={errors.annualGrowthPercent}>
                <input
                  id="va-growth"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.annualGrowthPercent}
                  aria-invalid={Boolean(errors.annualGrowthPercent)}
                  onChange={(e) => set({ annualGrowthPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.annualGrowthPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualGrowthPercent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setTaxOpen((v) => !v)}
        >
          <legend className="text-[13px] font-semibold text-accent">Tax specification</legend>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${taxOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {taxOpen ? (
          <div className="mt-3.5 space-y-3.5">
            <div>
              <label className={labelClass} htmlFor="va-tax-method">
                Setting option
              </label>
              <select
                id="va-tax-method"
                className={selectClass}
                value={input.taxMethod}
                onChange={(e) => set({ taxMethod: e.target.value as TaxMethod })}
              >
                {TAX_METHOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="va-filing">
                Filing status
              </label>
              <select
                id="va-filing"
                className={selectClass}
                value={input.filingStatus}
                onChange={(e) =>
                  set({ filingStatus: e.target.value as FilingStatus })
                }
              >
                {FILING_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="va-income">
                Annual income
              </label>
              <div className="flex gap-2">
                <FieldShell error={errors.annualIncome}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {incomeSymbol}
                  </span>
                  <input
                    id="va-income"
                    className={inputClass}
                    inputMode="decimal"
                    value={input.annualIncome}
                    aria-invalid={Boolean(errors.annualIncome)}
                    onChange={(e) => set({ annualIncome: e.target.value })}
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="va-income-currency"
                    value={input.annualIncomeCurrency}
                    onChange={(next) =>
                      handleMoneyCurrencyChange(
                        'annualIncomeCurrency',
                        'annualIncome',
                        next
                      )
                    }
                    aria-label="Annual income currency"
                  />
                </div>
              </div>
              {errors.annualIncome ? (
                <p className="mt-1 text-xs text-rose-600">{errors.annualIncome}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="va-inc-growth">
                Expected annual growth in income
              </label>
              <FieldShell error={errors.incomeGrowthPercent}>
                <input
                  id="va-inc-growth"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.incomeGrowthPercent}
                  aria-invalid={Boolean(errors.incomeGrowthPercent)}
                  onChange={(e) => set({ incomeGrowthPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.incomeGrowthPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.incomeGrowthPercent}</p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="va-inflation">
                <span>Inflation rate</span>
                <InfoTooltip
                  label="Inflation rate"
                  text="Used to inflate published federal tax brackets each year in the taxable-account estimate."
                />
              </label>
              <FieldShell error={errors.inflationPercent}>
                <input
                  id="va-inflation"
                  className={`${inputClass} pr-8`}
                  inputMode="decimal"
                  value={input.inflationPercent}
                  aria-invalid={Boolean(errors.inflationPercent)}
                  onChange={(e) => set({ inflationPercent: e.target.value })}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </FieldShell>
              {errors.inflationPercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.inflationPercent}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setResultsOpen((v) => !v)}
        >
          <legend className="text-[13px] font-semibold text-accent">Results</legend>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${resultsOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {resultsOpen ? (
          <div className="mt-3.5 space-y-3">
            {result ? (
              <>
                <p className="text-sm leading-relaxed text-accent">
                  The <strong>final balance</strong> of your annuity is estimated to be{' '}
                  <strong>
                    {resultSymbol}
                    {result.formattedFinalBalanceBeforeTax}
                  </strong>
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <table className="w-full text-sm">
                    <tbody>
                      {(
                        [
                          ['Opening Balance', result.formattedOpeningBalance],
                          [
                            'Final balance Before tax',
                            result.formattedFinalBalanceBeforeTax,
                          ],
                          [
                            'Final balance if it were taxable',
                            result.formattedFinalBalanceTaxable,
                          ],
                          ['Total return', result.formattedTotalReturn],
                          [
                            'Number of contributions',
                            String(result.numberOfContributions),
                          ],
                          [
                            'Annual contribution',
                            result.formattedAnnualContribution,
                          ],
                          [
                            'Total contribution',
                            result.formattedTotalContribution,
                          ],
                        ] as const
                      ).map(([label, value], idx, arr) => (
                        <tr
                          key={label}
                          className={idx < arr.length - 1 ? 'border-b border-border' : ''}
                        >
                          <th className="px-3 py-2.5 text-left font-medium text-accent">
                            {label}
                          </th>
                          <td className="px-3 py-2.5 text-right tabular-nums text-accent">
                            {label.startsWith('Number') || value === '—'
                              ? value
                              : `${resultSymbol}${value}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.taxableNote ? (
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    {result.taxableNote}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter valid inputs to see estimated results.
              </p>
            )}
            {conversionError ? (
              <p className="text-xs text-rose-600" role="alert">
                {conversionError}
              </p>
            ) : null}
            {ratesStatus.warning && !conversionError ? (
              <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
            ) : null}
            {errors.form ? (
              <p className="text-xs text-rose-600">{errors.form}</p>
            ) : null}
          </div>
        ) : null}
      </fieldset>
    </form>
  );
}

export function VariableAnnuityActions({
  canShare,
  shareLabel,
  clearDisabled,
  onShare,
  onReload,
  onClear,
}: {
  canShare: boolean;
  shareLabel: string;
  clearDisabled: boolean;
  onShare: () => void;
  onReload: () => void;
  onClear: () => void;
}) {
  return (
    <div className="border-t border-border/80 pt-4">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={onShare}
          disabled={!canShare}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-white p-3.5 text-center transition-colors hover:bg-muted/20 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-xs">
            <Share2 className="h-4 w-4" />
          </div>
          <span className="text-xs font-semibold text-accent">{shareLabel}</span>
        </button>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-center rounded-xl border-border text-xs font-semibold text-accent hover:bg-muted/30"
            onClick={onReload}
          >
            Reload calculator
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={clearDisabled}
            className="h-9 w-full justify-center text-xs font-normal text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onClear}
          >
            Clear all changes
          </Button>
        </div>
      </div>
    </div>
  );
}
