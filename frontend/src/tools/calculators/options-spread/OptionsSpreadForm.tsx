'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
  EQUITY_OPTION_CONTRACT_MULTIPLIER,
  longLegTitle,
  longPremiumLabel,
  longStrikeLabel,
  resultsTitle,
  shortLegTitle,
  shortPremiumLabel,
  shortStrikeLabel,
  strategyNote,
  type OptionsSpreadFieldErrors,
  type OptionsSpreadInput,
  type OptionsSpreadResult,
  type OptionsSpreadStrategy,
} from './types';

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
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function Collapsible({
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
    <div className="rounded-xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-accent"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? <div className="space-y-3 border-t border-border px-4 py-3">{children}</div> : null}
    </div>
  );
}

interface OptionsSpreadFormProps {
  input: OptionsSpreadInput;
  errors: OptionsSpreadFieldErrors;
  result: OptionsSpreadResult | null;
  onChange: (input: OptionsSpreadInput) => void;
}

export function OptionsSpreadForm({
  input,
  errors,
  result,
  onChange,
}: OptionsSpreadFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(
    null
  );
  const [openLong, setOpenLong] = React.useState(true);
  const [openShort, setOpenShort] = React.useState(true);
  const [openResults, setOpenResults] = React.useState(true);

  const set = (patch: Partial<OptionsSpreadInput>) => {
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

  const convertField = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): { ok: true; value: string } | { ok: false } => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return { ok: true, value: raw };
    if (!canConvertPair(from, to)) return { ok: false };
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return { ok: false };
    return { ok: true, value: moneyAmountToInputString(converted.amount) };
  };

  const handleMoneyCurrency = (
    amountKey: keyof OptionsSpreadInput,
    currencyKey: keyof OptionsSpreadInput,
    next: SupportedCurrency
  ) => {
    const prev = input[currencyKey] as SupportedCurrency;
    if (prev === next) return;
    const raw = String(input[amountKey] ?? '');
    const converted = convertField(raw, prev, next);
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    set({
      [currencyKey]: next,
      [amountKey]: converted.value,
    } as Partial<OptionsSpreadInput>);
  };

  const strategies: { value: OptionsSpreadStrategy; label: string }[] = [
    { value: 'bull-call', label: 'Bull call spread' },
    { value: 'bull-put', label: 'Bull put spread' },
    { value: 'bear-call', label: 'Bear call spread' },
    { value: 'bear-put', label: 'Bear put spread' },
  ];

  const moneyField = (
    id: string,
    label: string,
    amountKey: keyof OptionsSpreadInput,
    currencyKey: keyof OptionsSpreadInput,
    error?: string,
    tip?: string
  ) => {
    const currency = input[currencyKey] as SupportedCurrency;
    const symbol = getCurrencySymbol(currency);
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {label}
          {tip ? <InfoTooltip label={label} text={tip} /> : null}
        </label>
        <div className="flex gap-2">
          <FieldShell error={error}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id={id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={String(input[amountKey] ?? '')}
              onChange={(e) =>
                set({ [amountKey]: e.target.value } as Partial<OptionsSpreadInput>)
              }
              className={inputClass}
              aria-invalid={Boolean(error)}
            />
          </FieldShell>
          <CurrencySelect
            id={`${id}-ccy`}
            value={currency}
            onChange={(code) => handleMoneyCurrency(amountKey, currencyKey, code)}
            aria-label={`${label} currency`}
            showDenominationNote={false}
            className="w-[7.5rem] shrink-0 [&_button]:h-11"
          />
        </div>
        {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
      </div>
    );
  };

  const resultField = (
    id: string,
    label: string,
    value: string,
    currencyKey: keyof OptionsSpreadInput,
    tip?: string
  ) => {
    const currency = input[currencyKey] as SupportedCurrency;
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {label}
          {tip ? <InfoTooltip label={label} text={tip} /> : null}
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <input
              id={id}
              type="text"
              readOnly
              value={value}
              className={inputClass}
              aria-live="polite"
            />
          </FieldShell>
          <CurrencySelect
            id={`${id}-ccy`}
            value={currency}
            onChange={(code) =>
              set({ [currencyKey]: code } as Partial<OptionsSpreadInput>)
            }
            aria-label={`${label} currency`}
            showDenominationNote={false}
            className="w-[7.5rem] shrink-0 [&_button]:h-11"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Vertical spreads at expiration. Payoffs use standard equity multiplier{' '}
        {EQUITY_OPTION_CONTRACT_MULTIPLIER} × contracts. Money fields use
        independent FX (normalized to the target-price currency). Fees, taxes,
        and early exercise are not modeled.
      </p>
      {ratesStatus.available ? null : (
        <p className="text-xs text-muted-foreground">
          {CURRENCY_CONVERSION_UNAVAILABLE_NOTE} Same-currency inputs still
          calculate.
        </p>
      )}
      {ratesStatus.isStale && ratesStatus.warning ? (
        <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}

      <fieldset>
        <legend className={labelClass}>Select calculator mode:</legend>
        <div className="mt-1.5 flex flex-col gap-2">
          {strategies.map((s) => (
            <label
              key={s.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="options-spread-strategy"
                value={s.value}
                checked={input.strategy === s.value}
                onChange={() => set({ strategy: s.value })}
                className="h-4 w-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {moneyField(
        'os-target',
        'Your target price at expiration',
        'targetPrice',
        'targetCurrency',
        errors.targetPrice,
        'Underlying price used to estimate potential profit at expiration.'
      )}

      <div>
        <label htmlFor="os-contracts" className={labelClass}>
          Amount of options you will trade
          <InfoTooltip
            label="Contracts"
            text={`Whole number of contracts. Each standard equity contract covers ${EQUITY_OPTION_CONTRACT_MULTIPLIER} shares.`}
          />
        </label>
        <FieldShell error={errors.contracts}>
          <input
            id="os-contracts"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={input.contracts}
            onChange={(e) => set({ contracts: e.target.value })}
            className={inputClass}
            aria-invalid={Boolean(errors.contracts)}
          />
        </FieldShell>
        {errors.contracts ? (
          <p className="mt-1 text-xs text-rose-600">{errors.contracts}</p>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {strategyNote(input.strategy)}
      </p>

      <Collapsible
        title={longLegTitle(input.strategy)}
        open={openLong}
        onToggle={() => setOpenLong((v) => !v)}
      >
        {moneyField(
          'os-long-strike',
          longStrikeLabel(input.strategy),
          'longStrike',
          'longStrikeCurrency',
          errors.longStrike
        )}
        {moneyField(
          'os-long-premium',
          longPremiumLabel(input.strategy),
          'longPremium',
          'longPremiumCurrency',
          errors.longPremium
        )}
      </Collapsible>

      <Collapsible
        title={shortLegTitle(input.strategy)}
        open={openShort}
        onToggle={() => setOpenShort((v) => !v)}
      >
        {moneyField(
          'os-short-strike',
          shortStrikeLabel(input.strategy),
          'shortStrike',
          'shortStrikeCurrency',
          errors.shortStrike
        )}
        {moneyField(
          'os-short-premium',
          shortPremiumLabel(input.strategy),
          'shortPremium',
          'shortPremiumCurrency',
          errors.shortPremium
        )}
      </Collapsible>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {errors.form}
        </p>
      ) : null}

      <Collapsible
        title={resultsTitle(input.strategy)}
        open={openResults}
        onToggle={() => setOpenResults((v) => !v)}
      >
        {resultField(
          'os-net',
          result?.netSpreadLabel ?? 'Net debit/credit spread',
          result?.formattedNetSpread ?? '',
          'netSpreadCurrency'
        )}
        {resultField(
          'os-max-loss',
          'Maximum loss',
          result?.formattedMaxLoss ?? '',
          'maxLossCurrency'
        )}
        {resultField(
          'os-max-profit',
          'Maximum profit',
          result?.formattedMaxProfit ?? '',
          'maxProfitCurrency'
        )}
        {resultField(
          'os-be',
          'Breakeven price',
          result?.formattedBreakeven ?? '',
          'breakevenCurrency'
        )}
        {resultField(
          'os-pot',
          'Potential profit',
          result?.formattedPotentialProfit ?? '',
          'potentialProfitCurrency',
          'Estimated P/L at your target price at expiration (fees ignored).'
        )}
      </Collapsible>
    </div>
  );
}
