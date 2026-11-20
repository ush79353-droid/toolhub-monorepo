'use client';

import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PortfolioBetaFieldErrors,
  PortfolioBetaInput,
  PortfolioBetaResult,
  PortfolioStockRow,
} from './types';
import {
  MAX_PORTFOLIO_STOCKS,
  MIN_PORTFOLIO_STOCKS,
  createStockRow,
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

interface PortfolioBetaFormProps {
  input: PortfolioBetaInput;
  errors: PortfolioBetaFieldErrors;
  result: PortfolioBetaResult | null;
  onChange: (input: PortfolioBetaInput) => void;
}

export function PortfolioBetaForm({
  input,
  errors,
  result,
  onChange,
}: PortfolioBetaFormProps) {
  const updateStock = (id: string, patch: Partial<PortfolioStockRow>) => {
    onChange({
      stocks: input.stocks.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  };

  const addStock = () => {
    if (input.stocks.length >= MAX_PORTFOLIO_STOCKS) return;
    onChange({ stocks: [...input.stocks, createStockRow()] });
  };

  const removeStock = (id: string) => {
    if (input.stocks.length <= MIN_PORTFOLIO_STOCKS) return;
    onChange({ stocks: input.stocks.filter((s) => s.id !== id) });
  };

  const atMax = input.stocks.length >= MAX_PORTFOLIO_STOCKS;
  const canRemove = input.stocks.length > MIN_PORTFOLIO_STOCKS;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Portfolio beta = Σ (weight% ÷ 100 × stock beta). Weights should total
        100% for a fully invested long-only portfolio. Negative betas are
        allowed.
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is portfolio beta?
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Stock weights and respective betas
        </legend>

        {input.stocks.map((stock, index) => {
          const rowErr = errors.stocks?.[stock.id];
          return (
            <div
              key={stock.id}
              className="space-y-3 rounded-lg border border-border bg-white/70 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13px] font-semibold text-accent">
                  Stock {index + 1}
                </h3>
                {canRemove ? (
                  <button
                    type="button"
                    onClick={() => removeStock(stock.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-accent"
                    aria-label={`Remove stock ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`pb-beta-${stock.id}`}
                    className={labelClass}
                  >
                    Stock beta (β{index + 1})
                    <InfoTooltip
                      label="Stock beta"
                      text="Estimated sensitivity of this holding to the benchmark. May be greater than 1, zero, or negative."
                    />
                  </label>
                  <FieldShell error={rowErr?.beta}>
                    <input
                      id={`pb-beta-${stock.id}`}
                      type="text"
                      inputMode="decimal"
                      className={inputClass}
                      value={stock.beta}
                      onChange={(e) =>
                        updateStock(stock.id, { beta: e.target.value })
                      }
                      placeholder="1.20"
                      aria-invalid={Boolean(rowErr?.beta)}
                    />
                  </FieldShell>
                  {rowErr?.beta ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErr.beta}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor={`pb-weight-${stock.id}`}
                    className={labelClass}
                  >
                    Weight (w{index + 1})
                    <InfoTooltip
                      label="Portfolio weight"
                      text="Percent of the portfolio allocated to this stock (0–100)."
                    />
                  </label>
                  <FieldShell error={rowErr?.weight}>
                    <input
                      id={`pb-weight-${stock.id}`}
                      type="text"
                      inputMode="decimal"
                      className={inputClass}
                      value={stock.weight}
                      onChange={(e) =>
                        updateStock(stock.id, { weight: e.target.value })
                      }
                      placeholder="50"
                      aria-invalid={Boolean(rowErr?.weight)}
                    />
                    <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
                      %
                    </span>
                  </FieldShell>
                  {rowErr?.weight ? (
                    <p className="mt-1 text-xs text-rose-600">{rowErr.weight}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addStock}
          disabled={atMax}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-white text-sm font-semibold text-accent hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add another stock
        </button>
        {atMax ? (
          <p className="text-xs text-muted-foreground">
            Maximum of {MAX_PORTFOLIO_STOCKS} stocks reached.
          </p>
        ) : null}

        <div>
          <label htmlFor="pb-total-weight" className={labelClass}>
            Total portfolio weight
          </label>
          <FieldShell muted>
            <input
              id="pb-total-weight"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedTotalWeight ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
          {result?.weightMessage ? (
            <p className="mt-1.5 text-xs text-amber-800" role="status">
              {result.weightMessage}
            </p>
          ) : null}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
