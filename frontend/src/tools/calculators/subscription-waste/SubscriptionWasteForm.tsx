'use client';

import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { formatMoney } from './calculation';
import {
  BILLING_FREQUENCY_OPTIONS,
  SUBSCRIPTION_CATEGORIES,
  createEmptyEntry,
  type BillingFrequency,
  type SubscriptionCategoryId,
  type SubscriptionEntry,
  type SubscriptionWasteFieldErrors,
  type SubscriptionWasteInput,
  type SubscriptionWasteResult,
} from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-10 w-full min-w-0 bg-transparent px-2.5 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-10 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

interface SubscriptionWasteFormProps {
  input: SubscriptionWasteInput;
  errors: SubscriptionWasteFieldErrors;
  result: SubscriptionWasteResult | null;
  onChange: (next: SubscriptionWasteInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function SubscriptionWasteForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: SubscriptionWasteFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<SubscriptionWasteInput>) => {
    onChange({ ...input, ...patch });
  };

  const updateCategory = (
    categoryId: SubscriptionCategoryId,
    entries: SubscriptionEntry[],
  ) => {
    set({
      entries: {
        ...input.entries,
        [categoryId]: entries,
      },
    });
  };

  const patchEntry = (
    categoryId: SubscriptionCategoryId,
    id: string,
    patch: Partial<SubscriptionEntry>,
  ) => {
    updateCategory(
      categoryId,
      input.entries[categoryId].map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    );
  };

  const addEntry = (categoryId: SubscriptionCategoryId) => {
    updateCategory(categoryId, [
      ...input.entries[categoryId],
      createEmptyEntry(),
    ]);
  };

  const removeEntry = (categoryId: SubscriptionCategoryId, id: string) => {
    updateCategory(
      categoryId,
      input.entries[categoryId].filter((entry) => entry.id !== id),
    );
  };

