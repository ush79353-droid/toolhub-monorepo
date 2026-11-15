'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  WEIGHT_OPTIONS,
  weightParts,
  type ImpermanentLossFieldErrors,
  type ImpermanentLossInput,
  type ImpermanentLossResult,
} from './types';

interface ImpermanentLossFormProps {
  input: ImpermanentLossInput;
  errors: ImpermanentLossFieldErrors;
  result: ImpermanentLossResult | null;
  onChange: (input: ImpermanentLossInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';
const readoutClass =
  'h-11 w-full rounded-lg border border-border bg-muted/10 px-3 text-sm font-semibold tabular-nums text-accent';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

function parsePositive(val: string): number | null {
  const trimmed = val.trim().replace(/,/g, '');
  if (!trimmed) return null;
  const num = Number(trimmed);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function formatQty(value: number): string {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return String(rounded);
}

export function ImpermanentLossForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: ImpermanentLossFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ImpermanentLossInput>) => onChange({ ...input, ...patch });
  const { weightA, weightB } = weightParts(input.weights);
  const deposit = parsePositive(input.initialDeposit);
  const iA = parsePositive(input.initialPriceA);
  const iB = parsePositive(input.initialPriceB);
  const qtyA =
    result?.formattedQuantityA ??
    (deposit !== null && iA !== null ? formatQty((deposit * weightA) / iA) : '');
  const qtyB =
    result?.formattedQuantityB ??
    (deposit !== null && iB !== null ? formatQty((deposit * weightB) / iB) : '');

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-labelledby="il-details-heading">
        <h3 id="il-details-heading" className="text-sm font-semibold text-accent">
          Asset details
        </h3>

        <div>
          <FieldLabel
            htmlFor="il-weights"
            label="Asset weights (A/B)"
            tip="Constant pool weights for a two-asset AMM. Only listed weight pairs are supported."
          />
          <select
            id="il-weights"
            className={selectClass}
            value={input.weights}
            onChange={(event) =>
              set({ weights: event.target.value as ImpermanentLossInput['weights'] })
            }
          >
            {WEIGHT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel
            htmlFor="il-deposit"
            label="Initial deposit"
            tip={`Total value deposited into the pool. ${CURRENCY_DENOMINATION_NOTE}`}
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="il-deposit"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.initialDeposit}
                aria-invalid={Boolean(errors.initialDeposit)}
                onChange={(event) => set({ initialDeposit: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="il-deposit-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.initialDeposit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="space-y-4" aria-labelledby="il-token-a-heading">
          <h3 id="il-token-a-heading" className="text-sm font-semibold text-accent">
            Token A
          </h3>
          {(
            [
              ['il-ia', 'Initial price', 'initialPriceA', errors.initialPriceA],
              ['il-fa', 'Future price', 'futurePriceA', errors.futurePriceA],
            ] as const
          ).map(([id, label, key, error]) => (
            <div key={id}>
              <FieldLabel
                htmlFor={id}
                label={label}
                tip={`${label} of Token A. Must be positive.`}
              />
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id={id}
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={input[key]}
                    aria-invalid={Boolean(error)}
                    onChange={(event) => set({ [key]: event.target.value })}
                  />
                </div>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id={`${id}-currency`}
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                  />
                </div>
              </div>
              {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
            </div>
          ))}
          <div>
            <FieldLabel
              htmlFor="il-qa"
              label="Quantity"
              tip="Deposit × weight A ÷ initial price A."
            />
            <input id="il-qa" className={readoutClass} readOnly value={qtyA} aria-live="polite" />
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="il-token-b-heading">
          <h3 id="il-token-b-heading" className="text-sm font-semibold text-accent">
            Token B
          </h3>
          {(
            [
              ['il-ib', 'Initial price', 'initialPriceB', errors.initialPriceB],
              ['il-fb', 'Future price', 'futurePriceB', errors.futurePriceB],
            ] as const
          ).map(([id, label, key, error]) => (
            <div key={id}>
              <FieldLabel
                htmlFor={id}
                label={label}
                tip={`${label} of Token B. Must be positive.`}
              />
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    {symbol}
                  </span>
                  <input
                    id={id}
                    className={`${inputClass} pl-8`}
                    inputMode="decimal"
                    value={input[key]}
                    aria-invalid={Boolean(error)}
                    onChange={(event) => set({ [key]: event.target.value })}
                  />
                </div>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id={`${id}-currency`}
                    value={input.currency}
                    onChange={(currency) => set({ currency })}
                  />
                </div>
              </div>
              {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
            </div>
          ))}
          <div>
            <FieldLabel
              htmlFor="il-qb"
              label="Quantity"
              tip="Deposit × weight B ÷ initial price B."
            />
            <input id="il-qb" className={readoutClass} readOnly value={qtyB} aria-live="polite" />
          </div>
        </section>
      </div>

      <section className="space-y-4" aria-labelledby="il-results-heading">
        <h3 id="il-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>

        <div>
          <FieldLabel
            htmlFor="il-il"
            label="Impermanent loss"
            tip="(Pool value ÷ HODL value − 1) × 100. Negative means pool underperformed holding."
          />
          <div className="relative">
            <input
              id="il-il"
              className={`${readoutClass} pr-10`}
              readOnly
              value={result ? result.formattedImpermanentLoss : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
        </div>

        {(
          [
            [
              'il-hodl',
              'Value if held (HODL)',
              'Deposit × (wA × rA + wB × rB).',
              result?.formattedHodlValue ?? '',
            ],
            [
              'il-pool',
              'Value in pool',
              'Deposit × rA^wA × rB^wB for a constant-weight AMM (no fees).',
              result?.formattedPoolValue ?? '',
            ],
            [
              'il-net',
              'Net loss vs. holding',
              'HODL value − pool value.',
              result?.formattedNetLoss ?? '',
            ],
          ] as const
        ).map(([id, label, tip, value]) => (
          <div key={id}>
            <FieldLabel htmlFor={id} label={label} tip={tip} />
            <div className="flex gap-2">
              <input id={id} className={readoutClass} readOnly value={value} aria-live="polite" />
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id={`${id}-currency`}
                  value={input.currency}
                  onChange={(currency) => set({ currency })}
                  aria-label={`${label} currency`}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
