'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CashBackFieldErrors,
  CashBackInput,
  CashBackResult,
  CashBackRewardKind,
  CashBackSolveTarget,
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

const SOLVE_LABELS: Record<CashBackSolveTarget, string> = {
  cashBack: 'Cash back earned',
  breakEvenSpend: 'Spend to reach cashback limit',
  requiredRate: 'Cash back earned',
};

interface CashBackFormProps {
  input: CashBackInput;
  errors: CashBackFieldErrors;
  result: CashBackResult | null;
  onChange: (input: CashBackInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CashBackForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CashBackFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CashBackInput>) =>
    onChange({ ...input, ...patch });
  const breakEven = input.solveTarget === 'breakEvenSpend';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Cashback = purchase × rate. Optional caps use Actual = min(calculated,
        limit). Currency is denomination only (not FX). Eligibility and
        redemption depend on your card or retailer terms.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="cb-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="cb-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="cb-solve"
          className={selectClass}
          value={input.solveTarget === 'requiredRate' ? 'cashBack' : input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as CashBackSolveTarget,
              hasCashbackLimit:
                e.target.value === 'breakEvenSpend'
                  ? true
                  : input.hasCashbackLimit,
            })
          }
        >
          <option value="cashBack">{SOLVE_LABELS.cashBack}</option>
          <option value="breakEvenSpend">{SOLVE_LABELS.breakEvenSpend}</option>
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($500 · 5% → $25 cashback)
      </button>

      {breakEven ? (
        <>
          <div>
            <label htmlFor="cb-limit-be" className={labelClass}>
              Cash Back Limit
              <InfoTooltip
                label="Cash Back Limit"
                text="The maximum cashback amount allowed under the applicable reward offer or program."
              />
            </label>
            <FieldShell error={errors.cashbackLimit}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cb-limit-be"
                className={inputClass}
                inputMode="decimal"
                value={input.cashbackLimit}
                onChange={(e) => set({ cashbackLimit: e.target.value })}
                placeholder="50"
              />
            </FieldShell>
            {errors.cashbackLimit ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cashbackLimit}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cb-rate-be" className={labelClass}>
              Percentage Cash Back
            </label>
            <FieldShell error={errors.breakEvenRate}>
              <input
                id="cb-rate-be"
                className={inputClass}
                inputMode="decimal"
                value={input.breakEvenRate}
                onChange={(e) => set({ breakEvenRate: e.target.value })}
                placeholder="5"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.breakEvenRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.breakEvenRate}</p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={input.hasCashbackLimit}
              onChange={(e) =>
                set({
                  hasCashbackLimit: e.target.checked,
                  cashbackLimit: e.target.checked ? input.cashbackLimit : '',
                })
              }
            />
            I have a cash back limit
          </label>

          {input.hasCashbackLimit ? (
            <div>
              <label htmlFor="cb-limit" className={labelClass}>
                Cash Back Limit
                <InfoTooltip
                  label="Cash Back Limit"
                  text="The maximum cashback amount allowed under the applicable reward offer or program."
                />
              </label>
              <FieldShell error={errors.cashbackLimit}>
                <span className="pl-3 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="cb-limit"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cashbackLimit}
                  onChange={(e) => set({ cashbackLimit: e.target.value })}
                  placeholder="50"
                />
              </FieldShell>
              {errors.cashbackLimit ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.cashbackLimit}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <label htmlFor="cb-purchase" className={labelClass}>
              Amount Purchased
              <InfoTooltip
                label="Amount Purchased"
                text="The eligible amount spent on a purchase before applying the cashback reward."
              />
            </label>
            <FieldShell error={errors.purchaseAmount}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cb-purchase"
                className={inputClass}
                inputMode="decimal"
                value={input.purchaseAmount}
                onChange={(e) => set({ purchaseAmount: e.target.value })}
                placeholder="500"
              />
            </FieldShell>
            {errors.purchaseAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.purchaseAmount}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="cb-kind" className={labelClass}>
              Reward type
            </label>
            <select
              id="cb-kind"
              className={selectClass}
              value={input.rewardKind}
              onChange={(e) =>
                set({ rewardKind: e.target.value as CashBackRewardKind })
              }
            >
              <option value="percentage">Percentage cashback</option>
              <option value="fixed">Fixed cashback</option>
            </select>
          </div>

          {input.rewardKind === 'percentage' ? (
            <div>
              <label htmlFor="cb-rate" className={labelClass}>
                Percentage Cash Back
                <InfoTooltip
                  label="Percentage Cash Back"
                  text="The percentage of eligible purchase spending returned to the customer as cashback."
                />
              </label>
              <FieldShell error={errors.cashbackPercentage}>
                <input
                  id="cb-rate"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.cashbackPercentage}
                  onChange={(e) =>
                    set({ cashbackPercentage: e.target.value })
                  }
                  placeholder="5"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.cashbackPercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.cashbackPercentage}
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label htmlFor="cb-fixed" className={labelClass}>
                Fixed cashback
              </label>
              <FieldShell error={errors.fixedCashback}>
                <span className="pl-3 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="cb-fixed"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.fixedCashback}
                  onChange={(e) => set({ fixedCashback: e.target.value })}
                  placeholder="15"
                />
              </FieldShell>
              {errors.fixedCashback ? (
                <p className="mt-1 text-xs text-rose-600">{errors.fixedCashback}</p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="cb-out" className={labelClass}>
              Cash Back
              <InfoTooltip
                label="Cash Back"
                text="Calculated cashback after applying any enabled reward limit."
              />
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cb-out"
                className={inputClass}
                readOnly
                aria-readonly
                value={
                  result
                    ? result.actualCashback.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : ''
                }
                placeholder="—"
              />
            </FieldShell>
          </div>
        </>
      )}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
