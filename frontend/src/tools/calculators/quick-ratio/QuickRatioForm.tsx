'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  QuickRatioFieldErrors,
  QuickRatioInput,
  QuickRatioMethod,
  QuickRatioResult,
  QuickRatioSolveTarget,
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

const SOLVE_LABELS: Record<QuickRatioSolveTarget, string> = {
  quickRatio: 'Quick ratio',
  requiredQuickAssets: 'Required quick assets',
  currentLiabilities: 'Current liabilities',
  requiredCash: 'Required cash',
};

interface QuickRatioFormProps {
  input: QuickRatioInput;
  errors: QuickRatioFieldErrors;
  result: QuickRatioResult | null;
  onChange: (input: QuickRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function QuickRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: QuickRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<QuickRatioInput>) =>
    onChange({ ...input, ...patch });
  const solving = input.solveTarget;
  const direct = input.method === 'direct';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Acid-test (quick) ratio = quick assets ÷ current liabilities. Direct
        method uses cash + marketable securities + net receivables. Inventory
        and prepaid expenses are excluded. Currency is denomination only (not
        FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="qr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="qr-method" className={labelClass}>
          Calculation Method
        </label>
        <select
          id="qr-method"
          className={selectClass}
          value={input.method}
          onChange={(e) =>
            set({ method: e.target.value as QuickRatioMethod })
          }
        >
          <option value="direct">Direct Quick Assets</option>
          <option value="adjusted">Current Assets Adjustment</option>
        </select>
      </div>

      <div>
        <label htmlFor="qr-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="qr-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({
              solveTarget: e.target.value as QuickRatioSolveTarget,
            })
          }
        >
          {(Object.keys(SOLVE_LABELS) as QuickRatioSolveTarget[]).map((t) => (
            <option key={t} value={t} disabled={t === 'requiredCash' && !direct}>
              {SOLVE_LABELS[t]}
              {t === 'requiredCash' && !direct ? ' (direct method only)' : ''}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (PKR 150k+50k+100k / 200k → 1.50x)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      {solving !== 'quickRatio' ? (
        <div>
          <label htmlFor="qr-target" className={labelClass}>
            Target Quick Ratio
          </label>
          <FieldShell error={errors.targetQuickRatio}>
            <input
              id="qr-target"
              className={inputClass}
              inputMode="decimal"
              value={input.targetQuickRatio}
              onChange={(e) => set({ targetQuickRatio: e.target.value })}
              placeholder="1.50"
            />
            <span className="pr-3 text-sm text-muted-foreground">x</span>
          </FieldShell>
          {errors.targetQuickRatio ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.targetQuickRatio}
            </p>
          ) : null}
        </div>
      ) : null}

      {direct &&
      (solving === 'quickRatio' ||
        solving === 'currentLiabilities' ||
        solving === 'requiredCash') ? (
        <>
          {solving !== 'requiredCash' ? (
            <div>
              <label htmlFor="qr-cash" className={labelClass}>
                Cash and Cash Equivalents
                <InfoTooltip
                  label="Cash and Cash Equivalents"
                  text="Cash, bank balances, and highly liquid short-term investments readily convertible into known amounts of cash with insignificant risk of changes in value."
                />
              </label>
              <FieldShell
                error={errors.cashAndCashEquivalents}
                muted={solving === 'requiredCash'}
              >
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="qr-cash"
                  className={inputClass}
                  inputMode="decimal"
                  value={
                    solving === 'requiredCash' && result?.requiredCash != null
                      ? String(Math.max(0, result.requiredCash))
                      : input.cashAndCashEquivalents
                  }
                  readOnly={solving === 'requiredCash'}
                  onChange={(e) =>
                    set({ cashAndCashEquivalents: e.target.value })
                  }
                  placeholder="150000"
                />
              </FieldShell>
              {errors.cashAndCashEquivalents ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.cashAndCashEquivalents}
                </p>
              ) : null}
            </div>
          ) : (
            <div>
              <label htmlFor="qr-cash-req" className={labelClass}>
                Required Cash
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="qr-cash-req"
                  className={inputClass}
                  readOnly
                  aria-readonly
                  value={
                    result?.requiredCash != null
                      ? String(Math.max(0, result.requiredCash))
                      : ''
                  }
                  placeholder="—"
                />
              </FieldShell>
              {result?.requiredCash != null && result.requiredCash < 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Marketable securities and receivables already exceed the
                  required quick assets — no additional cash holding is required
                  (negative cash is not shown as a target).
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="qr-ms" className={labelClass}>
              Marketable Securities
              <InfoTooltip
                label="Marketable Securities"
                text="Liquid investments that can generally be converted into cash quickly, subject to market conditions and any restrictions. Not every security automatically qualifies as a quick asset."
              />
            </label>
            <FieldShell error={errors.marketableSecurities}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-ms"
                className={inputClass}
                inputMode="decimal"
                value={input.marketableSecurities}
                onChange={(e) =>
                  set({ marketableSecurities: e.target.value })
                }
                placeholder="50000"
              />
            </FieldShell>
            {errors.marketableSecurities ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.marketableSecurities}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="qr-ar" className={labelClass}>
              Accounts Receivable
              <InfoTooltip
                label="Accounts Receivable"
                text="Amounts owed by customers for goods or services already provided, preferably measured net of expected credit losses or applicable allowances."
              />
            </label>
            <FieldShell error={errors.accountsReceivable}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-ar"
                className={inputClass}
                inputMode="decimal"
                value={input.accountsReceivable}
                onChange={(e) => set({ accountsReceivable: e.target.value })}
                placeholder="100000"
              />
            </FieldShell>
            {errors.accountsReceivable ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.accountsReceivable}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {!direct &&
      (solving === 'quickRatio' || solving === 'currentLiabilities') ? (
        <>
          <div>
            <label htmlFor="qr-ca" className={labelClass}>
              Total Current Assets
            </label>
            <FieldShell error={errors.currentAssets}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-ca"
                className={inputClass}
                inputMode="decimal"
                value={input.currentAssets}
                onChange={(e) => set({ currentAssets: e.target.value })}
                placeholder="500000"
              />
            </FieldShell>
            {errors.currentAssets ? (
              <p className="mt-1 text-xs text-rose-600">{errors.currentAssets}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="qr-inv" className={labelClass}>
              Inventory
            </label>
            <FieldShell error={errors.inventory}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-inv"
                className={inputClass}
                inputMode="decimal"
                value={input.inventory}
                onChange={(e) => set({ inventory: e.target.value })}
                placeholder="150000"
              />
            </FieldShell>
            {errors.inventory ? (
              <p className="mt-1 text-xs text-rose-600">{errors.inventory}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="qr-pe" className={labelClass}>
              Prepaid Expenses
            </label>
            <FieldShell error={errors.prepaidExpenses}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-pe"
                className={inputClass}
                inputMode="decimal"
                value={input.prepaidExpenses}
                onChange={(e) => set({ prepaidExpenses: e.target.value })}
                placeholder="50000"
              />
            </FieldShell>
            {errors.prepaidExpenses ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.prepaidExpenses}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="qr-oth" className={labelClass}>
              Other Non-Quick Current Assets
            </label>
            <FieldShell error={errors.otherNonQuickAssets}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="qr-oth"
                className={inputClass}
                inputMode="decimal"
                value={input.otherNonQuickAssets}
                onChange={(e) =>
                  set({ otherNonQuickAssets: e.target.value })
                }
                placeholder="0"
              />
            </FieldShell>
            {errors.otherNonQuickAssets ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.otherNonQuickAssets}
              </p>
            ) : null}
          </div>
        </>
      ) : null}

      {solving === 'requiredQuickAssets' ||
      solving === 'quickRatio' ||
      solving === 'requiredCash' ? (
        <div>
          <label htmlFor="qr-cl" className={labelClass}>
            Current Liabilities
            <InfoTooltip
              label="Current Liabilities"
              text="Obligations generally due within one year or the normal operating cycle, including qualifying short-term debt, accounts payable, and accrued expenses."
            />
          </label>
          <FieldShell
            error={errors.currentLiabilities}
            muted={solving === 'currentLiabilities'}
          >
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="qr-cl"
              className={inputClass}
              inputMode="decimal"
              readOnly={solving === 'currentLiabilities'}
              value={
                solving === 'currentLiabilities' && result
                  ? String(result.currentLiabilities)
                  : input.currentLiabilities
              }
              onChange={(e) => set({ currentLiabilities: e.target.value })}
              placeholder="200000"
            />
          </FieldShell>
          {errors.currentLiabilities ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.currentLiabilities}
            </p>
          ) : null}
        </div>
      ) : null}

      {solving === 'currentLiabilities' ? (
        <div>
          <label htmlFor="qr-cl-out" className={labelClass}>
            Current Liabilities (calculated)
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="qr-cl-out"
              className={inputClass}
              readOnly
              aria-readonly
              value={result ? String(result.currentLiabilities) : ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      ) : null}

      {solving === 'requiredQuickAssets' ? (
        <div>
          <label htmlFor="qr-qa-out" className={labelClass}>
            Required Quick Assets
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="qr-qa-out"
              className={inputClass}
              readOnly
              aria-readonly
              value={result ? String(result.quickAssets) : ''}
              placeholder="—"
            />
          </FieldShell>
        </div>
      ) : null}

      <div>
        <label htmlFor="qr-out" className={labelClass}>
          Quick Ratio
          <InfoTooltip
            label="Quick Ratio"
            text="The ratio of a company's most liquid current assets to its current liabilities. It indicates short-term liquidity without relying on inventory sales."
          />
        </label>
        <FieldShell muted>
          <input
            id="qr-out"
            className={inputClass}
            readOnly
            aria-readonly
            value={result ? String(result.quickRatio) : ''}
            placeholder="—"
          />
          <span className="pr-3 text-sm text-muted-foreground">x</span>
        </FieldShell>
      </div>
    </form>
  );
}
