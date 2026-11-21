'use client';

import Link from 'next/link';
import { LOAN_CALCULATOR_HREF } from './types';

interface LwaUnemploymentBenefitFormProps {
  /** Optional override for embed or tests; defaults to the live Loan Calculator. */
  loanHref?: string;
}

/**
 * Screenshot-first historical notice (ADR-023): no benefit inputs or payout fields.
 * Corrects the reference-site “LWA Act” wording — LWA was executive/FEMA, not a statute.
 */
export function LwaUnemploymentBenefitForm({
  loanHref = LOAN_CALCULATOR_HREF,
}: LwaUnemploymentBenefitFormProps) {
  return (
    <div
      className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 text-sm leading-relaxed text-accent sm:px-5 sm:py-5 sm:text-[15px]"
      role="note"
      aria-label="Lost Wages Assistance historical unemployment benefit notice"
    >
      <p>
        Lost Wages Assistance (LWA) was a temporary U.S. pandemic unemployment assistance
        program in 2020. It was authorized by a presidential memorandum and administered
        through FEMA Other Needs Assistance grants to states and territories — not through
        an enacted “LWA Act.”
      </p>
      <p className="mt-3">
        LWA followed earlier CARES Act unemployment assistance (including Federal Pandemic
        Unemployment Compensation) after that temporary $600 weekly supplement ended. It was
        a short-term FEMA-funded alternative while Congress debated further relief.
      </p>
      <p className="mt-3 italic text-foreground/85">
        The program has ended. Historical LWA benefit calculations are no longer applicable to
        current claims.
      </p>
      <p className="mt-3">
        We would like to invite you to try out our{' '}
        <Link
          href={loanHref}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          loan calculator
        </Link>
        , which allows you to get an estimate of the monthly installments on a loan, as well
        as total interest paid.
      </p>
    </div>
  );
}
