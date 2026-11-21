'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { DiscretionaryIncomeResult } from './types';

interface DiscretionaryIncomeResultsProps {
  result: DiscretionaryIncomeResult | null;
}

export function DiscretionaryIncomeResults({
  result,
}: DiscretionaryIncomeResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  if (result.purpose === 'budgeting') {
    return (
      <div
        className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
        aria-live="polite"
      >
        <h3 className="text-sm font-semibold text-accent">
          Monthly discretionary income (budgeting)
        </h3>
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedBudgetingDi}
        </p>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Take-home income</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTakeHome}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Necessary expenses</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedNecessary}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => setShowSteps((v) => !v)}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          {showSteps ? 'Hide calculation steps' : 'How this result was calculated'}
        </button>
        {showSteps ? (
          <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
            <p className="font-mono">{result.formulaBreakdown}</p>
            <p>{result.explanation}</p>
            <p className="text-muted-foreground">{result.disclaimer}</p>
          </div>
        ) : null}
        <RelatedLinks />
      </div>
    );
  }

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Annual discretionary income
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAnnualDi}
      </p>
      <p className="text-sm text-muted-foreground">
        Monthly: {result.formattedMonthlyDi}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Applicable AGI</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedApplicableAgi}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Poverty guideline ({result.guidelineYear}, {result.povertyRegion})
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPovertyGuideline}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Family size</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.familySize}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Protection multiplier</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.protectionMultiplier != null
              ? `${(result.protectionMultiplier * 100).toFixed(0)}%`
              : '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Protected income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedProtectedIncome}
          </dd>
        </div>
        {result.formattedEstimatedPayment ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Estimated monthly IDR payment
            </dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEstimatedPayment}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Standard: {result.planName}. Source:{' '}
        {result.guidelineSourceUrl ? (
          <a
            href={result.guidelineSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {result.guidelineSourceLabel}
          </a>
        ) : (
          result.guidelineSourceLabel
        )}
        .
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'How this result was calculated'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <p>{result.explanation}</p>
          <p className="text-muted-foreground">{result.disclaimer}</p>
        </div>
      ) : null}

      <RelatedLinks />
    </div>
  );
}

function RelatedLinks() {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      Related:{' '}
      <Link
        href="/tools/adjusted-gross-income-agi-calculator"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        AGI Calculator
      </Link>
      {' · '}
      <Link
        href="/tools/student-loan-calculator"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Student Loan
      </Link>
      {' · '}
      <Link
        href="/tools/student-loan-payment-calculator"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Student Loan Payment
      </Link>
      {' · '}
      <Link
        href="/tools/budget-calculator"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Budget
      </Link>
      {' · '}
      <Link
        href="/tools/annual-income-calculator"
        className="font-medium text-primary underline-offset-2 hover:underline"
      >
        Annual Income
      </Link>
      .
    </p>
  );
}
