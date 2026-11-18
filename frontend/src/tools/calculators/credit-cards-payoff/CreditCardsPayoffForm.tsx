'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  SHOW_MORE_ROWS,
  createBlankCardRow,
  type CreditCardsPayoffFieldErrors,
  type CreditCardsPayoffInput,
  type CreditCardsPayoffResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums text-accent outline-none sm:px-3';
const cellInputClass =
  'h-10 w-full min-w-0 bg-transparent px-2 text-sm tabular-nums text-accent outline-none';

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

function CellShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-10 min-w-0 items-center rounded-md border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface CreditCardsPayoffFormProps {
  input: CreditCardsPayoffInput;
  errors: CreditCardsPayoffFieldErrors;
  result: CreditCardsPayoffResult | null;
  showSchedule: boolean;
  onToggleSchedule: () => void;
  onChange: (input: CreditCardsPayoffInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CreditCardsPayoffForm({
  input,
  errors,
  result,
  showSchedule,
  onToggleSchedule,
  onChange,
  onCalculate,
  onClear,
}: CreditCardsPayoffFormProps) {
  const set = (patch: Partial<CreditCardsPayoffInput>) =>
    onChange({ ...input, ...patch });

  const updateCard = (
    index: number,
    patch: Partial<CreditCardsPayoffInput['cards'][number]>
  ) => {
    const next = input.cards.map((row, i) =>
      i === index ? { ...row, ...patch } : row
    );
    onChange({ ...input, cards: next });
  };

  const showMore = () => {
    const extras = Array.from({ length: SHOW_MORE_ROWS }, () =>
      createBlankCardRow()
    );
    set({ cards: [...input.cards, ...extras] });
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onCalculate();
        }}
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        noValidate
        autoComplete="off"
      >
        <div>
          <label className={labelClass} htmlFor="ccp-budget">
            <span>Monthly budget set aside for credit cards</span>
            <InfoTooltip
              label="Monthly budget"
              text="Total dollars available each month for all credit card payments. Must cover every card's minimum; leftover goes to the highest APR."
            />
          </label>
          <FieldShell error={errors.monthlyBudget} className="max-w-xs">
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              $
            </span>
            <input
              id="ccp-budget"
              className={inputClass}
              inputMode="decimal"
              value={input.monthlyBudget}
              aria-invalid={Boolean(errors.monthlyBudget)}
              onChange={(e) => set({ monthlyBudget: e.target.value })}
            />
          </FieldShell>
          {errors.monthlyBudget ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlyBudget}</p>
          ) : null}
        </div>

        <div>
          <div className={`${labelClass} mb-2`}>
            <span>Info of your credit cards</span>
            <InfoTooltip
              label="Credit cards"
              text="Enter name, balance, minimum payment, and APR for each card. Entirely blank rows are ignored. Use Show more input fields to add rows."
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[12px] font-semibold text-accent">
                  <th className="w-8 px-2 py-2 text-center">#</th>
                  <th className="px-2 py-2">Credit card</th>
                  <th className="px-2 py-2">Balance</th>
                  <th className="px-2 py-2">Minimum payment</th>
                  <th className="px-2 py-2">Interest rate</th>
                </tr>
              </thead>
              <tbody>
                {input.cards.map((row, index) => {
                  const rowErrors = errors.cards?.[index];
                  return (
                    <tr key={index} className="border-b border-border/70 last:border-b-0">
                      <td className="px-2 py-1.5 text-center text-xs text-muted-foreground">
                        {index + 1}
                      </td>
                      <td className="px-2 py-1.5">
                        <CellShell error={rowErrors?.name}>
                          <input
                            id={`ccp-name-${index}`}
                            className={cellInputClass}
                            value={row.name}
                            aria-label={`Credit card ${index + 1} name`}
                            aria-invalid={Boolean(rowErrors?.name)}
                            onChange={(e) =>
                              updateCard(index, { name: e.target.value })
                            }
                          />
                        </CellShell>
                      </td>
                      <td className="px-2 py-1.5">
                        <CellShell error={rowErrors?.balance}>
                          <span
                            className="shrink-0 pl-2 text-sm text-muted-foreground"
                            aria-hidden
                          >
                            $
                          </span>
                          <input
                            id={`ccp-bal-${index}`}
                            className={cellInputClass}
                            inputMode="decimal"
                            value={row.balance}
                            aria-label={`Credit card ${index + 1} balance`}
                            aria-invalid={Boolean(rowErrors?.balance)}
                            onChange={(e) =>
                              updateCard(index, { balance: e.target.value })
                            }
                          />
                        </CellShell>
                      </td>
                      <td className="px-2 py-1.5">
                        <CellShell error={rowErrors?.minimumPayment}>
                          <span
                            className="shrink-0 pl-2 text-sm text-muted-foreground"
                            aria-hidden
                          >
                            $
                          </span>
                          <input
                            id={`ccp-min-${index}`}
                            className={cellInputClass}
                            inputMode="decimal"
                            value={row.minimumPayment}
                            aria-label={`Credit card ${index + 1} minimum payment`}
                            aria-invalid={Boolean(rowErrors?.minimumPayment)}
                            onChange={(e) =>
                              updateCard(index, {
                                minimumPayment: e.target.value,
                              })
                            }
                          />
                        </CellShell>
                      </td>
                      <td className="px-2 py-1.5">
                        <CellShell error={rowErrors?.aprPercent}>
                          <input
                            id={`ccp-apr-${index}`}
                            className={`${cellInputClass} pr-7`}
                            inputMode="decimal"
                            value={row.aprPercent}
                            aria-label={`Credit card ${index + 1} interest rate`}
                            aria-invalid={Boolean(rowErrors?.aprPercent)}
                            onChange={(e) =>
                              updateCard(index, { aprPercent: e.target.value })
                            }
                          />
                          <span
                            className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground"
                            aria-hidden
                          >
                            %
                          </span>
                        </CellShell>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {errors.cards?.some((e) => e && Object.keys(e).length > 0) ? (
            <p className="mt-1 text-xs text-rose-600">
              Fix the highlighted card fields before calculating.
            </p>
          ) : null}

          <button
            type="button"
            onClick={showMore}
            className="mt-2 text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Show more input fields
          </button>
        </div>

        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" className="h-10 rounded-xl px-4 text-xs font-semibold">
            Calculate
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-4 text-xs font-semibold"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </form>

      <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
        <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
          Results
        </div>
        {result ? (
          <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
            <p>
              Total repayment duration:{' '}
              <strong className="font-semibold text-accent">
                {result.formattedDuration}
              </strong>
            </p>
            <p>
              Total interest paid:{' '}
              <strong className="font-semibold text-accent">
                ${result.formattedTotalInterest}
              </strong>
            </p>
            <p>
              Total amount paid:{' '}
              <strong className="font-semibold text-accent">
                ${result.formattedTotalPaid}
              </strong>
            </p>
            <p>
              Optimal repayment order:{' '}
              <strong className="font-semibold text-accent">
                {result.formattedOptimalOrder}
              </strong>
            </p>

            <div>
              <p className="mb-1.5 font-medium text-accent">Estimated payoff month</p>
              <ul className="space-y-1 text-sm">
                {result.cardPayoffs.map((card) => (
                  <li key={card.id}>
                    {card.name}: month {card.payoffMonth} (APR {card.formattedApr}%)
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <button
                type="button"
                onClick={onToggleSchedule}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                aria-expanded={showSchedule}
              >
                {showSchedule
                  ? 'Hide monthly payment schedule'
                  : 'Show monthly payment schedule'}
              </button>
              {showSchedule ? (
                <div className="mt-2 max-h-80 overflow-auto rounded-lg border border-border">
                  <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                    <thead className="sticky top-0 bg-muted/80">
                      <tr className="border-b border-border text-accent">
                        <th className="px-2 py-1.5">Month</th>
                        <th className="px-2 py-1.5">Card</th>
                        <th className="px-2 py-1.5">Opening</th>
                        <th className="px-2 py-1.5">Payment</th>
                        <th className="px-2 py-1.5">Closing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((month) =>
                        month.cards.map((cell, idx) => (
                          <tr
                            key={`${month.month}-${cell.id}`}
                            className="border-b border-border/60"
                          >
                            <td className="px-2 py-1 tabular-nums">
                              {idx === 0 ? month.month : ''}
                            </td>
                            <td className="px-2 py-1">{cell.name}</td>
                            <td className="px-2 py-1 tabular-nums">
                              ${cell.formattedOpeningBalance}
                            </td>
                            <td className="px-2 py-1 tabular-nums">
                              ${cell.formattedPayment}
                            </td>
                            <td className="px-2 py-1 tabular-nums">
                              ${cell.formattedClosingBalance}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>

            <p className="text-xs text-muted-foreground">{result.summary}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Modify the values and click Calculate to build an avalanche payoff schedule.
          </p>
        )}
      </div>
    </div>
  );
}
