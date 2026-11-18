'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  FUTURES_CONTRACT_OPTIONS,
  type FuturesContractId,
  type MarginCallFieldErrors,
  type MarginCallInput,
  type MarginCallResult,
  type TradingDirection,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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
    <section className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left sm:px-4"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold text-accent">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-primary" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-primary" aria-hidden="true" />
        )}
      </button>
      {open ? <div className="space-y-3.5 px-3.5 pb-3.5 sm:px-4 sm:pb-4">{children}</div> : null}
    </section>
  );
}

interface MarginCallFormProps {
  input: MarginCallInput;
  errors: MarginCallFieldErrors;
  result: MarginCallResult | null;
  onChange: (input: MarginCallInput) => void;
}

export function MarginCallForm({
  input,
  errors,
  result,
  onChange,
}: MarginCallFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [openAccount, setOpenAccount] = React.useState(true);
  const [openContract, setOpenContract] = React.useState(true);
  const [openTrading, setOpenTrading] = React.useState(true);
  const [openMargin, setOpenMargin] = React.useState(false);

  const set = (patch: Partial<MarginCallInput>) => {
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
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): number | null => {
    if (from === to) return amount;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    return converted.ok ? converted.amount : null;
  };

  const changeMoneyCurrency = (
    field: keyof MarginCallInput,
    currencyField: keyof MarginCallInput,
    currentCurrency: SupportedCurrency,
    next: SupportedCurrency
  ) => {
    if (next === currentCurrency) return;
    const raw = String(input[field] ?? '');
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) {
      setConversionError(null);
      onChange({ ...input, [currencyField]: next });
      return;
    }
    if (!canConvertPair(currentCurrency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertFieldAmount(amount, currentCurrency, next);
    if (converted === null) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({
      ...input,
      [currencyField]: next,
      [field]: moneyAmountToInputString(converted),
    });
  };

  const handleContractChange = (id: FuturesContractId) => {
    const preset = FUTURES_CONTRACT_OPTIONS.find((o) => o.id === id);
    set({
      futuresContract: id,
      ticksPerPoint: String(preset?.ticksPerPoint ?? input.ticksPerPoint),
    });
  };

  const plLabel =
    input.tradingDirection === 'long'
      ? 'Profit / loss for a long position'
      : 'Profit / loss for a short position';

  const accountSymbol = getCurrencySymbol(input.initialDepositCurrency);

  return (
    <div className="space-y-3">
      {ratesStatus.isStale ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Exchange rates are older than 48 hours. Stored rates are still used for conversion.
        </p>
      ) : null}
      {conversionError || errors.form ? (
        <p className="text-xs text-rose-600">{conversionError || errors.form}</p>
      ) : null}

      <Section
        title="Account details"
        open={openAccount}
        onToggle={() => setOpenAccount((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="mc-deposit">
            <span>Initial deposit</span>
            <InfoTooltip
              label="Initial deposit"
              text="Cash balance posted to the futures account before P/L. Used as account equity base for margin-call checks."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialDeposit}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.initialDepositCurrency)}
              </span>
              <input
                id="mc-deposit"
                className={inputClass}
                inputMode="decimal"
                value={input.initialDeposit}
                aria-invalid={Boolean(errors.initialDeposit)}
                onChange={(e) => set({ initialDeposit: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mc-deposit-currency"
              value={input.initialDepositCurrency}
              onChange={(next) =>
                changeMoneyCurrency(
                  'initialDeposit',
                  'initialDepositCurrency',
                  input.initialDepositCurrency,
                  next
                )
              }
              aria-label="Initial deposit currency"
            />
          </div>
          {errors.initialDeposit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-initial-margin">
            <span>Current initial margin per contract</span>
            <InfoTooltip
              label="Initial margin"
              text="Exchange/broker initial margin required to open one contract. Enter the posted requirement — this tool does not invent margin schedules."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialMarginPerContract}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.initialMarginCurrency)}
              </span>
              <input
                id="mc-initial-margin"
                className={inputClass}
                inputMode="decimal"
                value={input.initialMarginPerContract}
                aria-invalid={Boolean(errors.initialMarginPerContract)}
                onChange={(e) => set({ initialMarginPerContract: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mc-initial-margin-currency"
              value={input.initialMarginCurrency}
              onChange={(next) =>
                changeMoneyCurrency(
                  'initialMarginPerContract',
                  'initialMarginCurrency',
                  input.initialMarginCurrency,
                  next
                )
              }
              aria-label="Initial margin currency"
            />
          </div>
          {errors.initialMarginPerContract ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialMarginPerContract}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-maint-margin">
            <span>Current maintenance margin per contract</span>
            <InfoTooltip
              label="Maintenance margin"
              text="Minimum equity per contract to avoid a margin call. Margin call when account equity falls below total maintenance margin."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.maintenanceMarginPerContract}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.maintenanceMarginCurrency)}
              </span>
              <input
                id="mc-maint-margin"
                className={inputClass}
                inputMode="decimal"
                value={input.maintenanceMarginPerContract}
                aria-invalid={Boolean(errors.maintenanceMarginPerContract)}
                onChange={(e) => set({ maintenanceMarginPerContract: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mc-maintenance-margin-currency"
              value={input.maintenanceMarginCurrency}
              onChange={(next) =>
                changeMoneyCurrency(
                  'maintenanceMarginPerContract',
                  'maintenanceMarginCurrency',
                  input.maintenanceMarginCurrency,
                  next
                )
              }
              aria-label="Maintenance margin currency"
            />
          </div>
          {errors.maintenanceMarginPerContract ? (
            <p className="mt-1 text-xs text-rose-600">{errors.maintenanceMarginPerContract}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-contracts">
            <span>Number of futures contracts</span>
          </label>
          <FieldShell error={errors.numberOfContracts}>
            <input
              id="mc-contracts"
              className={inputClass}
              inputMode="numeric"
              value={input.numberOfContracts}
              aria-invalid={Boolean(errors.numberOfContracts)}
              onChange={(e) => set({ numberOfContracts: e.target.value })}
            />
          </FieldShell>
          {errors.numberOfContracts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.numberOfContracts}</p>
          ) : null}
        </div>
      </Section>

      <Section
        title="Contract specification"
        open={openContract}
        onToggle={() => setOpenContract((v) => !v)}
      >
        <div>
          <span className={labelClass}>
            <span>Trading direction?</span>
          </span>
          <div className="flex flex-wrap gap-4 text-sm text-accent">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mc-direction"
                className="h-4 w-4 border-border"
                checked={input.tradingDirection === 'long'}
                onChange={() => set({ tradingDirection: 'long' as TradingDirection })}
              />
              Long position
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mc-direction"
                className="h-4 w-4 border-border"
                checked={input.tradingDirection === 'short'}
                onChange={() => set({ tradingDirection: 'short' as TradingDirection })}
              />
              Short position
            </label>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-contract">
            <span>Select your futures contract</span>
            <InfoTooltip
              label="Futures contract"
              text="Presets only set ticks-per-point from contract tick-size semantics. Tick value and margins stay user-entered — no live market prices."
            />
          </label>
          <select
            id="mc-contract"
            className={selectClass}
            value={input.futuresContract}
            onChange={(e) => handleContractChange(e.target.value as FuturesContractId)}
          >
            {FUTURES_CONTRACT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-tick">
            <span>Tick value</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.tickValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.tickValueCurrency)}
              </span>
              <input
                id="mc-tick"
                className={inputClass}
                inputMode="decimal"
                value={input.tickValue}
                aria-invalid={Boolean(errors.tickValue)}
                onChange={(e) => set({ tickValue: e.target.value })}
              />
            </FieldShell>
            <CurrencySelect
              id="mc-tick-value-currency"
              value={input.tickValueCurrency}
              onChange={(next) =>
                changeMoneyCurrency(
                  'tickValue',
                  'tickValueCurrency',
                  input.tickValueCurrency,
                  next
                )
              }
              aria-label="Tick value currency"
            />
          </div>
          {errors.tickValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.tickValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-ticks">
            <span>Number of ticks per point</span>
          </label>
          <FieldShell error={errors.ticksPerPoint}>
            <input
              id="mc-ticks"
              className={inputClass}
              inputMode="decimal"
              value={input.ticksPerPoint}
              aria-invalid={Boolean(errors.ticksPerPoint)}
              onChange={(e) => set({ ticksPerPoint: e.target.value })}
            />
          </FieldShell>
          {errors.ticksPerPoint ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ticksPerPoint}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-point-value">
            <span>Point value</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.pointValueCurrency)}
              </span>
              <input
                id="mc-point-value"
                className={`${inputClass} text-primary`}
                readOnly
                value={result?.formattedPointValue ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="mc-point-value-currency"
              value={input.pointValueCurrency}
              onChange={(next) => {
                if (next === input.pointValueCurrency) return;
                if (
                  input.tickValueCurrency !== next &&
                  !canConvertPair(input.tickValueCurrency, next)
                ) {
                  setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
                  return;
                }
                setConversionError(null);
                onChange({ ...input, pointValueCurrency: next });
              }}
              aria-label="Point value currency"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Trading"
        open={openTrading}
        onToggle={() => setOpenTrading((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="mc-buy">
            <span>Add your buying contract price</span>
          </label>
          <FieldShell error={errors.buyingPrice}>
            <input
              id="mc-buy"
              className={`${inputClass} pr-16`}
              inputMode="decimal"
              value={input.buyingPrice}
              aria-invalid={Boolean(errors.buyingPrice)}
              onChange={(e) => set({ buyingPrice: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              points
            </span>
          </FieldShell>
          {errors.buyingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buyingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-sell">
            <span>Add your selling contract price</span>
          </label>
          <FieldShell error={errors.sellingPrice}>
            <input
              id="mc-sell"
              className={`${inputClass} pr-16`}
              inputMode="decimal"
              value={input.sellingPrice}
              aria-invalid={Boolean(errors.sellingPrice)}
              onChange={(e) => set({ sellingPrice: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              points
            </span>
          </FieldShell>
          {errors.sellingPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sellingPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-points">
            <span>Number of points</span>
          </label>
          <FieldShell muted>
            <input
              id="mc-points"
              className={`${inputClass} text-primary`}
              readOnly
              value={result?.formattedNumberOfPoints ?? ''}
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="mc-pl">
            <span>{plLabel}</span>
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {getCurrencySymbol(input.profitLossCurrency)}
              </span>
              <input
                id="mc-pl"
                className={`${inputClass} text-primary`}
                readOnly
                value={result?.formattedProfitLoss ?? ''}
                aria-readonly="true"
              />
            </FieldShell>
            <CurrencySelect
              id="mc-profit-loss-currency"
              value={input.profitLossCurrency}
              onChange={(next) => {
                if (next === input.profitLossCurrency) return;
                if (
                  input.initialDepositCurrency !== next &&
                  !canConvertPair(input.initialDepositCurrency, next)
                ) {
                  setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
                  return;
                }
                setConversionError(null);
                onChange({ ...input, profitLossCurrency: next });
              }}
              aria-label="Profit/loss currency"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Total margin amounts"
        open={openMargin}
        onToggle={() => setOpenMargin((v) => !v)}
      >
        {result?.formattedTotalInitialMargin ? (
          <div className="space-y-2 text-sm text-accent">
            <p>
              Total initial margin:{' '}
              <strong className="tabular-nums">
                {accountSymbol}
                {result.formattedTotalInitialMargin}
              </strong>
            </p>
            <p>
              Total maintenance margin (call threshold):{' '}
              <strong className="tabular-nums">
                {accountSymbol}
                {result.formattedTotalMaintenanceMargin}
              </strong>
            </p>
            <p>
              Account equity:{' '}
              <strong className="tabular-nums">
                {accountSymbol}
                {result.formattedAccountEquity}
              </strong>
            </p>
            <p>
              Margin excess / deficit:{' '}
              <strong className="tabular-nums">
                {accountSymbol}
                {result.formattedMarginExcess}
              </strong>
            </p>
            <p>
              Margin call:{' '}
              <strong className={result.isMarginCall ? 'text-rose-600' : 'text-emerald-700'}>
                {result.isMarginCall ? 'Yes — equity below maintenance' : 'No'}
              </strong>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter initial deposit, both margin requirements, and contracts to see totals,
            equity, and margin-call status.
          </p>
        )}
      </Section>
    </div>
  );
}
