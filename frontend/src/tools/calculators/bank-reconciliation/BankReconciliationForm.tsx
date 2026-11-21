'use client';

import type { ReactNode } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import {
  createAdjustment,
  type AdjustmentDirection,
  type BankReconciliationFieldErrors,
  type BankReconciliationInput,
  type BankReconciliationResult,
  type ReconciliationAdjustment,
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

function MoneyField({
  id,
  label,
  tip,
  symbol,
  value,
  error,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className={labelClass}>
        <label htmlFor={id}>{label}</label>
        <InfoTooltip label={label} text={tip} align="left" />
      </div>
      <FieldShell error={error}>
        <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
        <input
          id={id}
          className={inputClass}
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ExtraRows({
  prefix,
  rows,
  symbol,
  errors,
  onChange,
}: {
  prefix: string;
  rows: ReconciliationAdjustment[];
  symbol: string;
  errors: BankReconciliationFieldErrors;
  onChange: (rows: ReconciliationAdjustment[]) => void;
}) {
  const update = (id: string, patch: Partial<ReconciliationAdjustment>) => {
    onChange(rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-accent">Additional adjustments</p>
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid gap-2 rounded-lg border border-border bg-white p-2.5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_110px_auto]"
        >
          <div>
            <input
              className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Description"
              value={row.description}
              aria-invalid={Boolean(errors[`${prefix}-${row.id}-description`])}
              onChange={(event) => update(row.id, { description: event.target.value })}
            />
            {errors[`${prefix}-${row.id}-description`] ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors[`${prefix}-${row.id}-description`]}
              </p>
            ) : null}
          </div>
          <div>
            <FieldShell error={errors[`${prefix}-${row.id}-amount`]}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                className={inputClass}
                inputMode="decimal"
                placeholder="Amount"
                value={row.amount}
                aria-invalid={Boolean(errors[`${prefix}-${row.id}-amount`])}
                onChange={(event) => update(row.id, { amount: event.target.value })}
              />
            </FieldShell>
            {errors[`${prefix}-${row.id}-amount`] ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors[`${prefix}-${row.id}-amount`]}
              </p>
            ) : null}
          </div>
          <select
            className={selectClass}
            value={row.direction}
            aria-label="Adjustment direction"
            onChange={(event) =>
              update(row.id, {
                direction: event.target.value as AdjustmentDirection,
              })
            }
          >
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11"
            aria-label="Remove adjustment"
            disabled={rows.length <= 1}
            onClick={() => onChange(rows.filter((item) => item.id !== row.id))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        className="h-9 gap-1.5 px-2 text-xs"
        onClick={() => onChange([...rows, createAdjustment()])}
      >
        <Plus className="h-3.5 w-3.5" />
        Add adjustment
      </Button>
    </div>
  );
}

