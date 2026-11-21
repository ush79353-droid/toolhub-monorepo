'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ExpenseFrequency,
  ExtraExpenseRow,
  PeriodUnit,
  RemoteVsOnLocationFieldErrors,
  RemoteVsOnLocationInput,
  RemoteVsOnLocationResult,
  SideExpenses,
} from './types';
import {
  FREQUENCY_OPTIONS,
  PERIOD_UNIT_OPTIONS,
  createExtraExpenseRow,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Disclosure({
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
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-3.5 py-3">{children}</div> : null}
    </div>
  );
}

interface RemoteVsOnLocationFormProps {
  input: RemoteVsOnLocationInput;
  errors: RemoteVsOnLocationFieldErrors;
  result: RemoteVsOnLocationResult | null;
  onChange: (input: RemoteVsOnLocationInput) => void;
  onCurrencyChange: (currency: RemoteVsOnLocationInput['currency']) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function RemoteVsOnLocationForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
  onClear,
  onReset,
}: RemoteVsOnLocationFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setRemote = (patch: Partial<SideExpenses>) =>
    onChange({ ...input, remote: { ...input.remote, ...patch } });
  const setOnLoc = (patch: Partial<SideExpenses>) =>
    onChange({ ...input, onLocation: { ...input.onLocation, ...patch } });

  const moneyFreq = (
    id: string,
    label: string,
    amount: string,
    frequency: ExpenseFrequency,
    onAmount: (v: string) => void,
    onFreq: (f: ExpenseFrequency) => void,
    error?: string,
    tip?: string,
  ) => (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_8.5rem]">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={amount}
            aria-invalid={Boolean(error)}
            placeholder="0"
            onChange={(e) => onAmount(e.target.value)}
          />
        </FieldShell>
        <select
          className={selectClass}
          value={frequency}
          aria-label={`${label} frequency`}
          onChange={(e) => onFreq(e.target.value as ExpenseFrequency)}
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );

  const extraBlock = (
    side: SideExpenses,
    prefix: 'remote' | 'onLoc',
    setSide: (patch: Partial<SideExpenses>) => void,
  ) => (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-start gap-2 text-sm text-accent">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border"
          checked={side.showAdditional}
          onChange={(e) => {
            const showAdditional = e.target.checked;
            setSide({
              showAdditional,
              additional:
                showAdditional && side.additional.length === 0
                  ? [createExtraExpenseRow()]
                  : side.additional,
            });
          }}
        />
        <span>Show additional cost items</span>
      </label>

      {side.showAdditional ? (
        <div className="space-y-3">
          {side.additional.map((row: ExtraExpenseRow, index: number) => {
            const errorKey = `${prefix}Extra${index}`;
            const error = errors[errorKey];
            return (
              <div
                key={row.id}
                className="space-y-2 rounded-lg border border-border bg-white p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <label className={labelClass} htmlFor={`${prefix}-extra-name-${row.id}`}>
                    Expense name
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={() =>
                      setSide({
                        additional: side.additional.filter((item) => item.id !== row.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <input
                  id={`${prefix}-extra-name-${row.id}`}
                  className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                  value={row.name}
                  placeholder="e.g. Electricity"
                  onChange={(e) =>
                    setSide({
                      additional: side.additional.map((item) =>
                        item.id === row.id ? { ...item, name: e.target.value } : item,
                      ),
                    })
                  }
                />
                {moneyFreq(
                  `${prefix}-extra-amt-${row.id}`,
                  'Amount',
                  row.amount,
                  row.frequency,
                  (amount) =>
                    setSide({
                      additional: side.additional.map((item) =>
                        item.id === row.id ? { ...item, amount } : item,
                      ),
                    }),
                  (frequency) =>
                    setSide({
                      additional: side.additional.map((item) =>
                        item.id === row.id ? { ...item, frequency } : item,
                      ),
                    }),
                  error,
                )}
              </div>
            );
          })}
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() =>
              setSide({ additional: [...side.additional, createExtraExpenseRow()] })
            }
          >
            Add cost item
          </Button>
        </div>
      ) : null}
    </div>
  );

  const maxBar = result
    ? Math.max(result.totalRemoteCost, result.totalOnLocationCost, 1)
    : 1;

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Compare remote allowances (per employee) with on-location office costs (office-level).
        Recurring amounts are normalized to monthly, then multiplied by the comparison period.
        Currency changes formatting only.
      </p>

      <div>
        <label className={labelClass} htmlFor="rw-currency">
          <span>Display currency</span>
        </label>
        <CurrencySelect
          id="rw-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Display currency"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Period of comparison</h3>
        <div>
          <label className={labelClass} htmlFor="rw-period">
            <span>Period of comparison</span>
            <InfoTooltip
              label="Period of comparison"
              text="How long to accumulate recurring costs. One-time costs are counted once. Changing the unit converts the period into months for the engine."
            />
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_8.5rem]">
            <FieldShell error={errors.periodValue}>
              <input
                id="rw-period"
                className={inputClass}
                inputMode="decimal"
                value={input.periodValue}
                aria-invalid={Boolean(errors.periodValue)}
                onChange={(e) => onChange({ ...input, periodValue: e.target.value })}
              />
            </FieldShell>
            <select
              className={selectClass}
              value={input.periodUnit}
              aria-label="Period unit"
              onChange={(e) =>
                onChange({ ...input, periodUnit: e.target.value as PeriodUnit })
              }
            >
              {PERIOD_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errors.periodValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periodValue}</p>
          ) : null}
        </div>
      </div>

      <Disclosure
        title="Remote work allowances per employee"
        open={input.remoteOpen}
        onToggle={() => onChange({ ...input, remoteOpen: !input.remoteOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="rw-remote-emp">
            <span>Number of employees</span>
          </label>
          <FieldShell error={errors.remoteEmployees}>
            <input
              id="rw-remote-emp"
              className={inputClass}
              inputMode="numeric"
              value={input.remoteEmployees}
              aria-invalid={Boolean(errors.remoteEmployees)}
              placeholder="0"
              onChange={(e) => onChange({ ...input, remoteEmployees: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">persons</span>
          </FieldShell>
          {errors.remoteEmployees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.remoteEmployees}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rw-remote-ot">
            <span>One-time allowances</span>
            <InfoTooltip
              label="One-time allowances"
              text="Per-employee setup costs such as laptop or home-office equipment. Multiplied by the remote headcount once."
            />
          </label>
          <FieldShell error={errors.remoteOneTimeAllowance}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rw-remote-ot"
              className={inputClass}
              inputMode="decimal"
              value={input.remoteOneTimeAllowance}
              aria-invalid={Boolean(errors.remoteOneTimeAllowance)}
              placeholder="0"
              onChange={(e) =>
                onChange({ ...input, remoteOneTimeAllowance: e.target.value })
              }
            />
          </FieldShell>
          {errors.remoteOneTimeAllowance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.remoteOneTimeAllowance}</p>
          ) : null}
        </div>

        {moneyFreq(
          'rw-remote-stat',
          'Stationery',
          input.remote.stationery,
          input.remote.stationeryFrequency,
          (stationery) => setRemote({ stationery }),
          (stationeryFrequency) => setRemote({ stationeryFrequency }),
          errors.remoteStationery,
        )}
        {moneyFreq(
          'rw-remote-net',
          'Internet',
          input.remote.internet,
          input.remote.internetFrequency,
          (internet) => setRemote({ internet }),
          (internetFrequency) => setRemote({ internetFrequency }),
          errors.remoteInternet,
        )}
        {moneyFreq(
          'rw-remote-misc',
          'Miscellaneous',
          input.remote.miscellaneous,
          input.remote.miscellaneousFrequency,
          (miscellaneous) => setRemote({ miscellaneous }),
          (miscellaneousFrequency) => setRemote({ miscellaneousFrequency }),
          errors.remoteMiscellaneous,
        )}
        {extraBlock(input.remote, 'remote', setRemote)}
        {moneyFreq(
          'rw-remote-rec',
          'Recurring expenses',
          input.remote.recurring,
          input.remote.recurringFrequency,
          (recurring) => setRemote({ recurring }),
          (recurringFrequency) => setRemote({ recurringFrequency }),
          errors.remoteRecurring,
          'Additional per-employee recurring costs. Avoid entering the same expense twice.',
        )}
      </Disclosure>

      <Disclosure
        title="On-location work costs"
        open={input.onLocationOpen}
        onToggle={() => onChange({ ...input, onLocationOpen: !input.onLocationOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="rw-ol-emp">
            <span>Number of employees</span>
          </label>
          <FieldShell error={errors.onLocationEmployees}>
            <input
              id="rw-ol-emp"
              className={inputClass}
              inputMode="numeric"
              value={input.onLocationEmployees}
              aria-invalid={Boolean(errors.onLocationEmployees)}
              placeholder="0"
              onChange={(e) => onChange({ ...input, onLocationEmployees: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">persons</span>
          </FieldShell>
          {errors.onLocationEmployees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.onLocationEmployees}</p>
          ) : null}
        </div>

        <fieldset className="space-y-2">
          <legend className={labelClass}>Office space</legend>
          <div className="flex flex-wrap gap-3">
            {(['lease', 'own'] as const).map((type) => (
              <label
                key={type}
                className="inline-flex items-center gap-2 text-sm text-foreground/90"
              >
                <input
                  type="radio"
                  name="office-space"
                  checked={input.officeSpaceType === type}
                  onChange={() => onChange({ ...input, officeSpaceType: type })}
                />
                <span>{type === 'lease' ? 'Lease' : 'Own'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="rw-ol-ot">
            <span>Total one-time expenses</span>
            <InfoTooltip
              label="Total one-time expenses"
              text="Office-level setup costs (furniture, renovation, infrastructure). Not multiplied by headcount."
            />
          </label>
          <FieldShell error={errors.onLocationOneTime}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="rw-ol-ot"
              className={inputClass}
              inputMode="decimal"
              value={input.onLocationOneTime}
              aria-invalid={Boolean(errors.onLocationOneTime)}
              placeholder="0"
              onChange={(e) => onChange({ ...input, onLocationOneTime: e.target.value })}
            />
          </FieldShell>
          {errors.onLocationOneTime ? (
            <p className="mt-1 text-xs text-rose-600">{errors.onLocationOneTime}</p>
          ) : null}
        </div>

        {input.officeSpaceType === 'lease'
          ? moneyFreq(
              'rw-ol-lease',
              'Office lease',
              input.officeLease,
              input.officeLeaseFrequency,
              (officeLease) => onChange({ ...input, officeLease }),
              (officeLeaseFrequency) => onChange({ ...input, officeLeaseFrequency }),
              errors.officeLease,
              'Office-level lease. Excluded automatically when Own is selected.',
            )
          : (
            <p className="text-xs text-muted-foreground">
              Office lease is excluded because the workplace is owned. Other operating costs can
              still be entered below.
            </p>
          )}

        {moneyFreq(
          'rw-ol-stat',
          'Stationery',
          input.onLocation.stationery,
          input.onLocation.stationeryFrequency,
          (stationery) => setOnLoc({ stationery }),
          (stationeryFrequency) => setOnLoc({ stationeryFrequency }),
          errors.onLocStationery,
        )}
        {moneyFreq(
          'rw-ol-net',
          'Internet',
          input.onLocation.internet,
          input.onLocation.internetFrequency,
          (internet) => setOnLoc({ internet }),
          (internetFrequency) => setOnLoc({ internetFrequency }),
          errors.onLocInternet,
        )}
        {moneyFreq(
          'rw-ol-misc',
          'Miscellaneous',
          input.onLocation.miscellaneous,
          input.onLocation.miscellaneousFrequency,
          (miscellaneous) => setOnLoc({ miscellaneous }),
          (miscellaneousFrequency) => setOnLoc({ miscellaneousFrequency }),
          errors.onLocMiscellaneous,
        )}
        {extraBlock(input.onLocation, 'onLoc', setOnLoc)}
        {moneyFreq(
          'rw-ol-rec',
          'Recurring expenses',
          input.onLocation.recurring,
          input.onLocation.recurringFrequency,
          (recurring) => setOnLoc({ recurring }),
          (recurringFrequency) => setOnLoc({ recurringFrequency }),
          errors.onLocRecurring,
          'Additional office-level recurring costs. Avoid double-counting lease or other fields.',
        )}
      </Disclosure>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Cost comparison</h3>
        {result ? (
          <>
            <div className="rounded-lg border border-border bg-white px-3 py-3">
              <p className="text-xs text-muted-foreground">{result.periodLabel}</p>
              <p className="mt-2 text-sm font-semibold text-accent">{result.interpretation}</p>
            </div>

            <div className="space-y-2" aria-label="Total cost comparison">
              {(
                [
                  ['Remote total', result.totalRemoteCost, result.formattedTotalRemoteCost],
                  [
                    'On-location total',
                    result.totalOnLocationCost,
                    result.formattedTotalOnLocationCost,
                  ],
                ] as const
              ).map(([label, value, formatted]) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                    <span>{label}</span>
                    <span className="tabular-nums text-accent">
                      {symbol}
                      {formatted}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded bg-muted">
                    <div
                      className="h-full rounded bg-accent/80"
                      style={{ width: `${(value / maxBar) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>
                Remote one-time: {symbol}
                {result.formattedRemoteOneTimeCost}
              </li>
              <li>
                Remote recurring: {symbol}
                {result.formattedRemoteRecurringCost}
              </li>
              <li>
                Remote per employee: {symbol}
                {result.formattedRemoteCostPerEmployee}
              </li>
              <li>
                On-location one-time: {symbol}
                {result.formattedOnLocationOneTimeCost}
              </li>
              <li>
                On-location recurring: {symbol}
                {result.formattedOnLocationRecurringCost}
              </li>
              <li>
                On-location per employee: {symbol}
                {result.formattedOnLocationCostPerEmployee}
              </li>
              <li>
                Absolute cost difference: {symbol}
                {result.formattedCostDifference}
              </li>
              {result.remoteSavingsPercentage !== null ? (
                <li>Remote vs on-location savings: {result.formattedRemoteSavingsPercentage}%</li>
              ) : null}
              {result.onLocationSavingsPercentage !== null ? (
                <li>
                  On-location vs remote savings: {result.formattedOnLocationSavingsPercentage}%
                </li>
              ) : null}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Salaries and benefits are not included unless you add them as custom expenses on both
              sides. Totals are workplace/allowance costs for the selected period.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {errors.form ?? 'Enter a valid comparison period and expense inputs to compare costs.'}
          </p>
        )}
      </div>

      {errors.form && !result ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
 Example: 12 months
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
