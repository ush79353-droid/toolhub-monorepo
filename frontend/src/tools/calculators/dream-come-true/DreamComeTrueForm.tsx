'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney } from './calculation';
import type {
  DreamComeTrueFieldErrors,
  DreamComeTrueInput,
  DreamComeTrueResult,
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

function SavingsChart({ result }: { result: DreamComeTrueResult }) {
  if (!result.goalReachable || result.breakdown.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-8 text-center text-sm text-muted-foreground">
        No data to display
      </p>
    );
  }

  const points = result.breakdown;
  const maxY = Math.max(
    result.dreamPrice,
    ...points.map((p) => p.totalSavings),
    1,
  );
  const maxX = Math.max(points[points.length - 1]!.month, 1);
  const w = 320;
  const h = 160;
  const pad = 8;

  const xAt = (month: number) => pad + (month / maxX) * (w - pad * 2);
  const yAt = (value: number) => h - pad - (value / maxY) * (h - pad * 2);

  const areaPath = (
    key: 'initialSavingsGrowth' | 'monthlyContributions' | 'interestEarned',
    stackBelow: (p: (typeof points)[number]) => number,
  ) => {
    const top = points
      .map((p) => `${xAt(p.month)},${yAt(stackBelow(p) + p[key])}`)
      .join(' ');
    const bottom = [...points]
      .reverse()
      .map((p) => `${xAt(p.month)},${yAt(stackBelow(p))}`)
      .join(' ');
    return `M ${top} L ${bottom} Z`;
  };

  const targetY = yAt(result.dreamPrice);

  return (
    <div className="space-y-2">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-44 w-full"
        role="img"
        aria-label="Savings growth over time toward your dream price"
      >
        <line
          x1={pad}
          x2={w - pad}
          y1={targetY}
          y2={targetY}
          stroke="currentColor"
          strokeDasharray="4 3"
          className="text-muted-foreground/60"
        />
        <path
          d={areaPath('initialSavingsGrowth', () => 0)}
          fill="#3b82f6"
          fillOpacity={0.85}
        />
        <path
          d={areaPath(
            'monthlyContributions',
            (p) => p.initialSavingsGrowth,
          )}
          fill="#ef4444"
          fillOpacity={0.8}
        />
        <path
          d={areaPath(
            'interestEarned',
            (p) => p.initialSavingsGrowth + p.monthlyContributions,
          )}
          fill="#eab308"
          fillOpacity={0.85}
        />
      </svg>
      <ul className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" />
          Initial savings
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#ef4444]" />
          Monthly contributions
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#eab308]" />
          Interest earned
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-px w-4 border-t border-dashed border-muted-foreground" />
          Dream price
        </li>
      </ul>
    </div>
  );
}

interface DreamComeTrueFormProps {
  input: DreamComeTrueInput;
  errors: DreamComeTrueFieldErrors;
  result: DreamComeTrueResult | null;
  onChange: (next: DreamComeTrueInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function DreamComeTrueForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: DreamComeTrueFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<DreamComeTrueInput>) =>
    onChange({ ...input, ...patch });

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Estimate how long monthly savings and interest need to grow to fund your goal.
        </p>
        <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      <div>
        <label className={labelClass} htmlFor="dct-currency">
          <span>Display currency</span>
        </label>
        <div className="max-w-[140px]">
          <CurrencySelect
            id="dct-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <div className={labelClass}>
            <label htmlFor="dream-price">Price tag on your dream</label>
            <InfoTooltip
              label="Price tag on your dream"
              text="Total amount needed to buy or achieve your goal."
              align="left"
            />
          </div>
          <FieldShell error={errors.dreamPrice}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="dream-price"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter dream price"
              value={input.dreamPrice}
              aria-invalid={Boolean(errors.dreamPrice)}
              onChange={(event) => set({ dreamPrice: event.target.value })}
            />
          </FieldShell>
          {errors.dreamPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dreamPrice}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="initial-savings">Initial savings</label>
            <InfoTooltip
              label="Initial savings"
              text="Money already saved toward the goal. Earns interest over the saving period."
              align="left"
            />
          </div>
          <FieldShell error={errors.initialSavings}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="initial-savings"
              className={inputClass}
              inputMode="decimal"
              value={input.initialSavings}
              aria-invalid={Boolean(errors.initialSavings)}
              onChange={(event) => set({ initialSavings: event.target.value })}
            />
          </FieldShell>
          {errors.initialSavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialSavings}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="monthly-savings">Monthly savings</label>
            <InfoTooltip
              label="Monthly savings"
              text="End-of-month contribution added each month."
              align="left"
            />
          </div>
          <FieldShell error={errors.monthlySavings}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="monthly-savings"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter monthly savings"
              value={input.monthlySavings}
              aria-invalid={Boolean(errors.monthlySavings)}
              onChange={(event) => set({ monthlySavings: event.target.value })}
            />
          </FieldShell>
          {errors.monthlySavings ? (
            <p className="mt-1 text-xs text-rose-600">{errors.monthlySavings}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="interest-rate">Interest rate (per year)</label>
            <InfoTooltip
              label="Interest rate (per year)"
              text="Nominal annual rate; the engine compounds monthly using rate ÷ 12."
              align="left"
            />
          </div>
          <FieldShell error={errors.annualInterestRate}>
            <input
              id="interest-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.annualInterestRate}
              aria-invalid={Boolean(errors.annualInterestRate)}
              onChange={(event) => set({ annualInterestRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          {errors.annualInterestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRate}</p>
          ) : null}
        </div>
      </div>

      <div>
        <div className={labelClass}>
          <span>Time you need</span>
          <InfoTooltip
            label="Time you need"
            text="Calculated months to reach the dream price, rounded up to a whole month."
            align="left"
          />
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-3 text-sm font-semibold tabular-nums text-accent">
          {result
            ? result.status === 'achieved'
              ? 'Goal achieved!'
              : result.status === 'unreachable'
                ? 'Goal cannot be reached with the current savings plan.'
                : result.timeLabel
            : '—'}
        </div>
      </div>

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

      <section aria-labelledby="dct-chart-heading" className="space-y-2">
        <h3 id="dct-chart-heading" className="text-sm font-semibold text-accent">
          Savings growth
        </h3>
        {result ? (
          <SavingsChart result={result} />
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-8 text-center text-sm text-muted-foreground">
            No data to display
          </p>
        )}
      </section>

      {result && result.goalReachable ? (
        <section
          aria-labelledby="dct-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="dct-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Time required</dt>
              <dd className="font-medium text-accent">{result.timeLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Dream price</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.dreamPrice, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Initial savings</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalInitialSavings, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total monthly contributions</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalMonthlyContributions, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Interest earned</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalInterestEarned, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total savings at goal</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.finalSavingsBalance, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Savings progress</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.savingsProgressPercentage.toFixed(0)}%
              </dd>
            </div>
          </dl>
          <p className="text-xs text-muted-foreground">{result.explanation}</p>
        </section>
      ) : result && !result.goalReachable ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-950">
          {result.statusMessage}
        </p>
      ) : null}
    </form>
  );
}
