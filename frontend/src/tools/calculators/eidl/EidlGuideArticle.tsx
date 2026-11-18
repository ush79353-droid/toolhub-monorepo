import * as React from 'react';
import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EIDL_FAQS } from './content';

export function EidlGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {/* 1. Overview & Historical Context */}
        <article id="overview-and-history" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Overview & Historical Context
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              In response to the unprecedented global economic disruption caused by the COVID-19 pandemic,
              the United States Congress passed the Coronavirus Aid, Relief, and Economic Security (CARES)
              Act in March 2020. Among several vital liquidity provisions administered by the U.S. Small
              Business Administration (SBA), the <strong>Economic Injury Disaster Loan Emergency Advance
              (EIDL)</strong> was established to provide rapid financial assistance to struggling small
              enterprises and independent contractors.
            </p>
            <p>
              Unlike conventional disaster assistance loans that require extensive financial underwriting and
              collateral pledging, the Emergency Advance was engineered as a rapid-response emergency grant
              designed to deliver capital within days of application submission.
            </p>
          </div>
        </article>

        {/* 2. Historical Advance Structure */}
        <article id="historical-advance-structure" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Historical Advance Structure & Grant Amounts
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Under original administrative guidelines, the SBA disbursed emergency advances based on the
              following tiering:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Per-Employee Allocation:</strong> Eligible applicants received $1,000 per
                active employee on payroll at the time of application.
              </li>
              <li>
                <strong>Statutory Ceiling:</strong> Emergency advances were capped at a maximum of $10,000
                regardless of overall workforce size.
              </li>
              <li>
                <strong>Sole Proprietors & Contractors:</strong> Independent contractors, freelancers, and
                single-member LLCs with no W-2 staff were eligible for a baseline $1,000 advance.
              </li>
            </ul>
          </div>
        </article>

        {/* 3. Advance vs. EIDL Loan */}
        <article id="advance-vs-loan" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Advance (Grant) vs. EIDL Loan: Crucial Differences
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              It is vital to distinguish between the <em>EIDL Advance</em> and the underlying <em>EIDL Loan</em>:
            </p>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h3 className="font-semibold text-accent">EIDL Emergency Advance</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  100% forgivable emergency grant. Applicants did not have to repay this capital even if
                  subsequently denied approval for the main term loan.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <h3 className="font-semibold text-accent">Standard EIDL Term Loan</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  A 30-year amortized debt obligation (3.75% fixed interest for businesses, 2.75% for nonprofits)
                  requiring monthly repayment following initial deferral periods.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* 4. Program Closure Timeline */}
        <article id="program-closure-timeline" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Program Closure & Expiration
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The SBA officially depleted its congressionally allocated statutory funding for the Emergency
              Advance program in July 2020. Subsequent targeted advance supplements through the American
              Rescue Plan Act were constrained to low-income operational zones and have also permanently
              lapsed.
            </p>
            <p>
              As the global pandemic health emergency has concluded, all temporary eligibility calculations,
              headcount allocation models, and emergency grant matrices are obsolete and invalid for ongoing
              commercial borrowing decisions.
            </p>
          </div>
        </article>

        {/* 5. Current Small Business Alternatives */}
        <article id="current-loan-alternatives" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Current Small Business Loan Alternatives
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Business owners seeking capital today must rely on contemporary commercial financing products
              including SBA 7(a) working capital loans, SBA 504 real estate/equipment loans, bank credit
              facilities, and commercial merchant lines.
            </p>
            <p>
              To evaluate modern amortized loan terms, monthly debt service requirements, and true Annual
              Percentage Rates (APR), please explore our dedicated interactive tools:
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/tools/loan-calculator"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-accent shadow-xs transition-colors hover:bg-muted/40"
              >
                <span>Loan Calculator</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/tools/business-loan-calculator"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-accent shadow-xs transition-colors hover:bg-muted/40"
              >
                <span>Business Loan Calculator</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </article>

        {/* 6. Frequently Asked Questions */}
        <article id="eidl-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={EIDL_FAQS} />
          </div>
        </article>
      </div>
    </div>
  );
}
