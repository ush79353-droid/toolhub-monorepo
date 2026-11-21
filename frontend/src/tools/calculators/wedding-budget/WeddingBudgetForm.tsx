'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  createCustomExpenseLine,
  type CustomExpenseLine,
  type ExpenseFieldKey,
  type MoneyAmount,
  type SectionId,
  type WeddingBudgetFieldErrors,
  type WeddingBudgetInput,
  type WeddingBudgetResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface WeddingBudgetFormProps {
  input: WeddingBudgetInput;
  errors: WeddingBudgetFieldErrors;
  result: WeddingBudgetResult | null;
  onChange: (input: WeddingBudgetInput) => void;
}

export function WeddingBudgetForm({
  input,
  errors,
  result,
  onChange,
}: WeddingBudgetFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  const set = (patch: Partial<WeddingBudgetInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const convertFieldAmount = (
    raw: string,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): string | null => {
    const amount = parseMoneyInput(raw);
    if (!Number.isFinite(amount)) return raw;
    if (!canConvertPair(from, to)) return null;
    const converted = convertCurrency({
      amount,
      from,
      to,
      rates: rates.rates,
    });
    if (!converted.ok) return null;
    return moneyAmountToInputString(converted.amount);
  };

  const setMoney = (key: 'plannedBudget' | ExpenseFieldKey, patch: Partial<MoneyAmount>) => {
    const current = input[key];
    if (patch.currency && patch.currency !== current.currency) {
      const nextAmount = convertFieldAmount(
        current.amount,
        current.currency,
        patch.currency
      );
      if (nextAmount === null) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      set({
        [key]: {
          amount: nextAmount,
          currency: patch.currency,
        },
      } as Partial<WeddingBudgetInput>);
      return;
    }
    set({
      [key]: { ...current, ...patch },
    } as Partial<WeddingBudgetInput>);
  };

  const toggleSection = (id: SectionId) => {
    set({
      openSections: {
        ...input.openSections,
        [id]: !input.openSections[id],
      },
    });
  };

  const addCustom = () => {
    set({
      customExpenses: [...input.customExpenses, createCustomExpenseLine()],
      openSections: { ...input.openSections, custom: true },
    });
  };

  const updateCustom = (id: string, patch: Partial<CustomExpenseLine>) => {
    set({
      customExpenses: input.customExpenses.map((line) => {
        if (line.id !== id) return line;
        if (patch.currency && patch.currency !== line.currency) {
          const nextAmount = convertFieldAmount(
            line.amount,
            line.currency,
            patch.currency
          );
          if (nextAmount === null) {
            setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
            return line;
          }
          setConversionError(null);
          return { ...line, ...patch, amount: nextAmount, currency: patch.currency };
        }
        return { ...line, ...patch };
      }),
    });
  };

  const removeCustom = (id: string) => {
    set({ customExpenses: input.customExpenses.filter((line) => line.id !== id) });
  };

  const calcSymbol = result
    ? getCurrencySymbol(result.calcCurrency)
    : getCurrencySymbol(input.plannedBudget.currency);

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-foreground/90">
        Enter your planned budget, guest count, and wedding expenses. Each money field has its
        own currency; amounts normalize into the planned-budget currency before totals. Guest
        count is never FX-converted.
      </p>

      <Section
        id="weddingInfo"
        title="Wedding info"
        open={input.openSections.weddingInfo}
        onToggle={() => toggleSection('weddingInfo')}
      >
        <MoneyRow
          id="wb-planned"
          label="How much do you want to spend?"
          tip="Total planned wedding budget. Expense currencies normalize into this currency."
          line={input.plannedBudget}
          error={errors.plannedBudget}
          onAmount={(amount) => setMoney('plannedBudget', { amount })}
          onCurrency={(currency) => setMoney('plannedBudget', { currency })}
        />
        <div>
          <label className={labelClass} htmlFor="wb-guests">
            <span>Number of guests</span>
            <InfoTooltip
              label="Number of guests"
              text="Must be greater than zero. Used only for cost per guest; never FX-converted."
            />
          </label>
          <FieldShell error={errors.guestCount}>
            <input
              id="wb-guests"
              className={inputClass}
              inputMode="decimal"
              value={input.guestCount}
              aria-invalid={Boolean(errors.guestCount)}
              onChange={(e) => set({ guestCount: e.target.value })}
            />
          </FieldShell>
          {errors.guestCount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.guestCount}</p>
          ) : null}
        </div>
      </Section>

      <Section
        id="brideGroom"
        title="Bride and groom"
        open={input.openSections.brideGroom}
        onToggle={() => toggleSection('brideGroom')}
        total={result ? `${result.formattedBrideGroomTotal}` : null}
        totalSymbol={calcSymbol}
      >
        <MoneyRow
          id="wb-dress"
          label="Bride's dress"
          tip="Cost of the bride's dress or gown."
          line={input.bridesDress}
          error={errors.bridesDress}
          onAmount={(amount) => setMoney('bridesDress', { amount })}
          onCurrency={(currency) => setMoney('bridesDress', { currency })}
        />
        <MoneyRow
          id="wb-jewellery"
          label="Jewellery"
          tip="Bride and groom jewellery for the wedding."
          line={input.jewellery}
          error={errors.jewellery}
          onAmount={(amount) => setMoney('jewellery', { amount })}
          onCurrency={(currency) => setMoney('jewellery', { currency })}
        />
        <MoneyRow
          id="wb-suit"
          label="Groom's suit and accessories"
          tip="Groom attire and accessories."
          line={input.groomsSuit}
          error={errors.groomsSuit}
          onAmount={(amount) => setMoney('groomsSuit', { amount })}
          onCurrency={(currency) => setMoney('groomsSuit', { currency })}
        />
        <MoneyRow
          id="wb-rings"
          label="Wedding rings"
          tip="Wedding bands / rings."
          line={input.weddingRings}
          error={errors.weddingRings}
          onAmount={(amount) => setMoney('weddingRings', { amount })}
          onCurrency={(currency) => setMoney('weddingRings', { currency })}
        />
        <MoneyRow
          id="wb-hair"
          label="Hair and makeup"
          tip="Hair styling and makeup services."
          line={input.hairAndMakeup}
          error={errors.hairAndMakeup}
          onAmount={(amount) => setMoney('hairAndMakeup', { amount })}
          onCurrency={(currency) => setMoney('hairAndMakeup', { currency })}
        />
      </Section>

      <Section
        id="subcontractors"
        title="Subcontractors"
        open={input.openSections.subcontractors}
        onToggle={() => toggleSection('subcontractors')}
        total={result ? result.formattedSubcontractorsTotal : null}
        totalSymbol={calcSymbol}
      >
        <MoneyRow
          id="wb-stationery"
          label="Wedding stationery"
          tip="Invitations, programs, place cards, and related print."
          line={input.weddingStationery}
          error={errors.weddingStationery}
          onAmount={(amount) => setMoney('weddingStationery', { amount })}
          onCurrency={(currency) => setMoney('weddingStationery', { currency })}
        />
        <MoneyRow
          id="wb-photo"
          label="Photography & video"
          tip="Photographer and videographer packages."
          line={input.photographyVideo}
          error={errors.photographyVideo}
          onAmount={(amount) => setMoney('photographyVideo', { amount })}
          onCurrency={(currency) => setMoney('photographyVideo', { currency })}
        />
        <MoneyRow
          id="wb-florist"
          label="Florist"
          tip="Floral arrangements and décor from a florist."
          line={input.florist}
          error={errors.florist}
          onAmount={(amount) => setMoney('florist', { amount })}
          onCurrency={(currency) => setMoney('florist', { currency })}
        />
        <MoneyRow
          id="wb-planner"
          label="Wedding planner"
          tip="Planner or coordinator fees."
          line={input.weddingPlanner}
          error={errors.weddingPlanner}
          onAmount={(amount) => setMoney('weddingPlanner', { amount })}
          onCurrency={(currency) => setMoney('weddingPlanner', { currency })}
        />
      </Section>

      <Section
        id="venueFood"
        title="Venue, food and drinks"
        open={input.openSections.venueFood}
        onToggle={() => toggleSection('venueFood')}
        total={result ? result.formattedVenueFoodTotal : null}
        totalSymbol={calcSymbol}
      >
        <MoneyRow
          id="wb-venue"
          label="Venue"
          tip="Reception or event venue hire."
          line={input.venue}
          error={errors.venue}
          onAmount={(amount) => setMoney('venue', { amount })}
          onCurrency={(currency) => setMoney('venue', { currency })}
        />
        <MoneyRow
          id="wb-rehearsal"
          label="Rehearsal dinner"
          tip="Rehearsal dinner costs."
          line={input.rehearsalDinner}
          error={errors.rehearsalDinner}
          onAmount={(amount) => setMoney('rehearsalDinner', { amount })}
          onCurrency={(currency) => setMoney('rehearsalDinner', { currency })}
        />
        <MoneyRow
          id="wb-catering"
          label="Catering"
          tip="Food catering for guests."
          line={input.catering}
          error={errors.catering}
          onAmount={(amount) => setMoney('catering', { amount })}
          onCurrency={(currency) => setMoney('catering', { currency })}
        />
        <MoneyRow
          id="wb-cake"
          label="Wedding cake"
          tip="Wedding cake and dessert table items if paid separately."
          line={input.weddingCake}
          error={errors.weddingCake}
          onAmount={(amount) => setMoney('weddingCake', { amount })}
          onCurrency={(currency) => setMoney('weddingCake', { currency })}
        />
        <MoneyRow
          id="wb-dj"
          label="Ceremony musicians / DJs"
          tip="Live musicians or DJ entertainment."
          line={input.musiciansDj}
          error={errors.musiciansDj}
          onAmount={(amount) => setMoney('musiciansDj', { amount })}
          onCurrency={(currency) => setMoney('musiciansDj', { currency })}
        />
        <MoneyRow
          id="wb-liquors"
          label="Liquors"
          tip="Alcohol and bar service costs."
          line={input.liquors}
          error={errors.liquors}
          onAmount={(amount) => setMoney('liquors', { amount })}
          onCurrency={(currency) => setMoney('liquors', { currency })}
        />
      </Section>

      <Section
        id="ceremony"
        title="Ceremony"
        open={input.openSections.ceremony}
        onToggle={() => toggleSection('ceremony')}
        total={result ? result.formattedCeremonyTotal : null}
        totalSymbol={calcSymbol}
      >
        <MoneyRow
          id="wb-site"
          label="Ceremony site"
          tip="Ceremony location fee if separate from the reception venue."
          line={input.ceremonySite}
          error={errors.ceremonySite}
          onAmount={(amount) => setMoney('ceremonySite', { amount })}
          onCurrency={(currency) => setMoney('ceremonySite', { currency })}
        />
        <MoneyRow
          id="wb-officiant"
          label="Officiant"
          tip="Officiant or celebrant fee."
          line={input.officiant}
          error={errors.officiant}
          onAmount={(amount) => setMoney('officiant', { amount })}
          onCurrency={(currency) => setMoney('officiant', { currency })}
        />
      </Section>

      <Section
        id="transport"
        title="Transportation and accommodation"
        open={input.openSections.transport}
        onToggle={() => toggleSection('transport')}
        total={result ? result.formattedTransportTotal : null}
        totalSymbol={calcSymbol}
      >
        <MoneyRow
          id="wb-hotel"
          label="Hotel"
          tip="Hotel rooms for the couple or wedding party."
          line={input.hotel}
          error={errors.hotel}
          onAmount={(amount) => setMoney('hotel', { amount })}
          onCurrency={(currency) => setMoney('hotel', { currency })}
        />
        <MoneyRow
          id="wb-limo"
          label="Limo rental and transportation"
          tip="Limousine, cars, and other wedding-day transport."
          line={input.limoTransport}
          error={errors.limoTransport}
          onAmount={(amount) => setMoney('limoTransport', { amount })}
          onCurrency={(currency) => setMoney('limoTransport', { currency })}
        />
      </Section>

      <div className="rounded-xl border border-border bg-white">
        <button
          type="button"
          className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={input.openSections.custom}
          onClick={() => toggleSection('custom')}
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.openSections.custom ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
          <span>Custom expenses</span>
          {result ? (
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {result.formattedCustomTotal}
            </span>
          ) : null}
        </button>
        {input.openSections.custom ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
            {input.customExpenses.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No custom expenses yet. Add lines for anything outside the sections above.
              </p>
            ) : null}
            {input.customExpenses.map((line, index) => (
              <div
                key={line.id}
                className="space-y-2 rounded-lg border border-border bg-muted/10 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-accent">Expense #{index + 1}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                    onClick={() => removeCustom(line.id)}
                    aria-label={`Remove custom expense ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`wb-custom-label-${line.id}`}>
                    Label
                  </label>
                  <FieldShell>
                    <input
                      id={`wb-custom-label-${line.id}`}
                      className={inputClass}
                      value={line.label}
                      placeholder="e.g. Favors"
                      onChange={(e) => updateCustom(line.id, { label: e.target.value })}
                    />
                  </FieldShell>
                </div>
                <MoneyRow
                  id={`wb-custom-amt-${line.id}`}
                  label="Amount"
                  tip="Custom wedding expense amount."
                  line={{ amount: line.amount, currency: line.currency }}
                  onAmount={(amount) => updateCustom(line.id, { amount })}
                  onCurrency={(currency) => updateCustom(line.id, { currency })}
                />
              </div>
            ))}
            {errors.customExpenses ? (
              <p className="text-xs text-rose-600">{errors.customExpenses}</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-border text-xs font-semibold text-accent"
              onClick={addCustom}
            >
              <Plus className="mr-1.5 h-4 w-4" aria-hidden />
              Add custom expense
            </Button>
          </div>
        ) : null}
      </div>

      <ResultsPanel result={result} />

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {conversionError ? (
        <p className="text-xs text-rose-600">{conversionError}</p>
      ) : null}
      {!ratesStatus.available ? (
        <p className="text-xs text-amber-700">{CURRENCY_CONVERSION_UNAVAILABLE_NOTE}</p>
      ) : null}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  total,
  totalSymbol,
  children,
}: {
  id: SectionId;
  title: string;
  open: boolean;
  onToggle: () => void;
  total?: string | null;
  totalSymbol?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? '' : '-rotate-90'
          }`}
          aria-hidden
        />
        <span>{title}</span>
        {total ? (
          <span className="ml-auto text-xs font-medium tabular-nums text-muted-foreground">
            {totalSymbol ? `${total}` : total}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
          {children}
          {total ? (
            <div>
              <p className={labelClass}>Total</p>
              <FieldShell muted>
                <input
                  className={inputClass}
                  readOnly
                  value={total}
                  aria-live="polite"
                />
              </FieldShell>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MoneyRow({
  id,
  label,
  tip,
  line,
  error,
  onAmount,
  onCurrency,
}: {
  id: string;
  label: string;
  tip: string;
  line: MoneyAmount;
  error?: string;
  onAmount: (amount: string) => void;
  onCurrency: (currency: SupportedCurrency) => void;
}) {
  const symbol = getCurrencySymbol(line.currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex items-center gap-2">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={line.amount}
            aria-invalid={Boolean(error)}
            onChange={(e) => onAmount(e.target.value)}
          />
        </FieldShell>
        <CurrencySelect
          id={`${id}-currency`}
          value={line.currency}
          onChange={onCurrency}
          aria-label={`${label} currency`}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ResultsPanel({ result }: { result: WeddingBudgetResult | null }) {
  if (!result) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-sm text-muted-foreground">
        Enter a planned budget, guest count, and expenses to see cost per guest and budget
        balance.
      </div>
    );
  }

  const balanceTone =
    result.balanceStatus === 'over'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : result.balanceStatus === 'under'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-800';

  return (
    <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <dl className="space-y-2">
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-2">
          <dt className="text-xs text-muted-foreground">Total average cost per guest</dt>
          <dd className="text-sm font-semibold tabular-nums text-accent">
            {result.formattedCostPerGuest}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-2">
          <dt className="text-xs text-muted-foreground">Wedding budget balance</dt>
          <dd className="text-sm font-semibold tabular-nums text-accent">
            {result.formattedBudgetBalance}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-xs text-muted-foreground">Total wedding cost</dt>
          <dd className="text-sm font-semibold tabular-nums text-accent">
            {result.formattedTotalWeddingCost}
          </dd>
        </div>
      </dl>
      <div
        className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${balanceTone}`}
      >
        {result.balanceStatus === 'over' ? (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        )}
        <p>{result.statusMessage}</p>
      </div>
    </div>
  );
}
