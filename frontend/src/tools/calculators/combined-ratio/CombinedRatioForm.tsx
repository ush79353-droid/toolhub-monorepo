'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CombinedRatioDriver,
  CombinedRatioFieldErrors,
  CombinedRatioInput,
  CombinedRatioResult,
  FixedLossComponent,
  RatioSolveTarget,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CombinedRatioFormProps {
  input: CombinedRatioInput;
  errors: CombinedRatioFieldErrors;
  result: CombinedRatioResult | null;
  onChange: (input: CombinedRatioInput) => void;
  onCurrencyChange: (currency: CombinedRatioInput['currency']) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function CombinedRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
  onClear,
  onReset,
}: CombinedRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setField = (
    field: CombinedRatioDriver,
    value: string,
    extras?: Partial<CombinedRatioInput>,
  ) => {
    const next: CombinedRatioInput = { ...input, ...extras, [field]: value, driver: field };

    // When editing a loss component, remember it as the fixed partner for LE edits.
    if (field === 'claimLoss') next.fixedLossComponent = 'claimLoss';
    if (field === 'lossAdjustments') next.fixedLossComponent = 'lossAdjustments';

    // When editing P or UE, prefer solving the other money field if CR is edited next.
    if (field === 'premiums') next.ratioSolveTarget = 'underwritingExpense';
    if (field === 'underwritingExpense') next.ratioSolveTarget = 'premiums';
    if (field === 'combinedRatio' && !extras?.ratioSolveTarget) {
      // keep existing ratioSolveTarget
    }

    onChange(next);
  };

  const statusCopy =
    result?.status === 'profit'
      ? 'Underwriting profit; losses and underwriting expenses are below premiums (simplified model).'
      : result?.status === 'breakeven'
        ? 'Underwriting break-even; premiums equal losses plus underwriting expenses.'
        : result?.status === 'loss'
          ? 'Underwriting loss; losses plus underwriting expenses exceed premiums.'
          : null;

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Insurance underwriting combined ratio from claim losses, loss adjustments, premiums, and
 underwriting expenses. Currency changes the display symbol only; amounts are not converted.
      </p>

      <div>
        <label className={labelClass} htmlFor="cr-currency">
          <span>Display currency</span>
        </label>
        <CurrencySelect
          id="cr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Display currency"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">Loss expense</h3>

        <div>
          <label className={labelClass} htmlFor="cr-claim">
            <span>Claim loss</span>
            <InfoTooltip
              label="Claim loss"
              text="Claim payments and related loss amounts for the period. Keep the same accounting basis as premiums and expenses. Do not double-count loss adjustment expenses already in this figure."
            />
          </label>
          <FieldShell error={errors.claimLoss}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cr-claim"
              className={inputClass}
              inputMode="decimal"
              value={input.claimLoss}
              aria-invalid={Boolean(errors.claimLoss)}
              onChange={(e) => setField('claimLoss', e.target.value)}
            />
          </FieldShell>
          {errors.claimLoss ? <p className="mt-1 text-xs text-rose-600">{errors.claimLoss}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-la">
            <span>Loss adjustments</span>
            <InfoTooltip
              label="Loss adjustments"
              text="Costs to investigate, handle, and settle claims (ALAÉ/ULAÉ as defined in your reporting). Enter separately only if not already inside claim loss."
            />
          </label>
          <FieldShell error={errors.lossAdjustments}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cr-la"
              className={inputClass}
              inputMode="decimal"
              value={input.lossAdjustments}
              aria-invalid={Boolean(errors.lossAdjustments)}
              onChange={(e) => setField('lossAdjustments', e.target.value)}
            />
          </FieldShell>
          {errors.lossAdjustments ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lossAdjustments}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-le">
            <span>Loss expense</span>
            <InfoTooltip
              label="Loss expense"
              text="Claim loss + loss adjustments when reported separately. Editing this keeps the other loss component you last set and solves for the remaining one."
            />
          </label>
          <FieldShell error={errors.lossExpense}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cr-le"
              className={inputClass}
              inputMode="decimal"
              value={input.lossExpense}
              aria-invalid={Boolean(errors.lossExpense)}
              onChange={(e) => setField('lossExpense', e.target.value)}
            />
          </FieldShell>
          {errors.lossExpense ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lossExpense}</p>
          ) : null}
        </div>
      </form>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">Combined ratio</h3>

        <div>
          <label className={labelClass} htmlFor="cr-prem">
            <span>Premiums</span>
            <InfoTooltip
              label="Premiums"
              text="Usually net premiums earned for a conventional underwriting combined ratio. Numerator and denominator must share the same period and accounting basis."
            />
          </label>
          <FieldShell error={errors.premiums}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cr-prem"
              className={inputClass}
              inputMode="decimal"
              value={input.premiums}
              aria-invalid={Boolean(errors.premiums)}
              onChange={(e) => setField('premiums', e.target.value)}
            />
          </FieldShell>
          {errors.premiums ? <p className="mt-1 text-xs text-rose-600">{errors.premiums}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-ue">
            <span>Underwriting expense</span>
            <InfoTooltip
              label="Underwriting expense"
              text="Operating costs of writing and servicing policies (commissions, acquisition, administration). Do not re-count claims or loss adjustment expenses here."
            />
          </label>
          <FieldShell error={errors.underwritingExpense}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="cr-ue"
              className={inputClass}
              inputMode="decimal"
              value={input.underwritingExpense}
              aria-invalid={Boolean(errors.underwritingExpense)}
              onChange={(e) => setField('underwritingExpense', e.target.value)}
            />
          </FieldShell>
          {errors.underwritingExpense ? (
            <p className="mt-1 text-xs text-rose-600">{errors.underwritingExpense}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-ratio">
            <span>Combined ratio</span>
            <InfoTooltip
              label="Combined ratio"
              text="((Loss expense + underwriting expense) / premiums) × 100, or loss ratio + expense ratio. Editing this solves for underwriting expense by default (or premiums / loss expense via the solve target)."
            />
          </label>
          <FieldShell error={errors.combinedRatio}>
            <input
              id="cr-ratio"
              className={inputClass}
              inputMode="decimal"
              value={input.combinedRatio}
              aria-invalid={Boolean(errors.combinedRatio)}
              onChange={(e) => setField('combinedRatio', e.target.value)}
            />
            <span className="shrink-0 pr-3 text-sm font-medium text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.combinedRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.combinedRatio}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-solve">
            <span>When editing combined ratio, solve for</span>
          </label>
          <select
            id="cr-solve"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.ratioSolveTarget}
            onChange={(e) =>
              onChange({
                ...input,
                ratioSolveTarget: e.target.value as RatioSolveTarget,
                driver: input.combinedRatio.trim() ? 'combinedRatio' : input.driver,
              })
            }
          >
            <option value="underwritingExpense">Underwriting expense</option>
            <option value="premiums">Premiums</option>
            <option value="lossExpense">Loss expense</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="cr-fixed-loss">
            <span>When splitting loss expense, keep fixed</span>
          </label>
          <select
            id="cr-fixed-loss"
            className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
            value={input.fixedLossComponent}
            onChange={(e) =>
              onChange({
                ...input,
                fixedLossComponent: e.target.value as FixedLossComponent,
              })
            }
          >
            <option value="lossAdjustments">Loss adjustments</option>
            <option value="claimLoss">Claim loss</option>
          </select>
        </div>
      </form>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Result</h3>
        <div className="rounded-lg border border-border bg-white px-3 py-3">
          {result ? (
            <>
              <p className="text-xs text-muted-foreground">Combined ratio</p>
              <p className="text-2xl font-semibold tabular-nums text-accent">
                {result.formattedCombinedRatio}%
              </p>
              {statusCopy ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{statusCopy}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
 Enter claim loss, loss adjustments, premiums, and underwriting expense, or edit
              combined ratio with enough known values to reverse-solve.
            </p>
          )}
        </div>

        {result ? (
          <ul className="space-y-1.5 text-sm text-foreground/90">
            <li>
              Loss expense: {symbol}
              {result.formattedLossExpense}
            </li>
            <li>Loss ratio: {result.formattedLossRatio}%</li>
            <li>Expense ratio: {result.formattedExpenseRatio}%</li>
            <li>Combined ratio: {result.formattedCombinedRatio}%</li>
            <li>
              Underwriting result: {symbol}
              {result.formattedUnderwritingResult}
            </li>
            <li>Underwriting margin: {result.formattedUnderwritingMargin}%</li>
          </ul>
        ) : null}

        <p className="text-xs leading-relaxed text-muted-foreground">
 A combined ratio below 100% is not company-wide profit; investment income, taxes, and
          other items can change overall results.
        </p>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
 Example: 70% combined ratio
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
