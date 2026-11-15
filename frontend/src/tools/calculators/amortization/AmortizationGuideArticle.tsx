import * as React from 'react';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { AMORTIZATION_FAQS } from './content';

export function AmortizationGuideArticle() {
  return (
    <div className="rounded-2xl border border-border bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8">
      <div className="divide-y divide-border">
        {/* 1. What Is an Amortization Calculator? */}
        <article id="what-is-an-amortization-calculator" className="scroll-mt-24 py-7 first:pt-0">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What Is an Amortization Calculator?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              An <strong>Amortization Calculator</strong> is an interactive financial tool designed to model the exact month-by-month or year-by-year repayment schedule of a fixed-rate loan. Unlike simple installment estimators that provide only a top-line monthly payment figure, an amortization calculator reveals the underlying mechanics of your loan: how every single penny of your payment is divided between paying down the principal balance and servicing the lender’s interest charges.
            </p>
            <p>
              By accounting for differing payment frequencies (monthly, biweekly, weekly, quarterly), distinct compounding methods (daily, monthly, semi-annual), and extra principal contributions, this calculator gives borrowers total visibility into their debt payoff trajectory, enabling smarter financial decisions, refinancing analysis, and debt acceleration strategies.
            </p>
          </div>
        </article>

        {/* 2. What Is an Amortized Loan? */}
        <article id="what-is-an-amortized-loan" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            What Is an Amortized Loan?
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The word <em>amortization</em> stems from the Latin root <em>ad-mortire</em>, literally meaning “to bring to death.” In personal and corporate finance, an amortized loan is a structured debt agreement where the borrower pays off both the borrowed principal and accumulated interest through regular, equal payments over a predetermined timeframe until the debt is completely extinguished.
            </p>
            <p>
              Common real-world examples of amortized loans include:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li><strong>Residential Mortgages:</strong> 15-year and 30-year fixed-rate home loans.</li>
              <li><strong>Auto Loans:</strong> 36 to 84-month vehicle financing contracts.</li>
              <li><strong>Personal Loans:</strong> Fixed-term bank or online lender unsecured personal debt.</li>
              <li><strong>Student Loans:</strong> Standard 10-year federal and private education repayment programs.</li>
              <li><strong>Commercial Term Loans:</strong> Equipment and business expansion debt.</li>
            </ul>
            <p>
              This is distinct from <em>interest-only loans</em> (where principal remains untouched during the introductory phase) or <em>balloon loans</em> (which require a large lump-sum payout at maturity).
            </p>
          </div>
        </article>

        {/* 3. How Loan Amortization Works */}
        <article id="how-loan-amortization-works" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How Loan Amortization Works
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The defining trait of an amortizing loan is that while your <strong>total payment remains constant</strong> throughout the loan term, the internal division between interest and principal shifts with every billing cycle:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li><strong>Early Stages:</strong> Because the outstanding balance is at its maximum, interest takes the lion’s share of each payment. Only a modest amount goes toward reducing principal.</li>
              <li><strong>Midway Point:</strong> As consistent payments gradually lower the principal balance, the interest charged each month declines. Correspondingly, a larger share of each installment begins tackling principal.</li>
              <li><strong>Final Stages:</strong> The remaining principal is small, so monthly interest charges dwindle to negligible amounts. Virtually your entire payment goes directly toward clearing the final balance.</li>
            </ol>
          </div>
        </article>

        {/* 4. The Amortization Payment Formula */}
        <article id="amortization-formula" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            The Amortization Payment Formula
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              The regular scheduled payment for a fixed-rate, fully amortizing loan is derived from the standard present-value annuity formula:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs sm:text-sm text-accent">
              P = L × [ r(1 + r)ⁿ ] / [ (1 + r)ⁿ - 1 ]
            </div>
            <p className="text-xs sm:text-[13px] text-muted-foreground">
              Where:
              <br />• <strong>P</strong> = Regular periodic payment (e.g., monthly installment)
              <br />• <strong>L</strong> = Initial loan principal amount
              <br />• <strong>r</strong> = Periodic interest rate per payment cycle
              <br />• <strong>n</strong> = Total number of scheduled payment periods (e.g., 10 years × 12 months = 120)
            </p>
            <p>
              For zero-interest loans (r = 0), the formula simplifies cleanly to:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs sm:text-sm text-accent">
              P = L / n
            </div>
          </div>
        </article>

        {/* 5. How to Calculate Monthly Payments */}
        <article id="how-to-calculate-monthly-payments" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How to Calculate Monthly Payments Step-by-Step
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              To see how the numbers come together in practice, consider a <strong>$10,000 personal loan</strong> at a <strong>12.5% annual interest rate</strong> with a <strong>10-year term</strong> paid monthly:
            </p>
            <ol className="list-decimal space-y-3 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>Convert Annual Rate to Monthly Periodic Rate:</strong>
                <br />
                <span className="font-mono text-xs sm:text-sm text-accent">
                  r = 0.125 / 12 = 0.01041667 (1.04167% per month)
                </span>
              </li>
              <li>
                <strong>Calculate Total Payment Periods:</strong>
                <br />
                <span className="font-mono text-xs sm:text-sm text-accent">
                  n = 10 years × 12 months = 120 periods
                </span>
              </li>
              <li>
                <strong>Calculate Compound Growth Factor:</strong>
                <br />
                <span className="font-mono text-xs sm:text-sm text-accent">
                  (1 + r)ⁿ = (1 + 0.01041667)¹²⁰ = 3.469505
                </span>
              </li>
              <li>
                <strong>Solve for Monthly Payment P:</strong>
                <br />
                <span className="font-mono text-xs sm:text-sm text-accent">
                  P = 10,000 × [ 0.01041667 × 3.469505 ] / [ 3.469505 - 1 ] = $146.38
                </span>
              </li>
            </ol>
            <p>
              Over 120 months, you will make 120 payments of $146.38, totaling <strong>$17,565.76</strong>. Of that total, $10,000 repays your initial loan and <strong>$7,565.76</strong> represents total interest charges.
            </p>
          </div>
        </article>

        {/* 6. Reading an Amortization Schedule */}
        <article id="loan-amortization-schedule" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Reading an Amortization Schedule
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              An amortization schedule is an itemized ledger detailing every payment cycle from loan inception to payoff. Each row contains crucial tracking variables:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-border">
                <thead className="bg-muted text-foreground font-semibold">
                  <tr>
                    <th className="p-2.5 border-b border-border">Column</th>
                    <th className="p-2.5 border-b border-border">What It Represents</th>
                    <th className="p-2.5 border-b border-border">Mathematical Formula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-2.5 font-medium">Opening Balance</td>
                    <td className="p-2.5 text-muted-foreground">Unpaid principal remaining at the start of the period</td>
                    <td className="p-2.5 font-mono text-xs">Prior Ending Balance</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Interest Paid</td>
                    <td className="p-2.5 text-muted-foreground">The cost of carrying debt for that single billing cycle</td>
                    <td className="p-2.5 font-mono text-xs">Opening Balance × Periodic Rate</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Principal Paid</td>
                    <td className="p-2.5 text-muted-foreground">Portion of the payment that reduces the debt balance</td>
                    <td className="p-2.5 font-mono text-xs">Scheduled Payment - Interest Paid</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Extra Payment</td>
                    <td className="p-2.5 text-muted-foreground">Additional discretionary funds sent directly toward principal</td>
                    <td className="p-2.5 font-mono text-xs">User Input</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-medium">Closing Balance</td>
                    <td className="p-2.5 text-muted-foreground">Remaining loan principal carried over into the next cycle</td>
                    <td className="p-2.5 font-mono text-xs">Opening - Principal - Extra</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </article>

        {/* 7. Principal vs Interest Breakdown */}
        <article id="principal-vs-interest" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Principal vs. Interest Over Time
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              A major surprise for first-time borrowers is the <strong>front-loaded nature of interest</strong> on long-term loans.
            </p>
            <p>
              In our 10-year, 12.5% loan example:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>Payment 1:</strong> Of the $146.38 payment, <strong>$104.17 (71.2%)</strong> pays interest and only <strong>$42.21 (28.8%)</strong> pays principal.
              </li>
              <li>
                <strong>Payment 60 (Year 5):</strong> The interest portion falls to <strong>$68.96</strong>, while principal climbs to <strong>$77.42</strong>.
              </li>
              <li>
                <strong>Payment 120 (Final Month):</strong> Interest drops to just <strong>$1.50</strong>, and <strong>$144.88 (99.0%)</strong> clears the remaining balance.
              </li>
            </ul>
            <p>
              On a 30-year mortgage, this dynamic is even more pronounced: borrowers routinely spend the first 7 to 10 years paying mostly interest before substantial equity builds.
            </p>
          </div>
        </article>

        {/* 8. Compounding Frequency vs Payment Frequency */}
        <article id="compounding-vs-payment-frequency" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Compounding Frequency vs. Payment Frequency
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Borrowers often confuse how frequently payments occur with how often interest compounds. In modern banking, these two frequencies do not always match:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>United States Consumer Lending:</strong> Mortgages, auto loans, and student loans typically compound monthly (m = 12) with monthly payments (p = 12). Credit cards compound daily (m = 365).
              </li>
              <li>
                <strong>Canadian Mortgages:</strong> Under the Canadian Bank Act, fixed-rate residential mortgages legally compound <strong>semi-annually</strong> (m = 2), not in advance, even when homeowners pay monthly (p = 12) or biweekly (p = 26).
              </li>
            </ul>
            <p>
              When compounding occurs m times per year and payments occur p times per year, our engine utilizes the exact effective periodic interest rate conversion formula:
            </p>
            <div className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 font-mono text-xs sm:text-sm text-accent">
              r = (1 + Nominal APR / m)^(m / p) - 1
            </div>
            <p className="text-xs sm:text-[13px] text-muted-foreground">
              This mathematical rigor ensures exact payment accuracy across daily, monthly, quarterly, semi-annual, and annual financial products globally.
            </p>
          </div>
        </article>

        {/* 9. How Extra Payments Accelerate Payoff */}
        <article id="how-extra-payments-affect-amortization" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            How Extra Payments Accelerate Payoff
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Extra payments operate under a <strong>reduce-term strategy</strong>. By allocating 100% of the extra contribution directly against the unpaid principal, you instantly eliminate the future compound interest that principal would have generated for the remainder of the loan.
            </p>
            <p>
              For example, adding just <strong>$50 per month</strong> to our $10,000, 10-year, 12.5% loan produces dramatic savings:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li><strong>Original Payoff Time:</strong> 120 months (10 years)</li>
              <li><strong>Accelerated Payoff Time:</strong> 72 months (6.0 years)</li>
              <li><strong>Time Saved:</strong> 48 months (4 full years of debt freedom!)</li>
              <li><strong>Total Interest Paid:</strong> Drops from $7,565.76 to $4,124.89</li>
              <li><strong>Total Cash Saved:</strong> Over <strong>$3,440</strong> in saved interest charges</li>
            </ul>
          </div>
        </article>

        {/* 10. 5 Strategies to Pay Off Loans Faster */}
        <article id="how-to-pay-off-a-loan-faster" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            5 Proven Strategies to Pay Off Loans Faster
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <ol className="list-decimal space-y-3 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>Biweekly Payment Schedule:</strong> Instead of paying monthly (12 payments/year), pay half your monthly installment every two weeks (26 half-payments = 13 full payments/year). That single extra annual payment can trim 4 to 6 years off a 30-year mortgage.
              </li>
              <li>
                <strong>Round Up Installments:</strong> Round your monthly payment up to the nearest $50 or $100. If your payment is $342, pay $400. That modest extra $58 steadily chips away at balance without straining your lifestyle.
              </li>
              <li>
                <strong>Lump-Sum Windfalls:</strong> Direct tax refunds, annual performance bonuses, or cash gifts directly to principal via our calculator’s One-Time Lump Sum option.
              </li>
              <li>
                <strong>Refinance to Shorter Terms:</strong> If market rates drop or your credit score improves, refinancing from a 30-year into a 15-year term secures lower interest rates and forces aggressive amortization.
              </li>
              <li>
                <strong>Snowball or Avalanche Debt Stacking:</strong> Once a credit card or auto loan is paid off, roll that freed-up monthly cash flow directly into your remaining loan as a recurring extra payment.
              </li>
            </ol>
          </div>
        </article>

        {/* 11. Step-by-Step Worked Example */}
        <article id="amortization-examples" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Step-by-Step Worked Example (First 3 Months)
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              Here is the exact numerical walkthrough for the opening 3 months of our baseline <strong>$10,000 loan at 12.5%</strong>:
            </p>
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-accent">Month 1:</p>
                <p className="text-muted-foreground">Opening Balance: $10,000.00</p>
                <p className="text-muted-foreground">Interest = $10,000 × (0.125 / 12) = $104.17</p>
                <p className="text-muted-foreground">Principal Paid = $146.38 - $104.17 = $42.21</p>
                <p className="font-medium text-foreground">Closing Balance = $10,000.00 - $42.21 = $9,957.79</p>
              </div>
              <div className="border-t border-border/60 pt-3">
                <p className="font-semibold text-accent">Month 2:</p>
                <p className="text-muted-foreground">Opening Balance: $9,957.79</p>
                <p className="text-muted-foreground">Interest = $9,957.79 × (0.125 / 12) = $103.73</p>
                <p className="text-muted-foreground">Principal Paid = $146.38 - $103.73 = $42.65</p>
                <p className="font-medium text-foreground">Closing Balance = $9,957.79 - $42.65 = $9,915.14</p>
              </div>
              <div className="border-t border-border/60 pt-3">
                <p className="font-semibold text-accent">Month 3:</p>
                <p className="text-muted-foreground">Opening Balance: $9,915.14</p>
                <p className="text-muted-foreground">Interest = $9,915.14 × (0.125 / 12) = $103.28</p>
                <p className="text-muted-foreground">Principal Paid = $146.38 - $103.28 = $43.10</p>
                <p className="font-medium text-foreground">Closing Balance = $9,915.14 - $43.10 = $9,872.04</p>
              </div>
            </div>
            <p>
              Notice how the interest charge declines each month ($104.17 → $103.73 → $103.28) while principal reduction steadily grows ($42.21 → $42.65 → $43.10).
            </p>
          </div>
        </article>

        {/* 12. Fixed-Rate vs Variable-Rate Loans */}
        <article id="fixed-rate-vs-variable-rate" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Fixed-Rate vs. Variable-Rate Amortization
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <p>
              This calculator models <strong>fixed-rate amortization</strong>, where the contract interest rate remains locked for the entire term. If you hold an adjustable-rate mortgage (ARM) or variable-rate loan, the amortization schedule recasts whenever the interest rate resets:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>When Rates Rise:</strong> On an adjustable loan, if interest rates climb, your monthly payment must increase to maintain the original amortization timeline. If your payment is artificially capped, you risk <em>negative amortization</em>, where unpaid interest is added to your principal balance.
              </li>
              <li>
                <strong>When Rates Fall:</strong> Your required installment decreases, or more of your fixed payment flows into principal, accelerating payoff.
              </li>
            </ul>
          </div>
        </article>

        {/* 13. Common Amortization Mistakes */}
        <article id="common-amortization-mistakes" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Common Amortization Mistakes to Avoid
          </h2>
          <div className="mt-3.5 space-y-4 text-[15px] font-normal leading-[1.72] text-foreground/85 sm:text-base sm:leading-[1.75]">
            <ul className="list-disc space-y-2 pl-5 text-[15px] text-foreground/85 sm:text-base">
              <li>
                <strong>Failing to Specify Principal-Only on Extra Payments:</strong> When sending extra funds to your loan servicer, explicitly designate the payment as “Principal Reduction Only.” Otherwise, some servicers may hold funds as an advance on next month’s payment.
              </li>
              <li>
                <strong>Ignoring Prepayment Penalties:</strong> While most modern mortgages and consumer loans prohibit prepayment penalties, some subprime or commercial agreements charge fees for early payoff. Always review your loan promissory note.
              </li>
              <li>
                <strong>Overlooking Escrow Charges:</strong> Mortgage lenders typically bundle property taxes, homeowners insurance, and private mortgage insurance (PMI) into your monthly billing. The amortization payment calculated here covers pure principal and interest (P&I).
              </li>
              <li>
                <strong>Focusing Only on Monthly Payment:</strong> Extending a loan from 4 years to 7 years lowers your monthly payment, but substantially increases total interest paid over the life of the loan.
              </li>
            </ul>
          </div>
        </article>

        {/* 14. Frequently Asked Questions */}
        <article id="frequently-asked-questions" className="scroll-mt-24 py-7">
          <h2 className="text-[21px] font-semibold leading-snug tracking-tight text-accent sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-5">
            <FAQAccordion items={[...AMORTIZATION_FAQS]} />
          </div>
        </article>
      </div>
    </div>
  );
}
