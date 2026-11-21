'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatMoney,
  formatPercent,
} from './calculation';
import type {
  MaximumDrawdownFieldErrors,
  MaximumDrawdownInput,
  MaximumDrawdownResult,
  RecoveryResult,
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

interface MaximumDrawdownFormProps {
  input: MaximumDrawdownInput;
  errors: MaximumDrawdownFieldErrors;
  drawdown: MaximumDrawdownResult | null;
  recovery: RecoveryResult | null;
  onChange: (next: MaximumDrawdownInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onLoadExample: () => void;
}

export function MaximumDrawdownForm({
  input,
  errors,
  drawdown,
  recovery,
  onChange,
  onCalculate,
  onClear,
  onLoadExample,
}: MaximumDrawdownFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<MaximumDrawdownInput>) =>
    onChange({ ...input, ...patch });

  const recoveryDrawdownDisplay = input.recoverySynced
    ? drawdown
      ? formatPercent(drawdown.maximumDrawdownPercent)
      : input.recoveryDrawdown
    : input.recoveryDrawdown;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section aria-labelledby="mdd-main-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 id="mdd-main-heading" className="text-sm font-semibold text-accent">
              Maximum drawdown
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Calculate the largest percentage decline from a peak to its lowest subsequent
              point.
            </p>
          </div>
          <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
            Load example
          </Button>
        </div>

        <div>
          <label className={labelClass} htmlFor="mdd-currency">
            <span>Display currency</span>
          </label>
          <div className="max-w-[140px]">
            <CurrencySelect
              id="mdd-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="mdd-peak">Peak value</label>
            <InfoTooltip
              label="Peak value"
              text="The highest portfolio or investment value reached before the subsequent decline."
              align="left"
            />
          </div>
          <FieldShell error={errors.peakValue}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="mdd-peak"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter peak value"
              value={input.peakValue}
              aria-invalid={Boolean(errors.peakValue)}
              onChange={(event) => set({ peakValue: event.target.value })}
            />
          </FieldShell>
          {errors.peakValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.peakValue}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="mdd-trough">Lowest value after peak</label>
            <InfoTooltip
              label="Lowest value after peak"
              text="The lowest portfolio or investment value reached during the subsequent decline. Zero means a complete loss."
              align="left"
            />
          </div>
          <FieldShell error={errors.lowestValueAfterPeak}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="mdd-trough"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter lowest value"
              value={input.lowestValueAfterPeak}
              aria-invalid={Boolean(errors.lowestValueAfterPeak)}
              onChange={(event) => set({ lowestValueAfterPeak: event.target.value })}
            />
          </FieldShell>
          {errors.lowestValueAfterPeak ? (
            <p className="mt-1 text-xs text-rose-600">{errors.lowestValueAfterPeak}</p>
          ) : null}
        </div>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {drawdown ? (
        <section
          aria-labelledby="mdd-result-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="mdd-result-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div>
            <p className="text-[13px] font-medium text-accent">Maximum drawdown</p>
            <p className="text-3xl font-semibold tabular-nums text-accent">
              {formatPercent(drawdown.maximumDrawdownPercent)}%
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Peak value</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(drawdown.peakValue, drawdown.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Lowest value after peak</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(drawdown.lowestValueAfterPeak, drawdown.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Absolute loss</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(drawdown.absoluteLoss, drawdown.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Required recovery gain</dt>
              <dd className="font-medium tabular-nums text-accent">
                {Number.isFinite(drawdown.requiredRecoveryGainPercent)
                  ? `${formatPercent(drawdown.requiredRecoveryGainPercent)}%`
                  : 'Not finite (complete loss)'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Remaining portfolio value</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatPercent(drawdown.remainingValuePercent)}%
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter peak and trough values, then Calculate to see maximum drawdown.
        </p>
      )}

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.recoveryOpen}
        onToggle={(event) => set({ recoveryOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.recoveryOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Time for recovery</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-xs text-muted-foreground">
            Estimate how long compound growth at an assumed annual rate may take to regain the
            previous peak. This is not a guarantee of future returns.
          </p>

          <div>
            <div className={labelClass}>
              <label htmlFor="mdd-recovery-drawdown">Maximum drawdown</label>
              <InfoTooltip
                label="Maximum drawdown"
                text="Synced from the main result when Calculate runs. Uncheck sync to enter an independent recovery scenario."
                align="left"
              />
            </div>
            <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={input.recoverySynced}
                onChange={(event) =>
                  set({
                    recoverySynced: event.target.checked,
                    recoveryDrawdown: event.target.checked
                      ? drawdown
                        ? formatPercent(drawdown.maximumDrawdownPercent)
                        : input.recoveryDrawdown
                      : recoveryDrawdownDisplay,
                  })
                }
              />
              Sync with main drawdown result
            </label>
            <FieldShell error={errors.recoveryDrawdown} className="max-w-xs">
              <input
                id="mdd-recovery-drawdown"
                className={inputClass}
                inputMode="decimal"
                disabled={input.recoverySynced}
                value={recoveryDrawdownDisplay}
                aria-invalid={Boolean(errors.recoveryDrawdown)}
                onChange={(event) =>
                  set({ recoveryDrawdown: event.target.value, recoverySynced: false })
                }
              />
              <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
            </FieldShell>
            {errors.recoveryDrawdown ? (
              <p className="mt-1 text-xs text-rose-600">{errors.recoveryDrawdown}</p>
            ) : null}
          </div>

          <div>
            <div className={labelClass}>
              <label htmlFor="mdd-growth">Expected annual growth rate</label>
              <InfoTooltip
                label="Expected annual growth rate"
                text="Assumed annual compound growth rate used only to estimate recovery time; not a promised return."
                align="left"
              />
            </div>
            <FieldShell error={errors.expectedAnnualGrowthRate} className="max-w-xs">
              <input
                id="mdd-growth"
                className={inputClass}
                inputMode="decimal"
                placeholder="Enter annual growth rate"
                value={input.expectedAnnualGrowthRate}
                aria-invalid={Boolean(errors.expectedAnnualGrowthRate)}
                onChange={(event) => set({ expectedAnnualGrowthRate: event.target.value })}
              />
              <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
            </FieldShell>
            {errors.expectedAnnualGrowthRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.expectedAnnualGrowthRate}</p>
            ) : null}
          </div>

          {recovery ? (
            <div className="space-y-3 rounded-lg border border-border bg-white p-3">
              <div>
                <p className="text-[13px] font-medium text-accent">Estimated time for recovery</p>
                <p className="text-xl font-semibold tabular-nums text-accent">
                  {recovery.status === 'ok' || recovery.status === 'zero_drawdown'
                    ? recovery.formattedRecoveryTime
                    : recovery.status === 'zero_growth'
                      ? 'Undefined (0% growth)'
                      : recovery.status === 'complete_loss'
                        ? 'Not finite (complete loss)'
                        : 'Not available'}
                </p>
                {recovery.recoveryYears !== null && Number.isFinite(recovery.recoveryYears) ? (
                  <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                    {formatPercent(recovery.recoveryYears, 2)} years
                    {recovery.recoveryMonthsTotal !== null
                      ? ` · ≈ ${formatPercent(recovery.recoveryMonthsTotal, 1)} months`
                      : ''}
                  </p>
                ) : null}
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Maximum drawdown</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatPercent(recovery.maximumDrawdownPercent)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Remaining portfolio value</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatPercent(recovery.remainingValuePercent)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Required recovery gain</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {Number.isFinite(recovery.requiredRecoveryGainPercent)
                      ? `${formatPercent(recovery.requiredRecoveryGainPercent)}%`
                      : 'Not finite'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Assumed annual growth</dt>
                  <dd className="font-medium tabular-nums text-accent">
                    {formatPercent(recovery.expectedAnnualGrowthRatePercent)}%
                  </dd>
                </div>
              </dl>
              <p className="text-xs leading-relaxed text-muted-foreground">{recovery.explanation}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Enter an expected annual growth rate and Calculate to estimate recovery time.
            </p>
          )}
        </div>
      </details>
    </form>
  );
}
