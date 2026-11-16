import * as React from 'react';
import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { STUDENT_LOAN_REPAYMENT_COVID_FAQS } from './content';

export function StudentLoanRepaymentCovidGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        <article id="historical-overview" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Overview
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              During the COVID-19 emergency, U.S. federal policy temporarily suspended certain federal
              student loan payments and applied a zero percent interest rate under the Coronavirus Aid,
              Relief, and Economic Security (CARES) Act and related extensions. An earlier public notice
              referenced an automatic suspension lasting through{' '}
              <strong>December 31, 2020</strong> — that date is historical context only.
            </p>
            <p>
              This page preserves that historical information. It does not run repayment math and does
              not model current federal repayment plans, IDR, forgiveness, or servicer-specific rules.
            </p>
          </div>
        </article>

        <article id="why-no-longer-valid" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Why COVID-Era Calculations Are Not Valid
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The emergency payment pause and temporary 0% interest environment described in older
              calculators ended after the pandemic relief period. Any COVID-era repayment illustrations
              tied to that pause are obsolete for today’s balances, rates, and due dates.
            </p>
            <p>
              Do not treat this notice as a claim that current federal student loans are paused or
              interest-free. Applicable rates and repayment obligations depend on loan type, status,
              and your servicer’s current guidance.
            </p>
          </div>
        </article>

        <article id="current-guidance" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Current Repayment Guidance
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              For official payment amounts, interest accrual, and forbearance or repayment-plan options,
              consult your loan servicer and current U.S. Department of Education guidance.
            </p>
            <p>
              For a general monthly payment estimate with fees and extra payment options, use our{' '}
              <Link
                href="/tools/loan-calculator"
                className="font-semibold text-primary underline underline-offset-2"
              >
                Loan Calculator
              </Link>
              .
            </p>
          </div>
        </article>

        <article id="slrc-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={[...STUDENT_LOAN_REPAYMENT_COVID_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
