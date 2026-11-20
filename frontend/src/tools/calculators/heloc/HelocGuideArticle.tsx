import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HELOC_FAQS } from './content';

export function HelocGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-heloc"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is a HELOC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A Home Equity Line of Credit (HELOC) is revolving credit secured by the
        equity in your home. Lenders approve a credit limit based on home value,
        existing mortgage debt, and underwriting. You generally pay interest on
        the outstanding drawn balance, not the full limit. Because the home is
        collateral, unpaid obligations can put the property at risk of
        foreclosure. Products and eligibility differ by lender and jurisdiction.
      </p>

      <h2
        id="how-heloc-works"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does a HELOC Work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        After approval you receive a credit line. During the draw period you may
        borrow (subject to lender rules) and often make interest-only payments.
        When the draw period ends, the repayment period typically begins:
        additional draws stop under standard arrangements, and you repay
        principal and interest on a schedule. Many HELOCs use adjustable rates
        tied to an index plus a margin.
      </p>

      <h2
        id="draw-period"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Draw Period
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        During an interest-only draw period, the monthly interest payment equals
        balance × (APR ÷ 12). If you pay only interest and make no extra
        principal payments or new draws, the principal stays flat. Variable rates
        change the interest-only amount when the APR changes. At the end of the
        draw period, remaining principal usually enters repayment.
      </p>

      <h2
        id="repayment-period"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Repayment Period
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In repayment, payments amortize principal and interest so the balance
        declines toward zero over the remaining term. Switching from interest-only
        to principal-and-interest often raises the monthly payment (payment
        shock), even when the rate is unchanged. Rate adjustments during
        repayment typically recalculate the installment using remaining balance
        and remaining months — not a brand-new term.
      </p>

      <h2
        id="heloc-loan-amount"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate HELOC Loan Amount
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Available credit is often illustrated as:
      </p>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Potential credit = (Home value × CLTV limit) − existing mortgage debt</p>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
        Appraisal, income, creditworthiness, and lender policy determine actual
        eligibility. This calculator starts from a current outstanding HELOC
        balance, not from home-value underwriting.
      </p>

      <h2
        id="heloc-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate HELOC Payment
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Draw (interest-only): Payment = Balance × APR / 1200</p>
        <p>Example: 50,000 × 0.06 / 12 = 250</p>
        <p>Repayment (amortizing): M = P × r / (1 − (1 + r)^(−n))</p>
        <p>where r = APR/1200 and n = repayment months</p>
        <p>Example: 50,000 at 6% for 240 months ≈ 358.22</p>
        <p>When APR = 0: M = P / n</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the HELOC Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the current HELOC balance.</li>
        <li>Set the draw period in years.</li>
        <li>Enter the repayment term in years.</li>
        <li>Enter the initial annual interest rate.</li>
        <li>Add percentage and fixed upfront fees.</li>
        <li>Enter the annual fee (charged every 12 months in the model).</li>
        <li>Optionally enable rate adjustments, timing, interval, and cap.</li>
        <li>Review draw and repayment monthly payments.</li>
        <li>Inspect the amortization schedule and chart.</li>
        <li>Use Reload for defaults or Clear to empty inputs.</li>
      </ol>

      <h2
        id="fixed-vs-variable"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed vs. Variable HELOC Interest Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed rates keep the same APR for the modeled term. Variable rates can
        move with an index, often with caps, floors, and a margin. This tool’s
        adjustment schedule is a planning assumption — it does not predict future
        market rates or reproduce every lender’s contractual rules.
      </p>

      <h2
        id="heloc-fees"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Fees and Additional Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Common costs include origination, appraisal, application, annual
        maintenance, and sometimes early closure fees. Here, total upfront fees =
        (balance × fee % / 100) + fixed upfront fees, paid separately from
        principal. Annual fees are applied once per year across the full modeled
        term unless you set the fee to zero.
      </p>

      <h2
        id="heloc-vs-home-equity-loan"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC vs. Home Equity Loan
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A HELOC is a revolving line with draw flexibility and often variable
        rates. A home equity loan is typically a lump-sum installment loan with a
        fixed schedule from the start. Choose based on whether you need ongoing
        access to credit or a single disbursement.
      </p>

      <h2
        id="pros-cons"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Advantages and Disadvantages
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Advantages can include flexible borrowing, interest charged mainly on
        outstanding draws, and access to substantial credit when equity and
        underwriting allow. Disadvantages include using the home as collateral,
        variable-rate risk, higher payments in repayment, fees, and the temptation
        to overborrow.
      </p>

      <h2
        id="reduce-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Reduce HELOC Interest Costs
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Pay principal earlier when cash flow allows, avoid unnecessary
        withdrawals, compare rate terms and caps, monitor variable-rate changes,
        and review lender conditions before drawing.
      </p>

      <h2
        id="draw-ends"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens When the Draw Period Ends?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 50,000 balance at 6% with interest-only payments of 250 during
        the draw. After a 20-year repayment starts, the amortizing payment rises
        to about 358.22. Principal then declines each month until payoff.
      </p>

      <h2
        id="payment-shock"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Payment Shock
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Payment shock is the jump from interest-only amounts to principal-and-
        interest installments. Plan cash flow for the repayment stage before the
        draw period ends, especially if rates may also rise.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        HELOC Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This model assumes no additional draws, no extra principal payments during
        the draw period, monthly calculation frequency, nominal APR divided by
        twelve, a simplified rate-adjustment schedule, and annual fees charged on
        anniversary months. It does not implement daily accrual, lender-specific
        index/margin contracts, or every fee waiver. Real statements and payment
        obligations can differ. Educational estimates only — not financial, tax,
        or legal advice.
      </p>

      <h2
        id="heloc-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...HELOC_FAQS]} />
      </div>
    </article>
  );
}
