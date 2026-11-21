'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DURATION_UNIT_LABELS,
  FEMALE_METHOD_OPTIONS,
  MALE_METHOD_OPTIONS,
  type BirthControlFieldErrors,
  type BirthControlInput,
  type BirthControlResult,
  type DurationUnit,
  type FemaleMethod,
  type MaleMethod,
} from './types';
import {
  isCycleMethod,
  isLongActingMethod,
  needsCondomFields,
  showsCondomAddon,
} from './calculation';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const radioGroupClass = 'flex flex-wrap gap-2';
const radioBtnClass = (on: boolean) =>
  `inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors ${
    on
      ? 'border-primary bg-primary text-primary-foreground'
      : 'border-border bg-white text-accent hover:bg-muted/40'
  }`;

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
        muted ? 'border-border bg-sky-50/80' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

function MoneyRow({
  id,
  label,
  tooltip,
  value,
  currency,
  error,
  readOnly,
  onAmountChange,
  onCurrencyChange,
}: {
  id: string;
  label: string;
  tooltip?: string;
  value: string;
  currency: SupportedCurrency;
  error?: string;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}) {
  const symbol = getCurrencySymbol(currency);
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        {tooltip ? <InfoTooltip label={label} text={tooltip} /> : null}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error} muted={readOnly}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            onChange={
              readOnly || !onAmountChange
                ? undefined
                : (e) => onAmountChange(e.target.value)
            }
          />
        </FieldShell>
        <CurrencySelect
          value={currency}
          onChange={onCurrencyChange}
          aria-label={`${label} currency`}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function DurationRow({
  id,
  label,
  value,
  unit,
  error,
  onValueChange,
  onUnitChange,
}: {
  id: string;
  label: string;
  value: string;
  unit: DurationUnit;
  error?: string;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: DurationUnit) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={value}
            aria-invalid={Boolean(error)}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </FieldShell>
        <select
          className={`${selectClass} w-[7.5rem] shrink-0`}
          value={unit}
          aria-label={`${label} unit`}
          onChange={(e) => onUnitChange(e.target.value as DurationUnit)}
        >
          {(Object.keys(DURATION_UNIT_LABELS) as DurationUnit[]).map((u) => (
            <option key={u} value={u}>
              {DURATION_UNIT_LABELS[u]}
            </option>
          ))}
        </select>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export function BirthControlForm({
  input,
  errors,
  result,
  condomsOpen,
  onToggleCondoms,
  onChange,
}: {
  input: BirthControlInput;
  errors: BirthControlFieldErrors;
  result: BirthControlResult | null;
  condomsOpen: boolean;
  onToggleCondoms: () => void;
  onChange: (next: BirthControlInput) => void;
}) {
  const patch = (partial: Partial<BirthControlInput>) =>
    onChange({ ...input, ...partial });

  const showAddon = showsCondomAddon({
    sex: input.sex,
    femaleMethod: input.femaleMethod,
    maleMethod: input.maleMethod,
  });
  const showCondomFields = needsCondomFields({
    sex: input.sex,
    femaleMethod: input.femaleMethod,
    maleMethod: input.maleMethod,
    buyCondoms: input.buyCondoms,
  });

  return (
    <div className="space-y-4">
      <div className={sectionClass}>
        <p className="text-sm text-muted-foreground">
          This birth control calculator was designed to help you compare the{' '}
          <strong className="font-semibold text-accent">costs</strong> of
          different contraceptive options 💊
        </p>

        <div>
          <p className={labelClass}>Birth control for</p>
          <div className={radioGroupClass} role="radiogroup" aria-label="Birth control for">
            <button
              type="button"
              role="radio"
              aria-checked={input.sex === 'female'}
              className={radioBtnClass(input.sex === 'female')}
              onClick={() => patch({ sex: 'female' })}
            >
              Females
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={input.sex === 'male'}
              className={radioBtnClass(input.sex === 'male')}
              onClick={() => patch({ sex: 'male' })}
            >
              Males
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="bc-option">
            Birth control option
          </label>
          {input.sex === 'female' ? (
            <select
              id="bc-option"
              className={selectClass}
              value={input.femaleMethod}
              onChange={(e) =>
                patch({ femaleMethod: e.target.value as FemaleMethod })
              }
            >
              {FEMALE_METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <select
              id="bc-option"
              className={selectClass}
              value={input.maleMethod}
              onChange={(e) =>
                patch({ maleMethod: e.target.value as MaleMethod })
              }
            >
              {MALE_METHOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {input.sex === 'female' && isCycleMethod(input.femaleMethod) ? (
          <MoneyRow
            id="bc-cycle-cost"
            label="Cost per cycle"
            tooltip="The cost of a ring or the amount of pills or patches that would last for one menstruation cycle."
            value={input.costPerCycle}
            currency={input.costPerCycleCurrency}
            error={errors.costPerCycle}
            onAmountChange={(costPerCycle) => patch({ costPerCycle })}
            onCurrencyChange={(costPerCycleCurrency) =>
              patch({ costPerCycleCurrency })
            }
          />
        ) : null}

        {input.sex === 'female' && isLongActingMethod(input.femaleMethod) ? (
          <>
            <MoneyRow
              id="bc-long-price"
              label="Price"
              value={input.longActingPrice}
              currency={input.longActingPriceCurrency}
              error={errors.longActingPrice}
              onAmountChange={(longActingPrice) => patch({ longActingPrice })}
              onCurrencyChange={(longActingPriceCurrency) =>
                patch({ longActingPriceCurrency })
              }
            />
            <DurationRow
              id="bc-longevity"
              label="Longevity"
              value={input.longevity}
              unit={input.longevityUnit}
              error={errors.longevity}
              onValueChange={(longevity) => patch({ longevity })}
              onUnitChange={(longevityUnit) => patch({ longevityUnit })}
            />
          </>
        ) : null}

        {(input.sex === 'female' && input.femaleMethod === 'sterilization') ||
        (input.sex === 'male' && input.maleMethod === 'vasectomy') ? (
          <MoneyRow
            id="bc-procedure"
            label="Cost of the procedure"
            value={input.procedureCost}
            currency={input.procedureCostCurrency}
            error={errors.procedureCost}
            onAmountChange={(procedureCost) => patch({ procedureCost })}
            onCurrencyChange={(procedureCostCurrency) =>
              patch({ procedureCostCurrency })
            }
          />
        ) : null}
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={onToggleCondoms}
          aria-expanded={condomsOpen}
        >
          <h2 className="text-sm font-semibold text-accent">Condoms</h2>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              condomsOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {condomsOpen ? (
          <div className="space-y-3.5">
            {showAddon ? (
              <div>
                <p className={labelClass}>Do you also buy condoms?</p>
                <div
                  className={radioGroupClass}
                  role="radiogroup"
                  aria-label="Do you also buy condoms?"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!input.buyCondoms}
                    className={radioBtnClass(!input.buyCondoms)}
                    onClick={() => patch({ buyCondoms: false })}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={input.buyCondoms}
                    className={radioBtnClass(input.buyCondoms)}
                    onClick={() => patch({ buyCondoms: true })}
                  >
                    Yes
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Always use condoms with a new partner to prevent STIs.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Always use condoms with a new partner to prevent STIs.
              </p>
            )}

            {showCondomFields ? (
              <>
                <div>
                  <label className={labelClass} htmlFor="bc-pack-amount">
                    Amount in package
                  </label>
                  <FieldShell error={errors.amountInPackage}>
                    <input
                      id="bc-pack-amount"
                      className={inputClass}
                      inputMode="decimal"
                      value={input.amountInPackage}
                      aria-invalid={Boolean(errors.amountInPackage)}
                      onChange={(e) =>
                        patch({ amountInPackage: e.target.value })
                      }
                    />
                  </FieldShell>
                  {errors.amountInPackage ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.amountInPackage}
                    </p>
                  ) : null}
                </div>
                <DurationRow
                  id="bc-condom-usage"
                  label="How many do you usually need?"
                  value={input.condomUsage}
                  unit={input.condomUsageUnit}
                  error={errors.condomUsage}
                  onValueChange={(condomUsage) => patch({ condomUsage })}
                  onUnitChange={(condomUsageUnit) =>
                    patch({ condomUsageUnit })
                  }
                />
                <MoneyRow
                  id="bc-pack-price"
                  label="Price per package"
                  value={input.pricePerPackage}
                  currency={input.pricePerPackageCurrency}
                  error={errors.pricePerPackage}
                  onAmountChange={(pricePerPackage) =>
                    patch({ pricePerPackage })
                  }
                  onCurrencyChange={(pricePerPackageCurrency) =>
                    patch({ pricePerPackageCurrency })
                  }
                />
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <h2 className="text-sm font-semibold text-accent">Result</h2>
        <DurationRow
          id="bc-horizon"
          label="How much will you spend over..."
          value={input.horizon}
          unit={input.horizonUnit}
          error={errors.horizon}
          onValueChange={(horizon) => patch({ horizon })}
          onUnitChange={(horizonUnit) => patch({ horizonUnit })}
        />
        <MoneyRow
          id="bc-total"
          label="You will spend"
          value={result ? result.formattedTotal : ''}
          currency={input.resultCurrency}
          readOnly
          onCurrencyChange={(resultCurrency) => patch({ resultCurrency })}
        />
        {errors.form ? (
          <p className="text-xs text-rose-600">{errors.form}</p>
        ) : null}
      </div>
    </div>
  );
}
