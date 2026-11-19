'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  AverageFieldErrors,
  AverageSectionInput,
  AverageSectionResult,
  CashFlowActivity,
  CashFlowFieldErrors,
  CashFlowSectionInput,
  CashFlowSectionResult,
} from './types';
import { createInvestmentEntry, createTransaction } from './types';

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

interface AverageReturnFormProps {
  cashFlow: CashFlowSectionInput;
  cashFlowErrors: CashFlowFieldErrors;
  cashFlowResult: CashFlowSectionResult | null;
  average: AverageSectionInput;
  averageErrors: AverageFieldErrors;
  averageResult: AverageSectionResult | null;
  onCashFlowChange: (input: CashFlowSectionInput) => void;
  onAverageChange: (input: AverageSectionInput) => void;
  onCurrencyChange: (currency: CashFlowSectionInput['currency']) => void;
  onCalculateCashFlow: () => void;
  onClearCashFlow: () => void;
  onCalculateAverage: () => void;
  onClearAverage: () => void;
  onLoadCashFlowExample: () => void;
  onLoadAverageExample: () => void;
}

export function AverageReturnForm({
  cashFlow,
  cashFlowErrors,
  cashFlowResult,
  average,
  averageErrors,
  averageResult,
  onCashFlowChange,
  onAverageChange,
  onCurrencyChange,
  onCalculateCashFlow,
  onClearCashFlow,
  onCalculateAverage,
  onClearAverage,
  onLoadCashFlowExample,
  onLoadAverageExample,
}: AverageReturnFormProps) {
  const symbol = getCurrencySymbol(cashFlow.currency);

  return (
    <div className="space-y-6">
      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <h3 className="text-sm font-semibold text-accent">
            Average return based on cash flow
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Estimates the money-weighted average annual return from starting and ending balances
            plus dated deposits and withdrawals (XIRR, 365-day year).
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="ar-currency">
            <span>Display currency</span>
          </label>
          <CurrencySelect
            id="ar-currency"
            value={cashFlow.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ar-sb">
              <span>Starting balance</span>
            </label>
            <FieldShell error={cashFlowErrors.startingBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ar-sb"
                className={inputClass}
                inputMode="decimal"
                value={cashFlow.startingBalance}
                aria-invalid={Boolean(cashFlowErrors.startingBalance)}
                onChange={(e) =>
                  onCashFlowChange({ ...cashFlow, startingBalance: e.target.value })
                }
              />
            </FieldShell>
            {cashFlowErrors.startingBalance ? (
              <p className="mt-1 text-xs text-rose-600">{cashFlowErrors.startingBalance}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ar-sd">
              <span>Starting date</span>
            </label>
            <FieldShell error={cashFlowErrors.startingDate}>
              <input
                id="ar-sd"
                type="date"
                className={inputClass}
                value={cashFlow.startingDate}
                aria-invalid={Boolean(cashFlowErrors.startingDate)}
                onChange={(e) =>
                  onCashFlowChange({ ...cashFlow, startingDate: e.target.value })
                }
              />
            </FieldShell>
            {cashFlowErrors.startingDate ? (
              <p className="mt-1 text-xs text-rose-600">{cashFlowErrors.startingDate}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ar-eb">
              <span>Ending balance</span>
            </label>
            <FieldShell error={cashFlowErrors.endingBalance}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ar-eb"
                className={inputClass}
                inputMode="decimal"
                value={cashFlow.endingBalance}
                aria-invalid={Boolean(cashFlowErrors.endingBalance)}
                onChange={(e) =>
                  onCashFlowChange({ ...cashFlow, endingBalance: e.target.value })
                }
              />
            </FieldShell>
            {cashFlowErrors.endingBalance ? (
              <p className="mt-1 text-xs text-rose-600">{cashFlowErrors.endingBalance}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="ar-ed">
              <span>Ending date</span>
            </label>
            <FieldShell error={cashFlowErrors.endingDate}>
              <input
                id="ar-ed"
                type="date"
                className={inputClass}
                value={cashFlow.endingDate}
                aria-invalid={Boolean(cashFlowErrors.endingDate)}
                onChange={(e) =>
                  onCashFlowChange({ ...cashFlow, endingDate: e.target.value })
                }
              />
            </FieldShell>
            {cashFlowErrors.endingDate ? (
              <p className="mt-1 text-xs text-rose-600">{cashFlowErrors.endingDate}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[13px] font-medium text-accent">Deposits & withdrawals</p>
          {cashFlow.transactions.map((tx, index) => (
            <div
              key={tx.id}
              className="space-y-2 rounded-lg border border-border bg-white p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Transaction {index + 1}</span>
                {cashFlow.transactions.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={() =>
                      onCashFlowChange({
                        ...cashFlow,
                        transactions: cashFlow.transactions.filter((row) => row.id !== tx.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <select
                  className={selectClass}
                  value={tx.activity}
                  aria-label={`Activity ${index + 1}`}
                  onChange={(e) =>
                    onCashFlowChange({
                      ...cashFlow,
                      transactions: cashFlow.transactions.map((row) =>
                        row.id === tx.id
                          ? { ...row, activity: e.target.value as CashFlowActivity }
                          : row,
                      ),
                    })
                  }
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
                <FieldShell error={cashFlowErrors[`tx${index}`]}>
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    {symbol}
                  </span>
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    placeholder="Amount"
                    value={tx.amount}
                    aria-label={`Amount ${index + 1}`}
                    onChange={(e) =>
                      onCashFlowChange({
                        ...cashFlow,
                        transactions: cashFlow.transactions.map((row) =>
                          row.id === tx.id ? { ...row, amount: e.target.value } : row,
                        ),
                      })
                    }
                  />
                </FieldShell>
                <FieldShell>
                  <input
                    type="date"
                    className={inputClass}
                    value={tx.date}
                    aria-label={`Date ${index + 1}`}
                    onChange={(e) =>
                      onCashFlowChange({
                        ...cashFlow,
                        transactions: cashFlow.transactions.map((row) =>
                          row.id === tx.id ? { ...row, date: e.target.value } : row,
                        ),
                      })
                    }
                  />
                </FieldShell>
              </div>
              {cashFlowErrors[`tx${index}`] ? (
                <p className="text-xs text-rose-600">{cashFlowErrors[`tx${index}`]}</p>
              ) : null}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() =>
              onCashFlowChange({
                ...cashFlow,
                transactions: [...cashFlow.transactions, createTransaction()],
              })
            }
          >
            Show more input fields
          </Button>
        </div>

        {cashFlowResult ? (
          <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-3">
            <p className="text-xs text-muted-foreground">Average annual return (money-weighted)</p>
            <p className="text-2xl font-semibold tabular-nums text-accent">
              {cashFlowResult.formattedAnnualizedReturn}%
            </p>
            <ul className="space-y-1 text-sm text-foreground/90">
              <li>
                Starting: {symbol}
                {cashFlowResult.formattedStartingBalance}
              </li>
              <li>
                Ending: {symbol}
                {cashFlowResult.formattedEndingBalance}
              </li>
              <li>
                Deposits: {symbol}
                {cashFlowResult.formattedTotalDeposits}
              </li>
              <li>
                Withdrawals: {symbol}
                {cashFlowResult.formattedTotalWithdrawals}
              </li>
              <li>
                Net contributions: {symbol}
                {cashFlowResult.formattedNetExternalContributions}
              </li>
              <li>Period: {cashFlowResult.investmentPeriodDays} days</li>
            </ul>
          </div>
        ) : cashFlowErrors.form ? (
          <p className="text-xs text-rose-600">{cashFlowErrors.form}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11" onClick={onCalculateCashFlow}>
            Calculate
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={onClearCashFlow}>
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            onClick={onLoadCashFlowExample}
          >
            Example — 10%
          </Button>
        </div>
      </section>

      <section className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <div>
          <h3 className="text-sm font-semibold text-accent">Average and cumulative return</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Annualize each period return, take the arithmetic average of those annualized rates,
            and compound the period returns for cumulative performance.
          </p>
        </div>

        {average.entries.map((entry, index) => (
          <div key={entry.id} className="space-y-2 rounded-lg border border-border bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Investment {index + 1}</span>
              {average.entries.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 px-2 text-xs"
                  onClick={() =>
                    onAverageChange({
                      entries: average.entries.filter((row) => row.id !== entry.id),
                    })
                  }
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor={`ar-ret-${entry.id}`}>
                  <span>Return</span>
                  <InfoTooltip
                    label="Return"
                    text="Period investment return as a percent. Values down to −100% are allowed; below −100% is invalid."
                  />
                </label>
                <FieldShell error={averageErrors[`entry${index}`]}>
                  <input
                    id={`ar-ret-${entry.id}`}
                    className={inputClass}
                    inputMode="decimal"
                    value={entry.returnPercentage}
                    onChange={(e) =>
                      onAverageChange({
                        entries: average.entries.map((row) =>
                          row.id === entry.id
                            ? { ...row, returnPercentage: e.target.value }
                            : row,
                        ),
                      })
                    }
                  />
                  <span className="shrink-0 pr-3 text-xs text-muted-foreground">%</span>
                </FieldShell>
              </div>
              <div>
                <label className={labelClass} htmlFor={`ar-y-${entry.id}`}>
                  Years
                </label>
                <FieldShell>
                  <input
                    id={`ar-y-${entry.id}`}
                    className={inputClass}
                    inputMode="numeric"
                    value={entry.holdingYears}
                    onChange={(e) =>
                      onAverageChange({
                        entries: average.entries.map((row) =>
                          row.id === entry.id
                            ? { ...row, holdingYears: e.target.value }
                            : row,
                        ),
                      })
                    }
                  />
                </FieldShell>
              </div>
              <div>
                <label className={labelClass} htmlFor={`ar-m-${entry.id}`}>
                  Months
                </label>
                <FieldShell>
                  <input
                    id={`ar-m-${entry.id}`}
                    className={inputClass}
                    inputMode="numeric"
                    value={entry.holdingMonths}
                    onChange={(e) =>
                      onAverageChange({
                        entries: average.entries.map((row) =>
                          row.id === entry.id
                            ? { ...row, holdingMonths: e.target.value }
                            : row,
                        ),
                      })
                    }
                  />
                </FieldShell>
              </div>
            </div>
            {averageErrors[`entry${index}`] ? (
              <p className="text-xs text-rose-600">{averageErrors[`entry${index}`]}</p>
            ) : null}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() =>
            onAverageChange({
              entries: [...average.entries, createInvestmentEntry()],
            })
          }
        >
          Show more input fields
        </Button>

        {averageResult ? (
          <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-3">
            <p className="text-xs text-muted-foreground">
              Arithmetic average of annualized returns
            </p>
            <p className="text-2xl font-semibold tabular-nums text-accent">
              {averageResult.formattedAverageAnnualizedReturn}%
            </p>
            <ul className="space-y-1 text-sm text-foreground/90">
              <li>Valid periods: {averageResult.validEntryCount}</li>
              <li>
                Cumulative return:{' '}
                <strong>{averageResult.formattedCumulativeReturn}%</strong>
              </li>
              <li>
                Overall annualized compounded:{' '}
                <strong>{averageResult.formattedOverallAnnualizedReturn}%</strong>
              </li>
              <li>Total holding months: {averageResult.totalHoldingMonths}</li>
              <li>
                Individual annualized:{' '}
                {averageResult.formattedAnnualizedReturns.map((v) => `${v}%`).join(', ')}
              </li>
            </ul>
          </div>
        ) : averageErrors.form ? (
          <p className="text-xs text-rose-600">{averageErrors.form}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11" onClick={onCalculateAverage}>
            Calculate
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={onClearAverage}>
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-11"
            onClick={onLoadAverageExample}
          >
            Example — 24.07% cumulative
          </Button>
        </div>
      </section>
    </div>
  );
}
