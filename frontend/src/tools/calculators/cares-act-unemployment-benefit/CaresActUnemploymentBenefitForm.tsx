'use client';

import Link from 'next/link';
import { UNEMPLOYMENT_CALCULATOR_HREF } from './types';

interface CaresActUnemploymentBenefitFormProps {
  /** Optional override for embed or tests; defaults to the catalog unemployment-rate tool. */
  unemploymentHref?: string;
}

/**
 * Screenshot-first historical notice (ADR-023): no benefit inputs or payout fields.
 * Official Act name uses “Relief” (not the screenshot’s “Response”).
 */
export function CaresActUnemploymentBenefitForm({
  unemploymentHref = UNEMPLOYMENT_CALCULATOR_HREF,
}: CaresActUnemploymentBenefitFormProps) {
  return (
    <div
      className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 text-sm leading-relaxed text-accent sm:px-5 sm:py-5 sm:text-[15px]"
      role="note"
      aria-label="CARES Act historical unemployment benefit notice"
    >
      <p>
        The Coronavirus Aid, Relief, and Economic Security (CARES) Act was introduced as a
        financial relief package for people who lost jobs due to the global pandemic.
      </p>
      <p className="mt-3">
        Those historical unemployment benefit calculations are no longer applicable to current
        claims.
      </p>
      <p className="mt-3">
        We would like to invite you to try out our{' '}
        <Link
          href={unemploymentHref}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Unemployment calculator
        </Link>{' '}
        that helps measure the unemployment rate in a given country.
      </p>
    </div>
  );
}
