'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import {
  INVESTMENT_SCENARIOS,
  type TrumpAccountsFieldErrors,
  type TrumpAccountsInput,
  type TrumpAccountsResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function GrowthPieChart({ result }: { result: TrumpAccountsResult }) {
  const contributions = Math.max(0, result.totalContributions);
  const growth = Math.max(0, result.investmentGrowth);
  const total = contributions + growth;
  const growthAngle = total > 0 ? (growth / total) * 360 : 0;
  const r = 70;
  const cx = 90;
  const cy = 90;

  const polar = (angleDeg: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const start = polar(0);
  const mid = polar(growthAngle);
  const large = growthAngle > 180 ? 1 : 0;
  const growthPath =
    growth <= 0 || total <= 0
      ? ''
      : `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${mid.x} ${mid.y} Z`;
  const contribPath =
    contributions <= 0 || total <= 0
      ? ''
      : `M ${cx} ${cy} L ${mid.x} ${mid.y} A ${r} ${r} 0 ${growthAngle > 180 ? 0 : 1} 1 ${start.x} ${start.y} Z`;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <svg
        viewBox="0 0 180 180"
        className="h-40 w-40"
        role="img"
        aria-label={
          total <= 0
            ? 'No balance to chart'
            : `Your contributions ${result.contributionsSharePercent.toFixed(1)} percent, accumulated interest ${result.growthSharePercent.toFixed(1)} percent`
        }
      >
        {contribPath ? (
          <path d={contribPath} className="fill-primary/80">
            <title>
              Your contributions:{' '}
              {formatMoney(contributions, result.currency)}
            </title>
          </path>
        ) : null}
        {growthPath ? (
          <path d={growthPath} className="fill-rose-500/80">
            <title>
              Accumulated interest:{' '}
              {formatMoney(growth, result.currency)}
            </title>
          </path>
        ) : null}
        {growth <= 0 && contributions > 0 ? (
          <circle cx={cx} cy={cy} r={r} className="fill-primary/80" />
        ) : null}
        {total <= 0 ? (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            className="fill-muted stroke-border"
            strokeWidth={1}
          />
        ) : null}
        <circle cx={cx} cy={cy} r={36} className="fill-white" />
      </svg>
      <div className="space-y-2 text-sm">
        <p className="inline-flex flex-wrap items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary/80" aria-hidden />
          Your contributions:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatMoney(contributions, result.currency)}
          </span>
          {total > 0 ? (
            <span className="text-xs text-muted-foreground">
              ({result.contributionsSharePercent.toFixed(1)}%)
            </span>
          ) : null}
        </p>
        <p className="inline-flex flex-wrap items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500/80" aria-hidden />
          Accumulated interest:{' '}
          <span className="font-medium tabular-nums text-accent">
            {formatMoney(growth, result.currency)}
          </span>
          {total > 0 ? (
            <span className="text-xs text-muted-foreground">
              ({result.growthSharePercent.toFixed(1)}%)
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

interface TrumpAccountsFormProps {
  input: TrumpAccountsInput;
  errors: TrumpAccountsFieldErrors;
  result: TrumpAccountsResult | null;
  onChange: (next: TrumpAccountsInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
}

export function TrumpAccountsForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
}: TrumpAccountsFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<TrumpAccountsInput>) => {
    onChange({ ...input, ...patch });
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
      <p className="text-xs text-muted-foreground">
        Estimate how a child&apos;s account could grow from a starting balance,
        annual contributions, and a selected return scenario. Contribution limits
        depend on current official rules — this tool does not enforce unverified
        caps.
      </p>

      <div>
        <label className={labelClass} htmlFor="ta-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="ta-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {CURRENCY_DENOMINATION_NOTE}
        </p>
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ta-starting-age">Child&apos;s starting age</label>
          <InfoTooltip
            label="Child's starting age"
            text="Current age of the child in whole years (0–17)."
            align="left"
          />
        </div>
        <FieldShell error={errors.startingAge}>
          <input
            id="ta-starting-age"
            className={inputClass}
            inputMode="numeric"
            value={input.startingAge}
            aria-invalid={Boolean(errors.startingAge)}
            onChange={(event) => set({ startingAge: event.target.value })}
          />
          <span className="pr-3 text-xs text-muted-foreground">yrs</span>
        </FieldShell>
        {errors.startingAge ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startingAge}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ta-target-age">Project account balance until age</label>
          <InfoTooltip
            label="Project until age"
            text="Ending age for the projection. Must be greater than starting age. Default is 18."
            align="left"
          />
        </div>
        <FieldShell error={errors.targetAge}>
          <input
            id="ta-target-age"
            className={inputClass}
            inputMode="numeric"
            value={input.targetAge}
            aria-invalid={Boolean(errors.targetAge)}
            onChange={(event) => set({ targetAge: event.target.value })}
          />
          <span className="pr-3 text-xs text-muted-foreground">yrs</span>
        </FieldShell>
        {errors.targetAge ? (
          <p className="mt-1 text-xs text-rose-600">{errors.targetAge}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ta-starting-balance">Starting balance</label>
          <InfoTooltip
            label="Starting balance"
            text="Existing account balance or initial investment."
            align="left"
          />
        </div>
        <FieldShell error={errors.startingBalance}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ta-starting-balance"
            className={inputClass}
            inputMode="decimal"
            value={input.startingBalance}
            aria-invalid={Boolean(errors.startingBalance)}
            onChange={(event) => set({ startingBalance: event.target.value })}
          />
        </FieldShell>
        {errors.startingBalance ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startingBalance}</p>
        ) : null}
      </div>

      <div>
        <div className={labelClass}>
          <label htmlFor="ta-annual-contribution">Annual contribution</label>
          <InfoTooltip
            label="Annual contribution"
            text="Amount you plan to contribute each year (end-of-year). Official contribution limits may apply — verify current rules."
            align="left"
          />
        </div>
        <FieldShell error={errors.annualContribution}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ta-annual-contribution"
            className={inputClass}
            inputMode="decimal"
            value={input.annualContribution}
            aria-invalid={Boolean(errors.annualContribution)}
            onChange={(event) =>
              set({ annualContribution: event.target.value })
            }
          />
        </FieldShell>
        {errors.annualContribution ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.annualContribution}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Contribution limits, if any, follow current official account rules —
          not hardcoded here.
        </p>
      </div>

      <fieldset className="space-y-2.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Choose a scenario for the rate of return
        </legend>
        <div className="space-y-2" role="radiogroup" aria-label="Investment return scenario">
          {INVESTMENT_SCENARIOS.map((scenario) => (
            <label
              key={scenario.value}
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white/70 has-[:checked]:border-primary/30 has-[:checked]:bg-white"
            >
              <input
                type="radio"
                className="mt-1 h-4 w-4 accent-primary"
                name="ta-scenario"
                value={scenario.value}
                checked={input.investmentScenario === scenario.value}
                onChange={() => set({ investmentScenario: scenario.value })}
              />
              <span>
                <span className="block text-sm font-medium text-accent">
                  {scenario.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {scenario.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2 rounded-xl border border-border bg-muted/10 p-3.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.includeInflation}
            onChange={(event) =>
              set({ includeInflation: event.target.checked })
            }
          />
          Include inflation
        </label>
        {input.includeInflation ? (
          <div>
            <div className={labelClass}>
              <label htmlFor="ta-inflation">Annual inflation rate</label>
            </div>
            <FieldShell error={errors.inflationRate}>
              <input
                id="ta-inflation"
                className={inputClass}
                inputMode="decimal"
                value={input.inflationRate}
                aria-invalid={Boolean(errors.inflationRate)}
                onChange={(event) => set({ inflationRate: event.target.value })}
              />
              <span className="pr-3 text-xs text-muted-foreground">%</span>
            </FieldShell>
            {errors.inflationRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.inflationRate}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={onReload}
        >
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={onClear}
        >
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="ta-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3
            id="ta-results-heading"
            className="text-sm font-semibold text-accent"
          >
            Your results
          </h3>

          <p
            className="text-base font-semibold text-accent sm:text-lg"
            role="status"
            aria-live="polite"
          >
            Your final balance will be{' '}
            <span className="tabular-nums">
              {formatMoney(result.finalBalance, result.currency)}
            </span>
            .
          </p>

          <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90 sm:text-sm">
            {result.explanation}
          </div>

          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total contributions</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalContributions, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Investment growth</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.investmentGrowth, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Investment years</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.investmentYears}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Annual return</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.annualReturnPercent}%
              </dd>
            </div>
            {result.includeInflation &&
            result.inflationAdjustedBalance !== null ? (
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Inflation-adjusted balance ({result.inflationRatePercent}%/yr)
                </dt>
                <dd className="text-lg font-semibold tabular-nums text-accent">
                  {formatMoney(
                    result.inflationAdjustedBalance,
                    result.currency,
                  )}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="border-t border-border pt-3">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contributions vs. growth
            </h4>
            <GrowthPieChart result={result} />
          </div>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter ages, balances, and a return scenario to project the account.
        </p>
      )}
    </form>
  );
}
