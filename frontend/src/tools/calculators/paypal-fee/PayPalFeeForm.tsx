'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  PAYPAL_REGIONS,
  presetsForRegion,
  type PayPalLocation,
  type PayPalRegionId,
  type PayPalTransactionTypeId,
} from './presets';
import type {
  PayPalFeeFieldErrors,
  PayPalFeeInput,
  PayPalInternationalMarket,
  PayPalSolveMode,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface PayPalFeeFormProps {
  input: PayPalFeeInput;
  errors: PayPalFeeFieldErrors;
  onChange: (next: PayPalFeeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function PayPalFeeForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: PayPalFeeFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PayPalFeeInput>) =>
    onChange({ ...input, ...patch });
  const isCustom =
    input.region === 'CUSTOM' ||
    input.transactionType === 'custom' ||
    input.presetId === 'custom';
  const regionPresets = presetsForRegion(input.region);
  const showEea =
    input.region === 'UK' && input.location === 'international' && !isCustom;

  const handleRegion = (region: PayPalRegionId) => {
    if (region === 'CUSTOM') {
      set({
        region,
        presetId: 'custom',
        transactionType: 'custom',
      });
      return;
    }
    const first = presetsForRegion(region)[0];
    set({
      region,
      presetId: first?.id ?? 'custom',
      transactionType: (first?.transactionType ?? 'custom') as PayPalTransactionTypeId,
      currency: first?.defaultCurrency ?? input.currency,
      internationalMarket: 'standard',
    });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Estimates use verified US/UK merchant schedules or your custom rates.
        Fee = gross × (P + international%) / 100 + fixed. Currency conversion
        fees are excluded. Confirm live rates with PayPal.
      </p>

      <div>
        <label htmlFor="pp-region" className={labelClass}>
          PayPal Account Country / Region
          <InfoTooltip
            label="Region"
            text="Select a verified fee schedule region, or Custom to enter your own rates."
          />
        </label>
        <select
          id="pp-region"
          className={selectClass}
          value={input.region}
          onChange={(e) => handleRegion(e.target.value as PayPalRegionId)}
        >
          {PAYPAL_REGIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
              {!r.verified ? '' : ' ✓'}
            </option>
          ))}
        </select>
        {errors.region ? (
          <p className="mt-1 text-xs text-rose-600">{errors.region}</p>
        ) : null}
      </div>

      {!isCustom ? (
        <div>
          <label htmlFor="pp-type" className={labelClass}>
            Transaction Type
          </label>
          <select
            id="pp-type"
            className={selectClass}
            value={input.presetId}
            onChange={(e) => {
              const id = e.target.value;
              if (id === 'custom') {
                set({
                  presetId: 'custom',
                  transactionType: 'custom',
                });
                return;
              }
              const preset = regionPresets.find((p) => p.id === id);
              if (!preset) return;
              set({
                presetId: preset.id,
                transactionType: preset.transactionType,
              });
            }}
          >
            {regionPresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
            <option value="custom">Custom Fee</option>
          </select>
        </div>
      ) : null}

      {input.presetId === 'custom' && input.region !== 'CUSTOM' ? (
        <p className="text-xs text-muted-foreground">
 Custom Fee selected; enter your rates below.
        </p>
      ) : null}

      {/* Force custom fields when picking Custom Fee option */}
      {(isCustom || input.presetId === 'custom') && (
        <input type="hidden" value="custom" readOnly />
      )}

      <fieldset>
        <legend className={labelClass}>Payment Location</legend>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ['domestic', 'Domestic'],
              ['international', 'International'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm text-accent"
            >
              <input
                type="radio"
                name="pp-location"
                checked={input.location === value}
                onChange={() => set({ location: value as PayPalLocation })}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {showEea ? (
        <div>
          <label htmlFor="pp-intl-mkt" className={labelClass}>
            International sender market
          </label>
          <select
            id="pp-intl-mkt"
            className={selectClass}
            value={input.internationalMarket}
            onChange={(e) =>
              set({
                internationalMarket: e.target
                  .value as PayPalInternationalMarket,
              })
            }
          >
            <option value="standard">All other markets (+1.99%)</option>
            <option value="eea">EEA (+1.29%)</option>
          </select>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">
          Payment Currency
        </span>
        <CurrencySelect
          id="pp-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Payment currency denomination"
        />
      </div>

      <div>
        <label htmlFor="pp-mode" className={labelClass}>
          Calculation Mode
        </label>
        <select
          id="pp-mode"
          className={selectClass}
          value={input.solveMode}
          onChange={(e) =>
            set({ solveMode: e.target.value as PayPalSolveMode })
          }
        >
          <option value="fromGross">Fee from amount sent (gross)</option>
          <option value="fromNet">Gross needed for desired net</option>
        </select>
      </div>

      {(isCustom || input.presetId === 'custom') && (
        <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-3">
          <p className="text-xs text-muted-foreground">
            Custom rates are user-supplied estimates, not verified PayPal
            schedule values.
          </p>
          <div>
            <label htmlFor="pp-pct" className={labelClass}>
              Percentage Fee
            </label>
            <FieldShell error={errors.customPercentage}>
              <input
                id="pp-pct"
                className={inputClass}
                inputMode="decimal"
                value={input.customPercentage}
                onChange={(e) =>
                  set({
                    customPercentage: e.target.value,
                    transactionType: 'custom',
                    presetId: 'custom',
                  })
                }
                placeholder="3.49"
              />
              <span className="pr-3 text-sm text-muted-foreground">%</span>
            </FieldShell>
            {errors.customPercentage ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.customPercentage}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="pp-fixed" className={labelClass}>
              Fixed Fee
            </label>
            <FieldShell error={errors.customFixed}>
              <span className="pl-3 text-sm text-muted-foreground">
                {symbol}
              </span>
              <input
                id="pp-fixed"
                className={inputClass}
                inputMode="decimal"
                value={input.customFixed}
                onChange={(e) =>
                  set({
                    customFixed: e.target.value,
                    transactionType: 'custom',
                    presetId: 'custom',
                  })
                }
                placeholder="0.49"
              />
            </FieldShell>
            {errors.customFixed ? (
              <p className="mt-1 text-xs text-rose-600">{errors.customFixed}</p>
            ) : null}
          </div>
          {input.location === 'international' ? (
            <div>
              <label htmlFor="pp-addl" className={labelClass}>
                Additional International Fee
              </label>
              <FieldShell error={errors.customAdditional}>
                <input
                  id="pp-addl"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.customAdditional}
                  onChange={(e) =>
                    set({
                      customAdditional: e.target.value,
                      transactionType: 'custom',
                      presetId: 'custom',
                    })
                  }
                  placeholder="1.50"
                />
                <span className="pr-3 text-sm text-muted-foreground">%</span>
              </FieldShell>
              {errors.customAdditional ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.customAdditional}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {input.solveMode === 'fromGross' ? (
        <div>
          <label htmlFor="pp-gross" className={labelClass}>
            Amount Sent / Payment Amount
            <InfoTooltip
              label="Amount sent"
              text="Gross amount the payer sends before recipient transaction fees."
            />
          </label>
          <FieldShell error={errors.grossAmount}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="pp-gross"
              className={inputClass}
              inputMode="decimal"
              value={input.grossAmount}
              onChange={(e) => set({ grossAmount: e.target.value })}
              placeholder="100"
              aria-invalid={Boolean(errors.grossAmount)}
            />
          </FieldShell>
          {errors.grossAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.grossAmount}</p>
          ) : null}
        </div>
      ) : (
        <div>
          <label htmlFor="pp-net" className={labelClass}>
            Amount You Want to Receive
            <InfoTooltip
              label="Desired net"
              text="Target amount after fees. The calculator finds the minimum gross that meets this net after rounding."
            />
          </label>
          <FieldShell error={errors.desiredNet}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="pp-net"
              className={inputClass}
              inputMode="decimal"
              value={input.desiredNet}
              onChange={(e) => set({ desiredNet: e.target.value })}
              placeholder="100"
              aria-invalid={Boolean(errors.desiredNet)}
            />
          </FieldShell>
          {errors.desiredNet ? (
            <p className="mt-1 text-xs text-rose-600">{errors.desiredNet}</p>
          ) : null}
        </div>
      )}

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($100 · US Checkout 3.49% + $0.49)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
