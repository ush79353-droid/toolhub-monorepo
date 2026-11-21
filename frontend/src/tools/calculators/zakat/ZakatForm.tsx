'use client';

import { Button } from '@/components/ui/button';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { CurrencyRatesSnapshot } from '@/tools/shared/currency-rates';
import { resolveMetalPrice } from './calculation';
import {
  GOLD_NISAB_GRAMS,
  METAL_REFERENCE_AS_OF,
  SILVER_NISAB_GRAMS,
  type HawlStatus,
  type NisabMethod,
  type ZakatFieldErrors,
  type ZakatInput,
  type ZakatResult,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const controlClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface ZakatFormProps {
  input: ZakatInput;
  errors: ZakatFieldErrors;
  result: ZakatResult | null;
  rates: CurrencyRatesSnapshot;
  onChange: (next: ZakatInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
}

function moneyField(
  id: string,
  label: string,
  value: number,
  onValue: (next: number) => void,
) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={controlClass}
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        value={value}
        onChange={(event) => onValue(event.target.value === '' ? 0 : Number(event.target.value))}
      />
    </div>
  );
}

export function ZakatForm({
  input,
  errors,
  result,
  rates,
  onChange,
  onCurrencyChange,
  onCalculate,
  onClear,
  onReload,
}: ZakatFormProps) {
  const gold = resolveMetalPrice({
    metal: 'gold',
    currency: input.currency,
    mode: input.goldPriceMode,
    manualPricePerGram: input.manualGoldPricePerGram,
    rates: rates.rates,
  });
  const silver = resolveMetalPrice({
    metal: 'silver',
    currency: input.currency,
    mode: input.silverPriceMode,
    manualPricePerGram: input.manualSilverPricePerGram,
    rates: rates.rates,
  });
  const priceLabel = (kind: 'reference' | 'manual' | 'unavailable') =>
    kind === 'manual'
      ? `Manual price in ${input.currency}.`
      : kind === 'reference'
        ? `Reference price as of ${METAL_REFERENCE_AS_OF}, not a live quote.`
        : 'Reference conversion is unavailable. Type a price per gram.';

  const set = (patch: Partial<ZakatInput>) => onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
    >
      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Find Nisab in your region</h3>
        <div>
          <label className={labelClass} htmlFor="zakat-currency">
            Currency
          </label>
          <CurrencySelect id="zakat-currency" value={input.currency} onChange={onCurrencyChange} />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {CURRENCY_DENOMINATION_NOTE} Cash and other amounts you type stay as entered. Reference metal prices are stored in USD and converted with stored rates.
          </p>
          {rates.available && rates.isStale ? (
            <p className="mt-1 text-xs text-amber-700">
              Exchange rates are older than 48 hours. Conversions still use the last stored rates
              {rates.fetchedAt ? ` (${rates.fetchedAt})` : ''}.
            </p>
          ) : null}
          {rates.available && !rates.isStale && rates.fetchedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">Exchange rates as of {rates.fetchedAt}.</p>
          ) : null}
        </div>
        <fieldset>
          <legend className={labelClass}>Nisab method</legend>
          <div className="space-y-2 text-sm">
            {(
              [
                ['gold', `Gold: ${GOLD_NISAB_GRAMS} grams or 7.5 tola`],
                ['silver', `Silver: ${SILVER_NISAB_GRAMS} grams or 52.5 tola`],
                ['custom', 'Enter custom Nisab value'],
              ] as const
            ).map(([method, label]) => (
              <label key={method} className="flex items-start gap-2">
                <input
                  type="radio"
                  name="zakat-nisab"
                  className="mt-0.5 h-4 w-4 accent-primary"
                  checked={input.nisabMethod === method}
                  onChange={() => set({ nisabMethod: method as NisabMethod })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {input.nisabMethod === 'custom' ? (
          moneyField('zakat-custom-nisab', 'Custom Nisab', input.customNisab, (customNisab) =>
            set({ customNisab }),
          )
        ) : null}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="zakat-gold-price">
              Gold price per gram
            </label>
            <input
              id="zakat-gold-price"
              className={controlClass}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={gold.ok ? gold.pricePerGram : ''}
              onChange={(event) =>
                set({
                  goldPriceMode: 'manual',
                  manualGoldPricePerGram: event.target.value === '' ? 0 : Number(event.target.value),
                })
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {priceLabel(gold.ok ? gold.kind : 'unavailable')} Weight for this Nisab: {GOLD_NISAB_GRAMS} g.
            </p>
          </div>
          <div>
            <label className={labelClass} htmlFor="zakat-silver-price">
              Silver price per gram
            </label>
            <input
              id="zakat-silver-price"
              className={controlClass}
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={silver.ok ? silver.pricePerGram : ''}
              onChange={(event) =>
                set({
                  silverPriceMode: 'manual',
                  manualSilverPricePerGram: event.target.value === '' ? 0 : Number(event.target.value),
                })
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {priceLabel(silver.ok ? silver.kind : 'unavailable')} Weight for this Nisab: {SILVER_NISAB_GRAMS} g.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => set({ goldPriceMode: 'reference', silverPriceMode: 'reference' })}
        >
          Use reference prices
        </Button>
        {result ? (
          <p className="text-sm text-foreground/90">
            Selected Nisab ({result.nisabMethod}): {formatCurrencyValue(result.nisabThreshold, input.currency)}
          </p>
        ) : null}
        {errors.nisab ? <p className="text-xs text-rose-600">{errors.nisab}</p> : null}
        {errors.prices ? <p className="text-xs text-rose-600">{errors.prices}</p> : null}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Cash</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {moneyField('zakat-bank', 'Cash in the bank', input.cashInBank, (cashInBank) => set({ cashInBank }))}
          {moneyField('zakat-hand', 'Cash in hand', input.cashInHand, (cashInHand) => set({ cashInHand }))}
          {moneyField('zakat-savings', 'Savings', input.savings, (savings) => set({ savings }))}
          {moneyField('zakat-loans-out', 'Cash given out as loans', input.loansReceivable, (loansReceivable) =>
            set({ loansReceivable }),
          )}
          {moneyField('zakat-trade-cash', 'Cash for trade', input.cashForTrade, (cashForTrade) =>
            set({ cashForTrade }),
          )}
          {moneyField('zakat-investments', 'Investments', input.investments, (investments) => set({ investments }))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Liabilities</h3>
        <p className="text-xs text-muted-foreground">
          Deduct debts you treat as immediately payable. Do not enter the whole remaining balance of a long-term loan unless your method deducts that amount now.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {moneyField('zakat-loans-taken', 'Loans taken', input.loansTaken, (loansTaken) => set({ loansTaken }))}
          {moneyField('zakat-debts', 'Debts payable', input.debtsPayable, (debtsPayable) => set({ debtsPayable }))}
          {moneyField('zakat-payments', 'Payments due', input.paymentsDue, (paymentsDue) => set({ paymentsDue }))}
        </div>
        {errors.liabilities ? <p className="text-xs text-rose-600">{errors.liabilities}</p> : null}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Valuables and trade goods</h3>
        <p className="text-xs text-muted-foreground">
          Personal-use items such as a home you live in, ordinary clothes, and household goods are not included. Enter each trade asset once. Gold and silver value is weight × purity × the price above.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {moneyField('zakat-gold-g', 'Gold weight (grams)', input.goldGrams, (goldGrams) => set({ goldGrams }))}
          {moneyField('zakat-gold-purity', 'Gold purity (%)', input.goldPurityPercent, (goldPurityPercent) =>
            set({ goldPurityPercent }),
          )}
          {moneyField('zakat-silver-g', 'Silver weight (grams)', input.silverGrams, (silverGrams) =>
            set({ silverGrams }),
          )}
          {moneyField('zakat-silver-purity', 'Silver purity (%)', input.silverPurityPercent, (silverPurityPercent) =>
            set({ silverPurityPercent }),
          )}
          {moneyField('zakat-stocks', 'Value of stocks', input.stocks, (stocks) => set({ stocks }))}
          {moneyField('zakat-inventory', 'Trade inventory', input.tradeInventory, (tradeInventory) =>
            set({ tradeInventory }),
          )}
          {moneyField('zakat-other', 'Other eligible Zakatable assets', input.otherAssets, (otherAssets) =>
            set({ otherAssets }),
          )}
        </div>
        {result ? (
          <p className="text-sm text-foreground/90">
            Gold value {formatCurrencyValue(result.goldValue, input.currency)} · Silver value{' '}
            {formatCurrencyValue(result.silverValue, input.currency)}
          </p>
        ) : null}
        {errors.assets ? <p className="text-xs text-rose-600">{errors.assets}</p> : null}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
        <h3 className="text-sm font-semibold text-accent">Lunar year (Hawl)</h3>
        <fieldset>
          <legend className={labelClass}>Has your wealth completed one lunar year?</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            {(
              [
                ['yes', 'Yes'],
                ['no', 'No'],
                ['not-sure', 'Not sure'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="zakat-hawl"
                  className="h-4 w-4 accent-primary"
                  checked={input.hawl === value}
                  onChange={() => set({ hawl: value as HawlStatus })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-xs text-muted-foreground">
          The estimate stays visible either way. If the year is not complete, do not treat the amount as currently payable.
        </p>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11">
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
        <section aria-live="polite" className="space-y-2 rounded-xl border border-border bg-white p-3.5">
          <h3 className="text-sm font-semibold text-accent">Results</h3>
          <p className="text-2xl font-semibold tabular-nums text-accent">
            {formatCurrencyValue(result.zakatPayable, result.currency)}
          </p>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total Zakatable assets</dt>
              <dd className="font-medium tabular-nums">{formatCurrencyValue(result.totalAssets, result.currency)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total deductible liabilities</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrencyValue(result.totalLiabilities, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Net Zakatable wealth</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrencyValue(result.netZakatableWealth, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Selected Nisab threshold</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrencyValue(result.nisabThreshold, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Nisab eligibility</dt>
              <dd className="font-medium">{result.meetsNisab ? 'Meets Nisab' : 'Below Nisab'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Zakat rate</dt>
              <dd className="font-medium">2.5%</dd>
            </div>
          </dl>
          <p className="text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
        </section>
      ) : null}
    </form>
  );
}
