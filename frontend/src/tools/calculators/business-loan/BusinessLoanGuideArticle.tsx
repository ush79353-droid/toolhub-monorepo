import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BUSINESS_LOAN_FAQS } from './content';

export function BusinessLoanGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {/* 1. Understanding Business Loans */}
        <article id="understanding-business-loans" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Understanding Commercial Business Loans
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              A commercial business loan provides enterprise capital for equipment purchases, working
              capital expansion, inventory financing, commercial real estate acquisition, or debt
              refinancing. Unlike simple consumer credit, commercial credit structures frequently
              involve layered fee schedules, distinct compounding cycles, and tailored repayment
              mechanisms.
            </p>
            <p>
              When evaluating commercial financing, analyzing the stated nominal interest rate alone
              can be misleading. Lenders frequently charge upfront origination fees, administrative
              closing charges, and financed documentation fees that significantly increase the true
              cost of borrowing. This calculator computes the exact periodic amortized debt service,
              total finance charges, and true Annual Percentage Rate (APR).
            </p>
          </div>
        </article>

        {/* 2. Business Loan Amortization Formula */}
        <article id="amortization-formula" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Business Loan Amortization Formula
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Standard commercial term loans follow an amortizing annuity payment schedule where
              each periodic payment covers accrued interest and reduces outstanding principal:
            </p>
          </div>
          <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-brand-softTeal/55 px-4 py-3.5 sm:px-5">
            <p className="font-mono text-xs font-semibold text-accent sm:text-sm">
              PMT = P × [ r / (1 - (1 + r)^(-n)) ]
            </p>
            <p className="mt-2 text-xs font-normal leading-relaxed text-muted-foreground sm:text-[13px]">
              Where <strong>P</strong> is total financed principal, <strong>r</strong> is the effective
              interest rate per payment cycle, and <strong>n</strong> is the total number of scheduled
              payments across the loan term.
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm text-foreground/80">
            <p>
              When interest compounds at frequency <em>m</em> and payments occur at frequency <em>p</em>,
              the periodic rate is adjusted using the effective annual rate conversion:
            </p>
            <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs text-accent">
              r = (1 + (NominalRate / m))^ (m / p) - 1
            </div>
          </div>
        </article>

        {/* 3. Interest Rate vs. APR vs. Effective APR */}
        <article id="interest-vs-apr" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Interest Rate vs. APR vs. Effective APR
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Business owners often encounter three distinct rate metrics in loan term sheets:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Nominal Interest Rate:</strong> The contractual base rate applied directly to
                the outstanding loan principal balance. It ignores all closing fees and third-party costs.
              </li>
              <li>
                <strong>Annual Percentage Rate (APR):</strong> The annualized internal rate of return
                (IRR) connecting the actual net cash received at closing with all subsequent scheduled
                debt payments. APR incorporates origination points, prepaid fees, and financed costs.
              </li>
              <li>
                <strong>Effective APR (EAR):</strong> Accounts for the intra-year compounding of the
                periodic APR rate: <code>(1 + r_apr)^p - 1</code>. This reflects the true economic yield
                demanded by the capital provider.
              </li>
            </ul>
          </div>
        </article>

        {/* 4. Commercial Fees Explained */}
        <article id="commercial-fees-explained" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Prepaid, Loaned, & Origination Fees
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Commercial lenders classify closing costs into three primary categories:
            </p>
            <ul className="list-disc space-y-2.5 pl-5 marker:text-muted-foreground">
              <li>
                <strong>Prepaid Fees:</strong> Out-of-pocket expenses due at loan closing (e.g., legal
                counsel, appraisal fees, or filing costs). These do not increase loan principal but reduce
                the net cash proceeds realized by your company.
              </li>
              <li>
                <strong>Loaned (Financed) Fees:</strong> Lender or underwriting expenses added directly
                into the loan principal balance. You borrow these funds, meaning they incur interest charges
                over the entire loan term.
              </li>
              <li>
                <strong>Origination Fee:</strong> A percentage fee charged by the lender for underwriting
                and issuing the credit facility (typically 1% to 8%).
              </li>
            </ul>
          </div>
        </article>

        {/* 5. Origination Fee Repayment Options */}
        <article id="repayment-methods" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Origination Fee Repayment Options Explained
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Our calculator models all three standard commercial origination fee structures:
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs">
                <strong className="block text-accent">1. From the loan amount</strong>
                <span className="mt-1 block text-muted-foreground">
                  The fee is subtracted directly from gross loan proceeds at disbursement. Your principal
                  remains the stated loan amount plus loaned fees, but net cash received is lower.
                </span>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs">
                <strong className="block text-accent">2. Rolling into the loan</strong>
                <span className="mt-1 block text-muted-foreground">
                  The fee is added to the financed principal balance. You receive the full stated loan amount,
                  but your monthly payment and total interest are higher.
                </span>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3.5 text-xs">
                <strong className="block text-accent">3. Out of pocket</strong>
                <span className="mt-1 block text-muted-foreground">
                  The fee is paid as a cash charge at closing. You receive the full requested loan proceeds,
                  and debt service is calculated solely on principal plus loaned fees.
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* 6. Step-by-Step Calculation Example */}
        <article id="step-by-step-example" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Step-by-Step Calculation Example
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Consider a 10-year term business loan of <strong>100,000 PKR</strong> at <strong>5.0%</strong> nominal
              interest compounded monthly with monthly payments, a <strong>500 PKR</strong> prepaid fee, a{' '}
              <strong>1,000 PKR</strong> loaned fee, and an <strong>8.0%</strong> origination fee deducted from loan proceeds:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-foreground/85 marker:text-muted-foreground">
              <li>
                <strong>Financed Principal:</strong> 100,000 + 1,000 (loaned fee) = <strong>101,000 PKR</strong>.
              </li>
              <li>
                <strong>Origination Fee:</strong> 8% of 100,000 = <strong>8,000 PKR</strong>.
              </li>
              <li>
                <strong>Net Disbursed to Borrower:</strong> 100,000 - 8,000 = <strong>92,000 PKR</strong>.
              </li>
              <li>
                <strong>Scheduled Monthly Payment:</strong> 101,000 × (0.05 / 12) / [1 - (1 + 0.05 / 12)^(-120)] ={' '}
                <strong>1,071.26 PKR</strong>.
              </li>
              <li>
                <strong>Total Scheduled Payments:</strong> 120 × 1,071.2618 = <strong>128,551.40 PKR</strong>.
              </li>
              <li>
                <strong>Total Interest Paid:</strong> 128,551.40 - 101,000 = <strong>27,551.40 PKR</strong>.
              </li>
              <li>
                <strong>Total Payment:</strong> 128,551.40 + 500 (prepaid fee) = <strong>129,051.40 PKR</strong>.
              </li>
              <li>
                <strong>Total Finance Charge:</strong> 27,551.40 (interest) + 8,000 (origination) + 1,000 (loaned) + 500 (prepaid) ={' '}
                <strong>37,051.40 PKR</strong>.
              </li>
              <li>
                <strong>Annual Percentage Rate (APR):</strong> <strong>7.15%</strong> (Effective APR:{' '}
                <strong>7.39%</strong>).
              </li>
            </ul>
          </div>
        </article>

        {/* 7. Frequently Asked Questions */}
        <article id="business-loan-faq" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-4">
            <FAQAccordion items={BUSINESS_LOAN_FAQS} />
          </div>
        </article>
      </div>
    </div>
  );
}
