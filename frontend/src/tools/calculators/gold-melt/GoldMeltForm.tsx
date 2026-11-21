'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateBidAskFromSpread,
  formatGoldMoney,
  parseOptionalNumber,
} from './calculation';
import {
  KARAT_OPTIONS,
  PRICE_UNIT_OPTIONS,
  WEIGHT_UNIT_OPTIONS,
  purityForKarat,
  type GoldMeltFieldErrors,
  type GoldMeltInput,
  type GoldMeltResult,
  type KaratOption,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface GoldMeltFormProps {
  input: GoldMeltInput;
  errors: GoldMeltFieldErrors;
  result: GoldMeltResult | null;
  onChange: (next: GoldMeltInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function GoldMeltForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: GoldMeltFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const money = (v: number) => `${symbol}${formatGoldMoney(v, input.currency)}`;

  const set = (patch: Partial<GoldMeltInput>) => {
    onChange({ ...input, ...patch });
  };

  const setKarat = (karat: KaratOption) => {
    const purity = purityForKarat(karat);
    set({
      karat,
      purity: purity !== null ? String(purity) : input.purity,
    });
  };

  const syncTradeFromSpread = (
    next: GoldMeltInput,
    marketPriceRaw: string,
    spreadRaw: string,
  ): GoldMeltInput => {
    const spot = parseOptionalNumber(marketPriceRaw);
    const spread = parseOptionalNumber(spreadRaw);
    if (spot === null || spread === null) return next;
    const { bid, ask } = calculateBidAskFromSpread(spot, spread);
    return {
      ...next,
      bidPrice: next.bidPriceManuallySet
        ? next.bidPrice
        : formatGoldMoney(bid, next.currency),
      askPrice: next.askPriceManuallySet
        ? next.askPrice
        : formatGoldMoney(ask, next.currency),
    };
  };

  const updateMarketOrSpread = (patch: Partial<GoldMeltInput>) => {
    const next = { ...input, ...patch };
    onChange(
      syncTradeFromSpread(
        next,
        next.marketPrice,
        next.spread,
      ),
    );
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Estimate gold melt value from karat/purity, weight, and market price. Dealer bids may
          differ from spot melt value.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="gm-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="gm-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      {/* Quality */}
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4">
          <span>Quality</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
          <div>
            <div className={labelClass}>
              <label htmlFor="gm-karat">Karat</label>
              <InfoTooltip
                label="Karat"
                text="Select a standard karat or Custom purity. 24K uses the commercial 99.9% display convention."
                align="left"
              />
            </div>
            <select
              id="gm-karat"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.karat}
              onChange={(e) => setKarat(e.target.value as KaratOption)}
            >
              {KARAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                  {opt.purityPercent !== null ? ` (${opt.purityPercent}%)` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className={labelClass}>
              <label htmlFor="gm-purity">Purity</label>
            </div>
            <FieldShell error={errors.purity}>
              <input
                id="gm-purity"
                className={inputClass}
                inputMode="decimal"
                value={input.purity}
                disabled={input.karat !== 'custom'}
                onChange={(e) => set({ karat: 'custom', purity: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.purity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.purity}</p>
            ) : null}
          </div>
        </div>
      </details>

      {/* Value */}
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4">
          <span>Value</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
          <div>
            <div className={labelClass}>
              <label htmlFor="gm-weight">Weight of gold</label>
            </div>
            <div className="flex gap-2">
              <FieldShell error={errors.weight}>
                <input
                  id="gm-weight"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.weight}
                  onChange={(e) => set({ weight: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 max-w-[9.5rem] rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.weightUnit}
                aria-label="Weight unit"
                onChange={(e) =>
                  set({ weightUnit: e.target.value as GoldMeltInput['weightUnit'] })
                }
              >
                {WEIGHT_UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.weight ? (
              <p className="mt-1 text-xs text-rose-600">{errors.weight}</p>
            ) : null}
          </div>

          <div>
            <div className={labelClass}>
              <label htmlFor="gm-price">Market price</label>
              <InfoTooltip
                label="Market price"
                text="Enter the pure-gold spot price manually. This tool does not fetch live quotes."
                align="left"
              />
            </div>
            <div className="flex gap-2">
              <FieldShell error={errors.marketPrice}>
                <span className="pl-3 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="gm-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.marketPrice}
                  onChange={(e) => updateMarketOrSpread({ marketPrice: e.target.value })}
                />
              </FieldShell>
              <select
                className="h-11 max-w-[10.5rem] rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={input.marketPriceUnit}
                aria-label="Price unit"
                onChange={(e) =>
                  updateMarketOrSpread({
                    marketPriceUnit: e.target.value as GoldMeltInput['marketPriceUnit'],
                  })
                }
              >
                {PRICE_UNIT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.marketPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.marketPrice}</p>
            ) : null}
          </div>

          <div>
            <div className={labelClass}>
              <span>Possession value</span>
              <InfoTooltip
                label="Possession value"
                text="Estimated intrinsic melt value = weight × purity × pure-gold price. Not retail jewelry value."
                align="left"
              />
            </div>
            <div className="flex h-11 items-center rounded-lg border border-border bg-white px-3 text-sm font-semibold tabular-nums text-primary">
              {result ? money(result.meltValue) : '—'}
            </div>
          </div>
        </div>
      </details>

      {/* Trade */}
      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-sm font-semibold text-accent sm:px-4">
          <span>Trade / Exchange</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
          <div>
            <div className={labelClass}>
              <label htmlFor="gm-spread">Spread</label>
            </div>
            <FieldShell error={errors.spread}>
              <input
                id="gm-spread"
                className={inputClass}
                inputMode="decimal"
                value={input.spread}
                onChange={(e) => updateMarketOrSpread({ spread: e.target.value })}
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.spread ? (
              <p className="mt-1 text-xs text-rose-600">{errors.spread}</p>
            ) : null}
          </div>

          <div>
            <div className={labelClass}>
              <label htmlFor="gm-bid">Bid price</label>
              <InfoTooltip
                label="Bid price"
                text="Dealer buy price in the same unit as market price. Edit to override the spread-based estimate."
                align="left"
              />
            </div>
            <FieldShell error={errors.bidPrice}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="gm-bid"
                className={inputClass}
                inputMode="decimal"
                value={
                  input.bidPrice ||
                  (result ? formatGoldMoney(result.bidPricePerUnit, input.currency) : '')
                }
                onChange={(e) =>
                  set({ bidPrice: e.target.value, bidPriceManuallySet: true })
                }
              />
            </FieldShell>
            {errors.bidPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.bidPrice}</p>
            ) : null}
          </div>

          <div>
            <div className={labelClass}>
              <label htmlFor="gm-ask">Ask price</label>
              <InfoTooltip
                label="Ask price"
                text="Dealer sell price in the same unit as market price. Edit to override the spread-based estimate."
                align="left"
              />
            </div>
            <FieldShell error={errors.askPrice}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="gm-ask"
                className={inputClass}
                inputMode="decimal"
                value={
                  input.askPrice ||
                  (result ? formatGoldMoney(result.askPricePerUnit, input.currency) : '')
                }
                onChange={(e) =>
                  set({ askPrice: e.target.value, askPriceManuallySet: true })
                }
              />
            </FieldShell>
            {errors.askPrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.askPrice}</p>
            ) : null}
          </div>
        </div>
      </details>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <h3 className="text-sm font-semibold text-accent">Estimated gold melt value</h3>
          <p className="text-2xl font-semibold tabular-nums text-primary">
            {money(result.meltValue)}
          </p>
          <p className="text-sm text-muted-foreground">{result.summaryText}</p>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Weight (grams)</dt>
              <dd className="tabular-nums">
                {result.weightInGrams.toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Purity</dt>
              <dd className="tabular-nums">{result.purityPercentage}%</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Pure gold content</dt>
              <dd className="tabular-nums">
                {result.pureGoldWeight.toLocaleString('en-US', {
                  maximumFractionDigits: 6,
                })}{' '}
                g
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Price / gram</dt>
              <dd className="tabular-nums">{money(result.marketPricePerGram)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Dealer bid value</dt>
              <dd className="tabular-nums">{money(result.bidValue)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Dealer ask value</dt>
              <dd className="tabular-nums">{money(result.askValue)}</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-border/70 py-1.5">
              <dt className="text-muted-foreground">Spot − bid</dt>
              <dd className="tabular-nums">{money(result.spreadDifference)}</dd>
            </div>
            <div className="flex justify-between gap-2 py-1.5">
              <dt className="text-muted-foreground">Effective bid discount</dt>
              <dd className="tabular-nums">
                {result.spreadPercentage.toLocaleString('en-US', {
                  maximumFractionDigits: 2,
                })}
                %
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </form>
  );
}
