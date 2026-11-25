'use client';

import type { ReactNode } from 'react';
import { Select } from '@/components/ui/select';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatGrams, formatTeaspoons } from './calculation';
import {
  CANDY_OPTIONS,
  CEREAL_OPTIONS,
  DAIRY_OPTIONS,
  DRESSING_OPTIONS,
  DRINK_OPTIONS,
  HIDDEN_BREAD_OPTIONS,
  HIDDEN_SNACK_OPTIONS,
  OBVIOUS_BAKED_OPTIONS,
  type FoodOption,
} from './food-data';
import type {
  AddedSugarIntakeFieldErrors,
  AddedSugarIntakeInput,
  AddedSugarIntakeResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const unitFixed = 'shrink-0 pr-3 font-mono text-xs text-muted-foreground';

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
        error
          ? 'border-rose-400'
          : muted
            ? 'border-sky-200 bg-sky-50/60'
            : 'border-border bg-white'
      }`}
    >
      {children}
    </div>
  );
}

function FoodRow({
  label,
  options,
  productId,
  qtyText,
  qtyKey,
  unitLabel,
  errors,
  onProduct,
  onQty,
}: {
  label: string;
  options: readonly FoodOption[];
  productId: string;
  qtyText: string;
  qtyKey: keyof AddedSugarIntakeFieldErrors;
  unitLabel: string;
  errors: AddedSugarIntakeFieldErrors;
  onProduct: (id: string) => void;
  onQty: (v: string) => void;
}) {
  const err = errors[qtyKey];
  const selected = options.find((o) => o.id === productId);

  return (
    <div className="space-y-2 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <span className={labelClass}>{label}</span>
      <Select
        value={productId}
        onChange={(e) => onProduct(e.target.value)}
        className="h-11 text-sm text-accent"
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </Select>
      <p className="text-xs text-muted-foreground">
        Serving: {selected?.servingLabel ?? '—'} ·{' '}
        {selected?.gramsAddedSugarPerServing ?? '—'} g added sugar per serving
      </p>
      <div>
        <label className="sr-only" htmlFor={`qty-${qtyKey}`}>
          Quantity for {label}
        </label>
        <FieldShell error={err}>
          <input
            id={`qty-${qtyKey}`}
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={qtyText}
            onChange={(e) => onQty(e.target.value)}
            aria-invalid={Boolean(err)}
            placeholder="0"
          />
          <span className={unitFixed}>{unitLabel}</span>
        </FieldShell>
        {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
      </div>
    </div>
  );
}

interface FormProps {
  input: AddedSugarIntakeInput;
  errors: AddedSugarIntakeFieldErrors;
  result: AddedSugarIntakeResult | null;
  onChange: (input: AddedSugarIntakeInput) => void;
}

export function AddedSugarIntakeForm({
  input,
  errors,
  result,
  onChange,
}: FormProps) {
  const set = (patch: Partial<AddedSugarIntakeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Sex selection">
        <div>
          <label className={labelClass} htmlFor="sugar-sex">
            I am…
          </label>
          <Select
            id="sugar-sex"
            value={input.sex}
            onChange={(e) =>
              set({ sex: e.target.value as AddedSugarIntakeInput['sex'] })
            }
            className="h-11 text-sm"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Select>
        </div>
      </section>

      <section className={sectionClass} aria-label="Obvious sugars">
        <h3 className="text-sm font-semibold text-accent">Obvious sugars</h3>
        <FoodRow
          label="Drinks"
          options={DRINK_OPTIONS}
          productId={input.drinkId}
          qtyText={input.drinkQtyText}
          qtyKey="drinkQtyText"
          unitLabel="cup(s)"
          errors={errors}
          onProduct={(id) => set({ drinkId: id })}
          onQty={(v) => set({ drinkQtyText: v })}
        />
        <FoodRow
          label="Dairy"
          options={DAIRY_OPTIONS}
          productId={input.dairyId}
          qtyText={input.dairyQtyText}
          qtyKey="dairyQtyText"
          unitLabel="portion(s)"
          errors={errors}
          onProduct={(id) => set({ dairyId: id })}
          onQty={(v) => set({ dairyQtyText: v })}
        />
        <FoodRow
          label="Cereal"
          options={CEREAL_OPTIONS}
          productId={input.cerealId}
          qtyText={input.cerealQtyText}
          qtyKey="cerealQtyText"
          unitLabel="cup(s)"
          errors={errors}
          onProduct={(id) => set({ cerealId: id })}
          onQty={(v) => set({ cerealQtyText: v })}
        />
        <FoodRow
          label="Baked goods"
          options={OBVIOUS_BAKED_OPTIONS}
          productId={input.obviousBakedId}
          qtyText={input.obviousBakedQtyText}
          qtyKey="obviousBakedQtyText"
          unitLabel="piece(s)"
          errors={errors}
          onProduct={(id) => set({ obviousBakedId: id })}
          onQty={(v) => set({ obviousBakedQtyText: v })}
        />
        <FoodRow
          label="Candy"
          options={CANDY_OPTIONS}
          productId={input.candyId}
          qtyText={input.candyQtyText}
          qtyKey="candyQtyText"
          unitLabel="piece(s)"
          errors={errors}
          onProduct={(id) => set({ candyId: id })}
          onQty={(v) => set({ candyQtyText: v })}
        />
        <div>
          <label className={labelClass} htmlFor="tea-tsp">
            Sugar in tea / coffee
            <InfoTooltip text="Level teaspoons of table sugar added to hot drinks (4 g sugar per teaspoon)." />
          </label>
          <FieldShell error={errors.teaCoffeeTspText}>
            <input
              id="tea-tsp"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.teaCoffeeTspText}
              onChange={(e) => set({ teaCoffeeTspText: e.target.value })}
              placeholder="0"
            />
            <span className={unitFixed}>tsp</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="other-obvious">
            Other obvious sources
          </label>
          <FieldShell error={errors.otherObviousGramsText}>
            <input
              id="other-obvious"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.otherObviousGramsText}
              onChange={(e) => set({ otherObviousGramsText: e.target.value })}
              placeholder="0"
            />
            <span className={unitFixed}>g</span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-label="Hidden sugars">
        <h3 className="text-sm font-semibold text-accent">Hidden sugars</h3>
        <FoodRow
          label="Snacks"
          options={HIDDEN_SNACK_OPTIONS}
          productId={input.hiddenSnackId}
          qtyText={input.hiddenSnackQtyText}
          qtyKey="hiddenSnackQtyText"
          unitLabel="portion(s)"
          errors={errors}
          onProduct={(id) => set({ hiddenSnackId: id })}
          onQty={(v) => set({ hiddenSnackQtyText: v })}
        />
        <FoodRow
          label="Bread"
          options={HIDDEN_BREAD_OPTIONS}
          productId={input.hiddenBreadId}
          qtyText={input.hiddenBreadQtyText}
          qtyKey="hiddenBreadQtyText"
          unitLabel="piece(s)"
          errors={errors}
          onProduct={(id) => set({ hiddenBreadId: id })}
          onQty={(v) => set({ hiddenBreadQtyText: v })}
        />
        <FoodRow
          label="Dressing / sauce"
          options={DRESSING_OPTIONS}
          productId={input.dressingId}
          qtyText={input.dressingQtyText}
          qtyKey="dressingQtyText"
          unitLabel="tbsp"
          errors={errors}
          onProduct={(id) => set({ dressingId: id })}
          onQty={(v) => set({ dressingQtyText: v })}
        />
        <div>
          <label className={labelClass} htmlFor="other-hidden">
            Other hidden sources
          </label>
          <FieldShell error={errors.otherHiddenGramsText}>
            <input
              id="other-hidden"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.otherHiddenGramsText}
              onChange={(e) => set({ otherHiddenGramsText: e.target.value })}
              placeholder="0"
            />
            <span className={unitFixed}>g</span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-label="Results">
        <h3 className="text-sm font-semibold text-accent">Total added sugar</h3>
        <div>
          <label className={labelClass} htmlFor="total-g">
            Grams
          </label>
          <FieldShell muted>
            <input
              id="total-g"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.totalGrams != null ? formatGrams(result.totalGrams) : ''
              }
              aria-live="polite"
            />
            <span className={unitFixed}>g</span>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="total-tsp">
            Approx. teaspoons
          </label>
          <FieldShell muted>
            <input
              id="total-tsp"
              readOnly
              className={`${inputClass} text-muted-foreground`}
              value={
                result?.approximateTeaspoons != null
                  ? formatTeaspoons(result.approximateTeaspoons)
                  : ''
              }
            />
            <span className={unitFixed}>tsp</span>
          </FieldShell>
        </div>
        {result?.statusDetail ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.statusDetail}
          </p>
        ) : null}
      </section>
    </form>
  );
}