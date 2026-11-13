'use client';

import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import { describeResult } from './calculation';
import { periodNoun, type BudgetCategory, type BudgetStatus, type SeventyTwentyTenResult } from './types';

function money(value: number, currency: SupportedCurrency): string {
  return formatCurrencyValue(value, currency);
}

function statusLabel(status: BudgetStatus): string {
  if (status === 'over') return 'Over budget';
  if (status === 'exact') return 'Exact budget';
  return 'Within budget';
}

function BudgetBar({ categories }: { categories: BudgetCategory[] }) {
  const total = categories.reduce((sum, category) => sum + Math.max(category.budget, 0), 0);
  if (total <= 0) return null;
  const fills = ['bg-primary', 'bg-accent', 'bg-muted-foreground/50'];
  return (
    <figure className="rounded-xl border border-border bg-white p-3">
      <figcaption className="text-xs font-medium text-accent">Recommended split</figcaption>
      <div
        className="mt-2 flex h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={categories.map((category) => `${category.label} ${category.percent}%`).join(', ')}
      >
        {categories.map((category, index) => (
          <div
            key={category.key}
            className={fills[index] ?? 'bg-primary'}
            style={{ width: `${(category.budget / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {categories.map((category, index) => (
          <li key={category.key} className="inline-flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-full ${fills[index] ?? 'bg-primary'}`} aria-hidden="true" />
            {category.label} {category.percent}%
          </li>
        ))}
      </ul>
    </figure>
  );
}

function CategoryCard({ category, currency }: { category: BudgetCategory; currency: SupportedCurrency }) {
  const exceeded = category.remaining < 0;
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-xs font-medium text-muted-foreground">
        {category.label} ({category.percent}%)
      </p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent">{money(category.budget, currency)}</p>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        Actual {money(category.spending, currency)}
        {category.usagePercent === null ? '' : ` · ${category.usagePercent.toFixed(1)}% of this budget`}
      </p>
      <p className={`mt-1 text-[11px] font-medium ${exceeded ? 'text-rose-700' : 'text-accent'}`}>
        {statusLabel(category.status)}
        {exceeded ? ` by ${money(-category.remaining, currency)}` : category.remaining > 0 ? ` · ${money(category.remaining, currency)} left` : ''}
      </p>
    </div>
  );
}

export function SeventyTwentyTenResults({ result }: { result: SeventyTwentyTenResult | null }) {
  if (!result?.defined) return null;
  const currency = result.currency;
  const period = periodNoun(result.frequency);
  const incomeLine =
    result.overspending > 0
      ? `Overspending ${money(result.overspending, currency)} this ${period}`
      : result.unallocated === 0
        ? 'Actual spending matches after-tax income'
        : `${money(result.unallocated, currency)} still unallocated this ${period}`;

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <p className="text-[13px] font-medium text-accent">After-tax income /{period}</p>
        <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-accent tabular-nums sm:text-[32px]">
          {money(result.income, currency)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{incomeLine}</p>
      </div>

      <BudgetBar categories={result.categories} />

      <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-3">
        {result.categories.map((category) => (
          <CategoryCard key={category.key} category={category} currency={currency} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-medium text-muted-foreground">Total actual</p>
          <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent">{money(result.totalSpending, currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-medium text-muted-foreground">{result.overspending > 0 ? 'Overspending' : 'Unallocated income'}</p>
          <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent">
            {money(result.overspending > 0 ? result.overspending : result.unallocated, currency)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-medium text-muted-foreground">Monthly income</p>
          <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent">{money(result.monthlyIncome, currency)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-3">
          <p className="text-xs font-medium text-muted-foreground">Annual income</p>
          <p className="mt-1 text-[15px] font-semibold tabular-nums text-accent">{money(result.annualIncome, currency)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[280px] text-left text-xs">
          <caption className="sr-only">Monthly and annual budget for each category</caption>
          <thead>
            <tr className="text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">Category</th>
              <th scope="col" className="px-3 py-2 font-medium">Monthly</th>
              <th scope="col" className="px-3 py-2 font-medium">Annual</th>
            </tr>
          </thead>
          <tbody>
            {result.categories.map((category) => (
              <tr key={category.key} className="border-t border-border tabular-nums text-accent">
                <th scope="row" className="px-3 py-2 font-medium">{category.label}</th>
                <td className="px-3 py-2">{money(category.monthlyBudget, currency)}</td>
                <td className="px-3 py-2">{money(category.annualBudget, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{describeResult(result)}</p>
    </div>
  );
}
