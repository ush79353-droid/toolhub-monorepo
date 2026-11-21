'use client';

import Link from 'next/link';
import { GST_CALCULATOR_HREF } from './types';

interface AustraliaTaxCutsFormProps {
  /** Optional override for embed or tests; defaults to verified GST catalog slug. */
  gstHref?: string;
}

/**
 * Screenshot-first unavailable notice (ADR-023): no tax inputs, brackets, or refund fields.
 * GST Calculator slug verified in Mongo: `gst-calculator`.
 */
export function AustraliaTaxCutsForm({
  gstHref = GST_CALCULATOR_HREF,
}: AustraliaTaxCutsFormProps) {
  return (
    <div
      className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 text-sm leading-relaxed text-accent sm:px-5 sm:py-5 sm:text-[15px]"
      role="status"
      aria-live="polite"
      aria-label="Income tax cuts calculator unavailable notice"
    >
      <p className="font-semibold text-accent">
        Sorry, but this calculator is unavailable at this time.
      </p>
      <p className="mt-3">
        Alternatively, you might be interested in our{' '}
        <Link
          href={gstHref}
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
        >
          GST Calculator
        </Link>
        .
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
        This page refers to Australia&apos;s Federal Budget 2020/21 income tax cuts as a historical
        topic only. It does not calculate current Australian income tax and does not invent brackets,
        refunds, or eligibility conditions.
      </p>
    </div>
  );
}
