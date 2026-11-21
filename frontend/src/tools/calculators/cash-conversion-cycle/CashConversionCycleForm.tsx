'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageBalance,
  formatCccMoney,
} from './calculation';
import type {
  AverageBalanceMode,
  CashConversionCycleFieldErrors,
  CashConversionCycleInput,
  CashConversionCycleResult,
  PeriodUnit,
} from './types';

function parseNonneg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

function displayCalculatedAverage(
  beginning: string,
  ending: string,
  currency: CashConversionCycleInput['currency'],
  formattedFromResult: string | undefined
): string {
  if (formattedFromResult) return formattedFromResult;
  const beg = parseNonneg(beginning);
  const end = parseNonneg(ending);
  if (beg === null || end === null) return '';
  const avg = calculateAverageBalance(beg, end);
  return avg === null ? '' : formatCccMoney(avg, currency);
}

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

function CollapsibleSection({
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
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function ModeRadios({
  name,
  value,
  onChange,
}: {
  name: string;
  value: AverageBalanceMode;
  onChange: (mode: AverageBalanceMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4" role="radiogroup">
      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={name}
          className="h-4 w-4 accent-primary"
          checked={value === 'manual'}
          onChange={() => onChange('manual')}
        />
        Enter average
      </label>
      <label className="flex items-center gap-2 text-sm text-accent">
        <input
          type="radio"
          name={name}
          className="h-4 w-4 accent-primary"
          checked={value === 'calculated'}
          onChange={() => onChange('calculated')}
        />
        From beginning &amp; ending
      </label>
    </div>
  );
}

interface CashConversionCycleFormProps {
  input: CashConversionCycleInput;
  errors: CashConversionCycleFieldErrors;
  result: CashConversionCycleResult | null;
  onChange: (input: CashConversionCycleInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function CashConversionCycleForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: CashConversionCycleFormProps) {
  const [invOpen, setInvOpen] = useState(false);
  const [arOpen, setArOpen] = useState(false);
  const [apOpen, setApOpen] = useState(false);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<CashConversionCycleInput>) => {
    onChange({ ...input, ...patch });
  };

  const invCalc = input.inventoryMode === 'calculated';
  const arCalc = input.receivablesMode === 'calculated';
  const apCalc = input.payablesMode === 'calculated';

  const invDisplay = invCalc
    ? displayCalculatedAverage(
        input.beginningInventory,
        input.endingInventory,
        input.currency,
        result?.formattedAverageInventory
      )
    : input.averageInventory;
  const arDisplay = arCalc
    ? displayCalculatedAverage(
        input.beginningAccountsReceivable,
        input.endingAccountsReceivable,
        input.currency,
        result?.formattedAverageAccountsReceivable
      )
    : input.averageAccountsReceivable;
  const apDisplay = apCalc
    ? displayCalculatedAverage(
        input.beginningAccountsPayable,
        input.endingAccountsPayable,
        input.currency,
        result?.formattedAverageAccountsPayable
      )
    : input.averageAccountsPayable;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. DSO uses total
          revenue (simplified); DIO/DPO use COGS. CCC = DIO + DSO − DPO.
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="ccc-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <div>
        <label htmlFor="ccc-period" className={labelClass}>
          <span>Period of analysis</span>
          <InfoTooltip
            label="Period of analysis"
            text="Reporting period used for revenue, COGS, and balance averages. Default 365 days. Months use 365÷12 days as a disclosed convention."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.period}>
            <input
              id="ccc-period"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.period}
              aria-invalid={errors.period ? true : undefined}
              onChange={(e) => set({ period: e.target.value })}
            />
          </FieldShell>
          <select
            id="ccc-period-unit"
            className="h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.periodUnit}
            aria-label="Period unit"
            onChange={(e) =>
              set({ periodUnit: e.target.value as PeriodUnit })
            }
          >
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
        {errors.period ? (
          <p className="mt-1 text-xs text-rose-600">{errors.period}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-revenue" className={labelClass}>
          <span>Total revenue</span>
          <InfoTooltip
            label="Total revenue"
            text="Sales revenue for the period. Used as the DSO denominator. Net credit sales are more precise when available; this calculator uses total revenue as a simplified default."
          />
        </label>
        <FieldShell error={errors.totalRevenue}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ccc-revenue"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.totalRevenue}
            aria-invalid={errors.totalRevenue ? true : undefined}
            onChange={(e) => set({ totalRevenue: e.target.value })}
          />
        </FieldShell>
        {errors.totalRevenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.totalRevenue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-cogs" className={labelClass}>
          <span>Cost of goods sold</span>
          <InfoTooltip
            label="Cost of goods sold"
            text="COGS for the same period. Used for DIO and, by default, for DPO. Purchases may be more representative for DPO when they differ materially from COGS."
          />
        </label>
        <FieldShell error={errors.costOfGoodsSold}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ccc-cogs"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.costOfGoodsSold}
            aria-invalid={errors.costOfGoodsSold ? true : undefined}
            onChange={(e) => set({ costOfGoodsSold: e.target.value })}
          />
        </FieldShell>
        {errors.costOfGoodsSold ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfGoodsSold}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-avg-inv" className={labelClass}>
          <span>Average inventory</span>
          <InfoTooltip
            label="Average inventory"
            text="Average inventory for the period. Enter directly or calculate from beginning and ending balances below."
          />
        </label>
        <FieldShell error={errors.averageInventory} muted={invCalc}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ccc-avg-inv"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={invCalc}
            tabIndex={invCalc ? -1 : undefined}
            value={invDisplay}
            aria-invalid={errors.averageInventory ? true : undefined}
            aria-live={invCalc ? 'polite' : undefined}
            onChange={(e) => set({ averageInventory: e.target.value })}
          />
        </FieldShell>
        {errors.averageInventory ? (
          <p className="mt-1 text-xs text-rose-600">{errors.averageInventory}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-avg-ar" className={labelClass}>
          <span>Average accounts receivable</span>
          <InfoTooltip
            label="Average accounts receivable"
            text="Average AR for the period. Enter directly or calculate from beginning and ending balances below."
          />
        </label>
        <FieldShell error={errors.averageAccountsReceivable} muted={arCalc}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ccc-avg-ar"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={arCalc}
            tabIndex={arCalc ? -1 : undefined}
            value={arDisplay}
            aria-invalid={
              errors.averageAccountsReceivable ? true : undefined
            }
            aria-live={arCalc ? 'polite' : undefined}
            onChange={(e) =>
              set({ averageAccountsReceivable: e.target.value })
            }
          />
        </FieldShell>
        {errors.averageAccountsReceivable ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.averageAccountsReceivable}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-avg-ap" className={labelClass}>
          <span>Average accounts payable</span>
          <InfoTooltip
            label="Average accounts payable"
            text="Average AP for the period. Enter directly or calculate from beginning and ending balances below."
          />
        </label>
        <FieldShell error={errors.averageAccountsPayable} muted={apCalc}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ccc-avg-ap"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={apCalc}
            tabIndex={apCalc ? -1 : undefined}
            value={apDisplay}
            aria-invalid={errors.averageAccountsPayable ? true : undefined}
            aria-live={apCalc ? 'polite' : undefined}
            onChange={(e) => set({ averageAccountsPayable: e.target.value })}
          />
        </FieldShell>
        {errors.averageAccountsPayable ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.averageAccountsPayable}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ccc-dso" className={labelClass}>
          <span>Accounts receivable days</span>
          <InfoTooltip
            label="Accounts receivable days"
            text="Days sales outstanding (DSO) = Average AR ÷ Revenue × period days."
          />
        </label>
        <FieldShell muted>
          <input
            id="ccc-dso"
            type="text"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedAccountsReceivableDays ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-xs text-muted-foreground">days</span>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="ccc-dio" className={labelClass}>
          <span>Inventory days</span>
          <InfoTooltip
            label="Inventory days"
            text="Days inventory outstanding (DIO) = Average inventory ÷ COGS × period days."
          />
        </label>
        <FieldShell muted>
          <input
            id="ccc-dio"
            type="text"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedInventoryDays ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-xs text-muted-foreground">days</span>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="ccc-dpo" className={labelClass}>
          <span>Accounts payable days</span>
          <InfoTooltip
            label="Accounts payable days"
            text="Days payable outstanding (DPO) = Average AP ÷ COGS × period days (COGS-based default)."
          />
        </label>
        <FieldShell muted>
          <input
            id="ccc-dpo"
            type="text"
            className={inputClass}
            readOnly
            tabIndex={-1}
            value={result?.formattedAccountsPayableDays ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-xs text-muted-foreground">days</span>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="ccc-ccc" className={labelClass}>
          <span>Cash conversion cycle</span>
          <InfoTooltip
            label="Cash conversion cycle"
            text="CCC = DIO + DSO − DPO. Negative values are valid under some business models."
          />
        </label>
        <FieldShell muted>
          <input
            id="ccc-ccc"
            type="text"
            className={`${inputClass} font-semibold`}
            readOnly
            tabIndex={-1}
            value={result?.formattedCashConversionCycle ?? ''}
            aria-live="polite"
          />
          <span className="pr-3 text-xs text-muted-foreground">days</span>
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-amber-700" role="status">
          {errors.form}
        </p>
      ) : null}

      <CollapsibleSection
        title="Calculate the average of inventories"
        open={invOpen}
        onToggle={() => setInvOpen((o) => !o)}
      >
        <ModeRadios
          name="ccc-inv-mode"
          value={input.inventoryMode}
          onChange={(inventoryMode) => set({ inventoryMode })}
        />
        {invCalc ? (
          <>
            <div>
              <label htmlFor="ccc-beg-inv" className={labelClass}>
                Beginning inventory
              </label>
              <FieldShell error={errors.beginningInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-beg-inv"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningInventory}
                  aria-invalid={errors.beginningInventory ? true : undefined}
                  onChange={(e) => set({ beginningInventory: e.target.value })}
                />
              </FieldShell>
              {errors.beginningInventory ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.beginningInventory}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-end-inv" className={labelClass}>
                Ending inventory
              </label>
              <FieldShell error={errors.endingInventory}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-end-inv"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingInventory}
                  aria-invalid={errors.endingInventory ? true : undefined}
                  onChange={(e) => set({ endingInventory: e.target.value })}
                />
              </FieldShell>
              {errors.endingInventory ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.endingInventory}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-calc-avg-inv" className={labelClass}>
                Average inventory
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-calc-avg-inv"
                  type="text"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={invDisplay}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Switch to “From beginning &amp; ending” to derive average inventory.
            Manual average on the main form is used until then.
          </p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Calculate the average of accounts receivable"
        open={arOpen}
        onToggle={() => setArOpen((o) => !o)}
      >
        <ModeRadios
          name="ccc-ar-mode"
          value={input.receivablesMode}
          onChange={(receivablesMode) => set({ receivablesMode })}
        />
        {arCalc ? (
          <>
            <div>
              <label htmlFor="ccc-beg-ar" className={labelClass}>
                Beginning accounts receivable
              </label>
              <FieldShell error={errors.beginningAccountsReceivable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-beg-ar"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningAccountsReceivable}
                  aria-invalid={
                    errors.beginningAccountsReceivable ? true : undefined
                  }
                  onChange={(e) =>
                    set({ beginningAccountsReceivable: e.target.value })
                  }
                />
              </FieldShell>
              {errors.beginningAccountsReceivable ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.beginningAccountsReceivable}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-end-ar" className={labelClass}>
                Ending accounts receivable
              </label>
              <FieldShell error={errors.endingAccountsReceivable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-end-ar"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingAccountsReceivable}
                  aria-invalid={
                    errors.endingAccountsReceivable ? true : undefined
                  }
                  onChange={(e) =>
                    set({ endingAccountsReceivable: e.target.value })
                  }
                />
              </FieldShell>
              {errors.endingAccountsReceivable ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.endingAccountsReceivable}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-calc-avg-ar" className={labelClass}>
                Average accounts receivable
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-calc-avg-ar"
                  type="text"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={arDisplay}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Switch to “From beginning &amp; ending” to derive average AR. Manual
            average on the main form is used until then.
          </p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Calculate the average of accounts payable"
        open={apOpen}
        onToggle={() => setApOpen((o) => !o)}
      >
        <ModeRadios
          name="ccc-ap-mode"
          value={input.payablesMode}
          onChange={(payablesMode) => set({ payablesMode })}
        />
        {apCalc ? (
          <>
            <div>
              <label htmlFor="ccc-beg-ap" className={labelClass}>
                Beginning accounts payable
              </label>
              <FieldShell error={errors.beginningAccountsPayable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-beg-ap"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningAccountsPayable}
                  aria-invalid={
                    errors.beginningAccountsPayable ? true : undefined
                  }
                  onChange={(e) =>
                    set({ beginningAccountsPayable: e.target.value })
                  }
                />
              </FieldShell>
              {errors.beginningAccountsPayable ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.beginningAccountsPayable}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-end-ap" className={labelClass}>
                Ending accounts payable
              </label>
              <FieldShell error={errors.endingAccountsPayable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-end-ap"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingAccountsPayable}
                  aria-invalid={
                    errors.endingAccountsPayable ? true : undefined
                  }
                  onChange={(e) =>
                    set({ endingAccountsPayable: e.target.value })
                  }
                />
              </FieldShell>
              {errors.endingAccountsPayable ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.endingAccountsPayable}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ccc-calc-avg-ap" className={labelClass}>
                Average accounts payable
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="ccc-calc-avg-ap"
                  type="text"
                  className={inputClass}
                  readOnly
                  tabIndex={-1}
                  value={apDisplay}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            Switch to “From beginning &amp; ending” to derive average AP. Manual
            average on the main form is used until then.
          </p>
        )}
      </CollapsibleSection>
    </form>
  );
}
