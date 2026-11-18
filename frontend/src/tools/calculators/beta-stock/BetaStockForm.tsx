'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  dayOrdinal,
  type BetaStockFieldErrors,
  type BetaStockInput,
  type BetaStockResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface BetaStockFormProps {
  input: BetaStockInput;
  errors: BetaStockFieldErrors;
  result: BetaStockResult | null;
  onChange: (input: BetaStockInput) => void;
}

export function BetaStockForm({
  input,
  errors,
  result,
  onChange,
}: BetaStockFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BetaStockInput>) => onChange({ ...input, ...patch });

  const setPair = (index: number, field: 'asset' | 'benchmark', value: string) => {
    const pairs = input.pairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    set({ pairs });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4">
          Data
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {input.pairs.map((pair, index) => {
            const day = index + 1;
            const ordinal = dayOrdinal(day);
            const assetId = `beta-asset-${day}`;
            const benchId = `beta-bench-${day}`;
            const assetError = errors[`asset${day}`];
            const benchError = errors[`benchmark${day}`];
            const assetLabel = `${ordinal} day Asset price`;
            const benchLabel = `${ordinal} day Benchmark price`;

            return (
              <div
                key={day}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3"
              >
                <div>
                  <label htmlFor={assetId} className={labelClass}>
                    {assetLabel}
                    {index === 0 ? (
                      <InfoTooltip
                        label={assetLabel}
                        text="Chronological asset closing prices. Must be positive. Currency labels amounts only."
                      />
                    ) : null}
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={assetError}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden="true"
                      >
                        {symbol}
                      </span>
                      <input
                        id={assetId}
                        className={inputClass}
                        inputMode="decimal"
                        value={pair.asset}
                        aria-invalid={Boolean(assetError)}
                        onChange={(e) => setPair(index, 'asset', e.target.value)}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`${assetId}-currency`}
                        value={input.currency}
                        onChange={(currency) => set({ currency })}
                        aria-label={`${assetLabel} currency`}
                      />
                    </div>
                  </div>
                  {assetError ? (
                    <p className="mt-1 text-xs text-rose-600">{assetError}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor={benchId} className={labelClass}>
                    {benchLabel}
                    {index === 0 ? (
                      <InfoTooltip
                        label={benchLabel}
                        text="Chronological benchmark prices for the same days. Must be positive."
                      />
                    ) : null}
                  </label>
                  <div className="flex gap-2">
                    <FieldShell error={benchError}>
                      <span
                        className="shrink-0 pl-3 text-sm text-muted-foreground"
                        aria-hidden="true"
                      >
                        {symbol}
                      </span>
                      <input
                        id={benchId}
                        className={inputClass}
                        inputMode="decimal"
                        value={pair.benchmark}
                        aria-invalid={Boolean(benchError)}
                        onChange={(e) => setPair(index, 'benchmark', e.target.value)}
                      />
                    </FieldShell>
                    <div className="w-[110px] shrink-0 sm:w-[120px]">
                      <CurrencySelect
                        id={`${benchId}-currency`}
                        value={input.currency}
                        onChange={(currency) => set({ currency })}
                        aria-label={`${benchLabel} currency`}
                      />
                    </div>
                  </div>
                  {benchError ? (
                    <p className="mt-1 text-xs text-rose-600">{benchError}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      <fieldset className="space-y-3 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Results</legend>

        {result ? (
          <div>
            <label htmlFor="beta-result" className={labelClass}>
              Stock Beta (β)
              <InfoTooltip
                label="Stock Beta"
                text="Cov(asset returns, benchmark returns) ÷ Var(benchmark returns). Dimensionless."
              />
            </label>
            <input
              id="beta-result"
              type="text"
              readOnly
              className="h-11 w-full rounded-lg border border-border bg-muted/20 px-3 text-sm font-semibold tabular-nums text-accent"
              value={result.formattedBeta}
              aria-live="polite"
            />
          </div>
        ) : null}

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={input.graphPrices}
            onChange={(e) => set({ graphPrices: e.target.checked })}
          />
          Graph the prices
        </label>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
