'use client';

import Link from 'next/link';
import { ANNUAL_SALARY_CALCULATOR_HREF } from './types';

interface HealsHeroesUnemploymentBenefitFormProps {
  /** Optional override for embed or tests; defaults to the live Annual Salary Calculator. */
  annualSalaryHref?: string;
}

/**
 * Screenshot-first historical notice (ADR-023): no benefit inputs or payout fields.
 * HEALS / HEROES are labeled as 2020 legislative proposals, not enacted claim programs.
 */
export function HealsHeroesUnemploymentBenefitForm({
  annualSalaryHref = ANNUAL_SALARY_CALCULATOR_HREF,
}: HealsHeroesUnemploymentBenefitFormProps) {
  return (
    <div
      className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 text-sm leading-relaxed text-accent sm:px-5 sm:py-5 sm:text-[15px]"
      role="note"
      aria-label="HEALS Act vs HEROES Act historical unemployment benefit notice"
    >
      <p>
        The <em>HEALS Act</em> package included the{' '}
        <em>American Workers, Families, and Employers Assistance Act</em> — a 2020 Republican
        Senate legislative proposal that sat between the enacted Coronavirus Aid, Relief, and
        Economic Security (CARES) Act and the House Democratic{' '}
        <em>Health and Economic Recovery Omnibus Emergency Solutions (HEROES) Act</em> proposal.
        The two proposals took different approaches to pandemic unemployment assistance. Neither
        HEALS nor HEROES should be treated as an active unemployment benefit program you can claim
        today.
      </p>
      <p className="mt-3 italic">
        Historical calculations associated with these proposals are no longer applicable to current
        benefit claims.
      </p>
      <p className="mt-3">
        We would like to draw your attention to our{' '}
        <Link
          href={annualSalaryHref}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Annual Salary Calculator
        </Link>{' '}
        to quickly determine your yearly salary.{' '}
        <em>
          It can also help with hourly wage conversions, which may be useful when looking through
          job offers.
        </em>
      </p>
    </div>
  );
}