  const toggleCategory = (categoryId: SubscriptionCategoryId, open: boolean) => {
    set({
      openCategories: {
        ...input.openCategories,
        [categoryId]: open,
      },
    });
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
          List recurring subscriptions by category to see monthly and annual
          totals — and optional savings if you cancel unused plans.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.readMeOpen}
        onToggle={(e) => set({ readMeOpen: e.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.readMeOpen ? '' : '-rotate-90'
            }`}
            aria-hidden
          />
          <span>Read me</span>
        </summary>
        <div className="space-y-2 border-t border-border px-3.5 pb-3.5 pt-3 text-xs leading-relaxed text-muted-foreground sm:px-4 sm:text-sm">
          <p>
            Add recurring subscriptions to discover how much you spend each month
            and year.
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Enter the name of each subscription service.</li>
            <li>Enter its recurring cost and billing frequency.</li>
            <li>Organize subscriptions by category.</li>
            <li>Leave unused slots empty — they are ignored.</li>
            <li>Review total monthly and annual spending.</li>
            <li>
              Mark services to cancel to estimate potential savings without
              deleting them.
            </li>
          </ul>
        </div>
      </details>

      <div>
        <label className={labelClass} htmlFor="sw-currency">
          Display currency
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="sw-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      {SUBSCRIPTION_CATEGORIES.map((cat) => {
        const open = input.openCategories[cat.id] ?? false;
        const entries = input.entries[cat.id];
        const catTotal =
          result?.categoryBreakdown.find((r) => r.categoryId === cat.id)
            ?.monthlyTotal ?? null;

        return (
          <details
            key={cat.id}
            className="rounded-xl border border-border bg-muted/15"
            open={open}
            onToggle={(e) => toggleCategory(cat.id, e.currentTarget.open)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                    open ? '' : '-rotate-90'
                  }`}
                  aria-hidden
                />
                {cat.label}
              </span>
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {catTotal !== null
                  ? `${formatMoney(catTotal, input.currency)}/mo`
                  : '—'}
              </span>
            </summary>
            <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4">
              {entries.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No subscriptions yet. Add one below.
                </p>
              ) : null}
              {entries.map((entry, index) => {
                const needsCustom =
                  entry.serviceKey === 'Other' || entry.serviceKey === '';
                const entryError = errors.entries?.[entry.id];
                return (
                  <div
                    key={entry.id}
                    className="space-y-2 rounded-lg border border-border bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-accent">
                        Service #{index + 1}
                      </p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                        onClick={() => removeEntry(cat.id, entry.id)}
                        aria-label={`Remove service ${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    </div>
                    <div>
                      <label
                        className={labelClass}
                        htmlFor={`sw-svc-${entry.id}`}
                      >
                        Service name
                      </label>
                      <select
                        id={`sw-svc-${entry.id}`}
                        className={selectClass}
                        value={entry.serviceKey}
                        onChange={(e) =>
                          patchEntry(cat.id, entry.id, {
                            serviceKey: e.target.value,
                          })
                        }
                      >
                        <option value="">Select service</option>
                        {cat.services.map((svc) => (
                          <option key={svc} value={svc}>
                            {svc}
                          </option>
                        ))}
                      </select>
                    </div>
                    {needsCustom ? (
                      <div>
                        <label
                          className={labelClass}
                          htmlFor={`sw-custom-${entry.id}`}
                        >
                          Custom service name
                        </label>
                        <div className="flex h-10 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                          <input
                            id={`sw-custom-${entry.id}`}
                            className={inputClass}
                            value={entry.customName}
                            onChange={(e) =>
                              patchEntry(cat.id, entry.id, {
                                customName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ) : null}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <label
                          className={labelClass}
                          htmlFor={`sw-amt-${entry.id}`}
                        >
                          Cost
                        </label>
                        <div
                          className={`flex h-10 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
                            entryError ? 'border-rose-400' : ''
                          }`}
                        >
                          <span className="pl-2.5 text-sm text-muted-foreground">
                            {symbol}
                          </span>
                          <input
                            id={`sw-amt-${entry.id}`}
                            className={inputClass}
                            inputMode="decimal"
                            value={entry.amount}
                            aria-invalid={Boolean(entryError)}
                            onChange={(e) =>
                              patchEntry(cat.id, entry.id, {
                                amount: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={labelClass}
                          htmlFor={`sw-freq-${entry.id}`}
                        >
                          Billing
                        </label>
                        <select
                          id={`sw-freq-${entry.id}`}
                          className={selectClass}
                          value={entry.billingFrequency}
                          onChange={(e) =>
                            patchEntry(cat.id, entry.id, {
                              billingFrequency: e.target
                                .value as BillingFrequency,
                            })
                          }
                        >
                          {BILLING_FREQUENCY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-accent sm:text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={entry.selectedForCancellation}
                        onChange={(e) =>
                          patchEntry(cat.id, entry.id, {
                            selectedForCancellation: e.target.checked,
                          })
                        }
                      />
                      Mark for cancellation (potential savings)
                    </label>
                    {entryError ? (
                      <p className="text-xs text-rose-600">{entryError}</p>
                    ) : null}
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full gap-1.5 text-xs font-semibold"
                onClick={() => addEntry(cat.id)}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add subscription
              </Button>
            </div>
          </details>
        );
      })}

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
          aria-labelledby="sw-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="sw-results-heading" className="text-sm font-semibold text-accent">
            Total subscription spending
          </h3>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total cost per month</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.totalMonthlySpending, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total cost per year</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {formatMoney(result.totalAnnualSpending, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Potential monthly savings
              </dt>
              <dd className="font-medium tabular-nums text-emerald-700">
                {formatMoney(result.potentialMonthlySavings, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Potential annual savings
              </dt>
              <dd className="font-medium tabular-nums text-emerald-700">
                {formatMoney(result.potentialAnnualSavings, result.currency)}
              </dd>
            </div>
          </dl>
          <div>
            <p className="mb-2 text-xs font-semibold text-accent">
              Category breakdown (monthly)
            </p>
            <ul className="space-y-1.5 text-sm">
              {result.categoryBreakdown.map((row) => (
                <li
                  key={row.categoryId}
                  className="flex items-center justify-between gap-2 border-b border-border/60 py-1.5 last:border-0"
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="tabular-nums font-medium text-accent">
                    {formatMoney(row.monthlyTotal, result.currency)}/mo
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Add at least one complete subscription (service + cost) to see totals.
        </p>
      )}
    </form>
  );
}
