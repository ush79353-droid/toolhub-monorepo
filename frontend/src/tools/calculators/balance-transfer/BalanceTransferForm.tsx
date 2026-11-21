'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BalanceTransferFieldErrors,
  BalanceTransferInput,
  BalanceTransferMode,
  BalanceTransferResult,
  FeeTreatment,
  PaymentStrategy,
  TransferFeeType,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function Segmented<T extends string>({
  label,
  tip,
  value,
  options,
  onChange,
  ariaLabel,
}: {
  label: string;
  tip: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </legend>
      <div
        className="mt-1.5 flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`h-11 min-w-[4.5rem] rounded-lg border px-3 text-sm font-medium transition-colors ${
                selected
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  symbol: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function PercentField({
  id,
  label,
  tip,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-invalid={Boolean(error)}
        />
        <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
          %
        </span>
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

interface BalanceTransferFormProps {
  input: BalanceTransferInput;
  errors: BalanceTransferFieldErrors;
  result: BalanceTransferResult | null;
  onChange: (input: BalanceTransferInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

const MODE_OPTIONS: readonly {
  value: BalanceTransferMode;
  label: string;
}[] = [
  { value: 'promotional', label: 'Promotional period' },
  { value: 'long-term', label: 'Long-term use' },
];

const STRATEGY_OPTIONS: readonly {
  value: PaymentStrategy;
  label: string;
}[] = [
  { value: 'fixed', label: 'Fixed monthly payment' },
  { value: 'pay-during-promo', label: 'Pay off during promotion' },
];

const FEE_TYPE_OPTIONS: readonly {
  value: TransferFeeType;
  label: string;
}[] = [
  { value: 'percentage', label: '% of transfer' },
  { value: 'fixed', label: 'Fixed amount' },
];

const TREATMENT_OPTIONS: readonly {
  value: FeeTreatment;
  label: string;
}[] = [
  { value: 'financed', label: 'Added to balance' },
  { value: 'upfront', label: 'Paid separately upfront' },
];

export function BalanceTransferForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: BalanceTransferFormProps) {
  const [oldOpen, setOldOpen] = useState(true);
  const [newOpen, setNewOpen] = useState(true);
  const [compareOpen, setCompareOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<BalanceTransferInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        A balance transfer moves an existing credit card balance to another
        card, often offering a lower introductory interest rate. Compare the
        cost of keeping your current balance with the cost of transferring it
        to determine whether the offer saves money.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="bt-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for balance transfer amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Amounts share one currency label (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the balance transfer calculator
        </a>
      </p>

      <Segmented
        label="Promotional period of use"
        tip="Promotional period highlights the intro window and remaining balance. Long-term use emphasizes full payoff costs after the promo ends."
        value={input.mode}
        options={MODE_OPTIONS}
        onChange={(v) => set({ mode: v })}
        ariaLabel="Comparison mode"
      />

      <Segmented
        label="Payment strategy"
        tip="Fixed payment uses your monthly amount. Pay off during promotion computes the payment needed to clear the transferred balance within the intro months."
        value={input.paymentStrategy}
        options={STRATEGY_OPTIONS}
        onChange={(v) => set({ paymentStrategy: v })}
        ariaLabel="Payment strategy"
      />

      <CollapsibleSection
        title="Old card cost"
        open={oldOpen}
        onToggle={() => setOldOpen((o) => !o)}
      >
        <MoneyField
          id="bt-balance"
          label="Current credit card balance"
          tip="Outstanding balance you want to compare or transfer."
          value={input.currentBalance}
          error={errors.currentBalance}
          symbol={symbol}
          onChange={(v) => set({ currentBalance: v })}
        />
        <PercentField
          id="bt-old-apr"
          label="Old rate"
          tip="Annual percentage rate currently charged on the outstanding balance."
          value={input.oldApr}
          error={errors.oldApr}
          onChange={(v) => set({ oldApr: v })}
        />
        {input.paymentStrategy === 'fixed' ? (
          <MoneyField
            id="bt-payment"
            label="Monthly payment"
            tip="Amount you plan to pay toward the balance each month. Blank is not treated as zero."
            value={input.monthlyPayment}
            error={errors.monthlyPayment}
            symbol={symbol}
            onChange={(v) => set({ monthlyPayment: v })}
          />
        ) : (
          <p className="text-xs text-muted-foreground">
            Monthly payment is calculated to clear the new-card balance during
            the promotional period
            {result?.formattedRequiredPromoPayment != null
              ? ` (≈ ${symbol}${result.formattedRequiredPromoPayment})`
              : ''}
            .
          </p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="New card cost"
        open={newOpen}
        onToggle={() => setNewOpen((o) => !o)}
      >
        <MoneyField
          id="bt-transfer"
          label="Amount to transfer"
          tip="Leave blank to transfer the full current balance. Partial transfers leave the remainder on the old card."
          value={input.transferAmount}
          error={errors.transferAmount}
          symbol={symbol}
          onChange={(v) => set({ transferAmount: v })}
        />

        <Segmented
          label="Transfer fee type"
          tip="Percentage of the transferred amount, or a fixed fee."
          value={input.transferFeeType}
          options={FEE_TYPE_OPTIONS}
          onChange={(v) => set({ transferFeeType: v })}
          ariaLabel="Transfer fee type"
        />

        {input.transferFeeType === 'percentage' ? (
          <PercentField
            id="bt-fee"
            label="Transfer fee"
            tip="Typical offers charge about 3–5% of the transferred amount. Blank is treated as zero."
            value={input.transferFee}
            error={errors.transferFee}
            onChange={(v) => set({ transferFee: v })}
          />
        ) : (
          <MoneyField
            id="bt-fee-fixed"
            label="Transfer fee"
            tip="Fixed fee charged for the transfer. Blank is treated as zero."
            value={input.transferFee}
            error={errors.transferFee}
            symbol={symbol}
            onChange={(v) => set({ transferFee: v })}
          />
        )}

        <Segmented
          label="Transfer fee treatment"
          tip="Added to balance includes the fee in the interest-bearing starting balance. Paid upfront counts the fee in total cost but not in the financed balance."
          value={input.feeTreatment}
          options={TREATMENT_OPTIONS}
          onChange={(v) => set({ feeTreatment: v })}
          ariaLabel="Fee treatment"
        />

        <PercentField
          id="bt-promo-apr"
          label="Promotional rate"
          tip="Introductory APR during the promotional months. Often 0%."
          value={input.promotionalApr}
          error={errors.promotionalApr}
          onChange={(v) => set({ promotionalApr: v })}
        />

        <div>
          <label htmlFor="bt-promo-months" className={labelClass}>
            Time required
            <InfoTooltip
              label="Time required"
              text="Number of months the promotional APR remains active."
            />
          </label>
          <FieldShell error={errors.promotionalMonths}>
            <input
              id="bt-promo-months"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.promotionalMonths}
              onChange={(e) => set({ promotionalMonths: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.promotionalMonths)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              months
            </span>
          </FieldShell>
          {errors.promotionalMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.promotionalMonths}
            </p>
          ) : null}
        </div>

        <PercentField
          id="bt-regular-apr"
          label="APR after promotional period"
          tip="Annual rate charged on any remaining transferred balance after the intro period ends."
          value={input.regularApr}
          error={errors.regularApr}
          onChange={(v) => set({ regularApr: v })}
        />
      </CollapsibleSection>

      <CollapsibleSection
        title="Compare credit card costs"
        open={compareOpen}
        onToggle={() => setCompareOpen((o) => !o)}
      >
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-white px-3 py-2">
            <p className="text-xs text-muted-foreground">Old credit card cost</p>
            <p className="font-semibold tabular-nums text-accent">
              {result?.formattedOldTotalCost != null
                ? `${symbol}${result.formattedOldTotalCost}`
                : '—'}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white px-3 py-2">
            <p className="text-xs text-muted-foreground">New credit card cost</p>
            <p className="font-semibold tabular-nums text-accent">
              {result?.formattedNewTotalCost != null
                ? `${symbol}${result.formattedNewTotalCost}`
                : '—'}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Costs include principal plus interest
          {result?.formattedTransferFee != null
            ? ` (transfer fee ${symbol}${result.formattedTransferFee} on the new card)`
            : ''}
          . See the summary below for savings and payoff times.
        </p>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
