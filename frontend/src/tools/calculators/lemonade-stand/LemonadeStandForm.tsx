'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  CUP_SIZE_OPTIONS,
  type LemonadeStandDraft,
  type LemonadeStandFieldErrors,
  type LemonadeStandResult,
  type YesNo,
} from './types';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function RadioYesNo({
  name,
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
}: {
  name: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup">
      {(
        [
          { id: 'no', label: noLabel },
          { id: 'yes', label: yesLabel },
        ] as const
      ).map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
            value === opt.id
              ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
              : 'border-border bg-white text-muted-foreground'
          }`}
        >
          <input
            type="radio"
            name={name}
            className="accent-[hsl(var(--primary))]"
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  badge,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          {title}
          {badge ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {badge}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="space-y-4 border-t border-border px-4 py-4">{children}</div> : null}
    </div>
  );
}

interface LemonadeStandFormProps {
  draft: LemonadeStandDraft;
  errors: LemonadeStandFieldErrors;
  result: LemonadeStandResult | null;
  sectionOpen: Record<string, boolean>;
  onDraftChange: (draft: LemonadeStandDraft) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onToggleSection: (key: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function LemonadeStandForm({
  draft,
  errors,
  result,
  sectionOpen,
  onDraftChange,
  onCurrencyChange,
  onToggleSection,
  onSubmit,
  onReset,
}: LemonadeStandFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const set = (patch: Partial<LemonadeStandDraft>) => onDraftChange({ ...draft, ...patch });

  const moneyInput = (
    id: string,
    label: string,
    value: string,
    errorKey: string,
    onValue: (value: string) => void,
    readOnly = false
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[errorKey]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} ${readOnly ? 'cursor-default font-semibold' : ''}`}
            inputMode="decimal"
            readOnly={readOnly}
            value={value}
            aria-invalid={Boolean(errors[errorKey])}
            onChange={(event) => onValue(event.target.value)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={draft.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[errorKey] ? (
        <p className="mt-1 text-xs text-rose-600">{errors[errorKey]}</p>
      ) : null}
    </div>
  );

  const cupsDisplay =
    result?.cupsDisplay ??
    (draft.modifyCupCosts === 'yes' ? draft.cupsTotalOverride : '');

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <p className="text-sm text-muted-foreground">
        Predict profit or loss from a lemonade stand: servings, cups, permits, ingredients, and
        selling price. Enter your own costs—nothing is invented for you.
      </p>

      <Section
        title="Target goal"
        open={sectionOpen.target !== false}
        onToggle={() => onToggleSection('target')}
      >
        <div>
          <p className={labelClass}>Do you have a target goal?</p>
          <RadioYesNo
            name="lemonade-target"
            value={draft.hasTargetGoal}
            onChange={(hasTargetGoal) => set({ hasTargetGoal })}
          />
        </div>
        {draft.hasTargetGoal === 'yes'
          ? moneyInput(
              'lemonade-target-profit',
              'Target profit',
              draft.targetProfit,
              'targetProfit',
              (targetProfit) => set({ targetProfit })
            )
          : null}
      </Section>

      <Section
        title="How much lemonade do you want to sell?"
        open={sectionOpen.volume !== false}
        onToggle={() => onToggleSection('volume')}
      >
        <div>
          <label htmlFor="lemonade-servings" className={labelClass}>
            I want to sell
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.servings}>
              <input
                id="lemonade-servings"
                className={inputClass}
                inputMode="numeric"
                value={draft.servings}
                aria-invalid={Boolean(errors.servings)}
                onChange={(event) => set({ servings: event.target.value })}
              />
            </FieldShell>
            <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
              servings
            </span>
          </div>
          {errors.servings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.servings}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lemonade-cup-size" className={labelClass}>
            Size of serving cup
          </label>
          <Select
            id="lemonade-cup-size"
            className="h-11"
            value={draft.cupSize}
            onChange={(event) =>
              set({ cupSize: event.target.value as LemonadeStandDraft['cupSize'] })
            }
          >
            {CUP_SIZE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        {draft.modifyCupCosts === 'no'
          ? moneyInput(
              'lemonade-cost-per-cup',
              'Cost per cup',
              draft.costPerCup,
              'costPerCup',
              (costPerCup) => set({ costPerCup })
            )
          : null}

        {moneyInput(
          'lemonade-cups-total',
          'Total cost of cups',
          draft.modifyCupCosts === 'yes'
            ? draft.cupsTotalOverride
            : result?.cupsDisplay ?? cupsDisplay,
          draft.modifyCupCosts === 'yes' ? 'cupsTotalOverride' : 'costPerCup',
          (cupsTotalOverride) => set({ cupsTotalOverride }),
          draft.modifyCupCosts === 'no'
        )}

        <div>
          <p className={labelClass}>Would you like to modify the cost of cups?</p>
          <RadioYesNo
            name="lemonade-modify-cups"
            value={draft.modifyCupCosts}
            onChange={(modifyCupCosts) => set({ modifyCupCosts })}
          />
        </div>
      </Section>

      <Section
        title="Permit requirement"
        open={sectionOpen.permit !== false}
        onToggle={() => onToggleSection('permit')}
      >
        <p className="text-sm text-muted-foreground">
          Permit rules vary by location. Enter a permit cost only if you need one.
        </p>
        <div>
          <p className={labelClass}>Does your state require a permit?</p>
          <RadioYesNo
            name="lemonade-permit"
            value={draft.requiresPermit}
            onChange={(requiresPermit) => set({ requiresPermit })}
          />
        </div>
        {draft.requiresPermit === 'yes'
          ? moneyInput(
              'lemonade-permit-cost',
              'Permit cost',
              draft.permitCost,
              'permitCost',
              (permitCost) => set({ permitCost })
            )
          : null}
      </Section>

      <Section
        title="Ingredients cost"
        open={sectionOpen.ingredients !== false}
        onToggle={() => onToggleSection('ingredients')}
      >
        <div>
          <p className={labelClass}>Do you already know the total cost?</p>
          <div className="flex flex-col gap-2" role="radiogroup">
            {(
              [
                { id: 'known', label: 'Yes!' },
                { id: 'recipe', label: "No, I'd like to choose a recipe" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  draft.ingredientsMode === opt.id
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="lemonade-ingredients-mode"
                  className="accent-[hsl(var(--primary))]"
                  checked={draft.ingredientsMode === opt.id}
                  onChange={() => set({ ingredientsMode: opt.id })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {draft.ingredientsMode === 'known'
          ? moneyInput(
              'lemonade-ingredients',
              'Cost of ingredients',
              draft.ingredientsCost,
              'ingredientsCost',
              (ingredientsCost) => set({ ingredientsCost })
            )
          : (
              <>
                {moneyInput(
                  'lemonade-lemons',
                  'Lemons',
                  draft.lemonsCost,
                  'lemonsCost',
                  (lemonsCost) => set({ lemonsCost })
                )}
                {moneyInput(
                  'lemonade-sugar',
                  'Sugar',
                  draft.sugarCost,
                  'sugarCost',
                  (sugarCost) => set({ sugarCost })
                )}
                {moneyInput(
                  'lemonade-water',
                  'Water / other',
                  draft.waterCost,
                  'waterCost',
                  (waterCost) => set({ waterCost })
                )}
              </>
            )}

        {moneyInput(
          'lemonade-ingredients-total',
          'Total cost',
          result?.totalCostDisplay ?? '',
          'form',
          () => undefined,
          true
        )}
      </Section>

      <Section
        title="Other indirect costs"
        open={sectionOpen.other === true}
        onToggle={() => onToggleSection('other')}
        badge={draft.otherCosts.trim() ? '1' : undefined}
      >
        {moneyInput(
          'lemonade-other',
          'Other costs',
          draft.otherCosts,
          'otherCosts',
          (otherCosts) => set({ otherCosts })
        )}
      </Section>

      <Section
        title="Profit calculation"
        open={sectionOpen.profit !== false}
        onToggle={() => onToggleSection('profit')}
      >
        {moneyInput(
          'lemonade-cps',
          'Cost per serving',
          result?.costPerServingDisplay ?? '',
          'form',
          () => undefined,
          true
        )}
        {moneyInput(
          'lemonade-price',
          'I want to sell each serving for',
          draft.sellingPrice,
          'sellingPrice',
          (sellingPrice) => set({ sellingPrice })
        )}
        {moneyInput(
          'lemonade-profit',
          'Total profit',
          result?.profitDisplay ?? '',
          'form',
          () => undefined,
          true
        )}
        {result ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
        ) : null}
      </Section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