interface BankReconciliationFormProps {
  input: BankReconciliationInput;
  errors: BankReconciliationFieldErrors;
  result: BankReconciliationResult | null;
  onChange: (next: BankReconciliationInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function BankReconciliationForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: BankReconciliationFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BankReconciliationInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Use balances and transactions from the same reconciliation period. Amounts are positive;
          choose Add or Subtract for extra rows.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="recon-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="recon-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.cashbookOpen}
        onToggle={(event) => set({ cashbookOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.cashbookOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Adjustments to cashbook</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Record bank activity not yet entered in the cashbook (charges, NSF, auto-payments,
            interest, and other corrections).
          </p>
          <MoneyField
            id="cashbook-balance"
            label="Cashbook balance"
            tip="Enter the closing cashbook balance before applying reconciliation adjustments."
            symbol={symbol}
            value={input.cashbookBalance}
            error={errors.cashbookBalance}
            placeholder="Enter cashbook balance"
            onChange={(value) => set({ cashbookBalance: value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <MoneyField
              id="bank-charges"
              label="Bank charges"
              tip="Unrecorded bank fees; subtracted from the cashbook."
              symbol={symbol}
              value={input.bankCharges}
              error={errors.bankCharges}
              onChange={(value) => set({ bankCharges: value })}
            />
            <MoneyField
              id="nsf-checks"
              label="NSF / returned checks"
              tip="Returned deposited checks; subtracted from the cashbook."
              symbol={symbol}
              value={input.nsfChecks}
              error={errors.nsfChecks}
              onChange={(value) => set({ nsfChecks: value })}
            />
            <MoneyField
              id="auto-payments"
              label="Automatic payments"
              tip="Unrecorded direct debits; subtracted from the cashbook."
              symbol={symbol}
              value={input.automaticPayments}
              error={errors.automaticPayments}
              onChange={(value) => set({ automaticPayments: value })}
            />
            <MoneyField
              id="interest-earned"
              label="Interest earned"
              tip="Unrecorded bank interest; added to the cashbook."
              symbol={symbol}
              value={input.interestEarned}
              error={errors.interestEarned}
              onChange={(value) => set({ interestEarned: value })}
            />
          </div>
          <ExtraRows
            prefix="cash"
            rows={input.cashbookExtra}
            symbol={symbol}
            errors={errors}
            onChange={(cashbookExtra) => set({ cashbookExtra })}
          />
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.bankOpen}
        onToggle={(event) => set({ bankOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.bankOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Adjustments to bank statement</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Adjust for cashbook items not yet on the statement (deposits in transit, outstanding
            checks, and bank errors).
          </p>
          <MoneyField
            id="bank-balance"
            label="Bank statement balance"
            tip="Enter the ending balance shown on your bank statement for the selected reconciliation period."
            symbol={symbol}
            value={input.bankStatementBalance}
            error={errors.bankStatementBalance}
            placeholder="Enter bank statement balance"
            onChange={(value) => set({ bankStatementBalance: value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <MoneyField
              id="deposits-in-transit"
              label="Deposits in transit"
              tip="Deposits in the cashbook not yet on the statement; added to the bank balance."
              symbol={symbol}
              value={input.depositsInTransit}
              error={errors.depositsInTransit}
              onChange={(value) => set({ depositsInTransit: value })}
            />
            <MoneyField
              id="outstanding-checks"
              label="Outstanding checks"
              tip="Checks issued but not yet cleared; subtracted from the bank balance."
              symbol={symbol}
              value={input.outstandingChecks}
              error={errors.outstandingChecks}
              onChange={(value) => set({ outstandingChecks: value })}
            />
          </div>
          <ExtraRows
            prefix="bank"
            rows={input.bankExtra}
            symbol={symbol}
            errors={errors}
            onChange={(bankExtra) => set({ bankExtra })}
          />
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="recon-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="recon-results-heading" className="text-sm font-semibold text-accent">
              Bank reconciliation results
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                result.status === 'reconciled'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {result.status === 'reconciled'
                ? 'Reconciled successfully'
                : 'Unreconciled'}
            </span>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Initial cashbook</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.cashbookBalance, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Adjusted cashbook</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.adjustedCashbookBalance, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Initial bank statement</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.bankStatementBalance, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Adjusted bank statement</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.adjustedBankStatementBalance, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Reconciliation difference</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.unreconciledAmount, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Cashbook add / deduct</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalCashbookAdditions, result.currency)} /{' '}
                {formatMoney(result.totalCashbookDeductions, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Bank add / deduct</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalBankAdditions, result.currency)} /{' '}
                {formatMoney(result.totalBankDeductions, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Adjustment counts</dt>
              <dd className="font-medium tabular-nums text-accent">
                Cashbook {result.cashbookAdjustmentCount} · Bank {result.bankAdjustmentCount}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">
            {result.isReconciled
              ? 'Both adjusted balances match for the entered figures. Confirm source records are complete and accurate.'
              : 'Adjusted balances differ. Review timing items, bank fees, and recording errors before finalizing.'}
          </p>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter both starting balances and adjustments, then Calculate to reconcile.
        </p>
      )}
    </form>
  );
}
