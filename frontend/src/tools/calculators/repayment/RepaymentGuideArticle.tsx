import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { REPAYMENT_FAQS } from './content';

export function RepaymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="intro"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Introduction
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Repayment Calculator estimates either the periodic installment
        needed to clear a loan within a chosen term, or how long a fixed
        installment takes to repay the balance. It suits personal loans,
        mortgages, auto loans, student loans, and other amortizing installment
        products with a constant rate assumption.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Loan Repayment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Repayment means returning borrowed principal plus interest over time.
        Each installment typically covers accrued interest first, then reduces
        principal. The outstanding balance falls until the final adjusted
        payment clears what remains.
      </p>

      <h2
        id="fixed-term"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Loan Term
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Shorter terms raise the installment and usually cut total interest.
        Longer terms lower the installment but often increase lifetime interest.
        Example: $10,000 at 10% for five years with monthly payments is about
        $212.47 per month and roughly $2,748 in interest.
      </p>

      <h2
        id="fixed-installment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed Installments
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When you set what you can afford each period, the calculator solves for
        the number of payments, total interest, and a possibly smaller final
        installment so the balance reaches zero.
      </p>

      <h2
        id="loan-types"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common Loan Types
      </h2>
      <h3 className="mt-4 text-base font-semibold text-accent">Mortgages</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed-rate mortgages commonly use amortizing principal-and-interest
        schedules. Taxes and insurance are separate from this repayment model.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Auto loans</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Auto loans usually amortize over a fixed term with regular installments.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Student loans</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Standard amortizing plans fit this model; income-driven or specialty
        plans may follow different rules.
      </p>
      <h3 className="mt-4 text-base font-semibold text-accent">Credit cards</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Revolving credit and minimum payments often do not match a fixed-rate
        installment schedule. Prefer tools built for revolving balances when
        that is your product.
      </p>

      <h2
        id="repay-faster"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Repay Loans Faster
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Extra principal payments when allowed.</li>
        <li>More frequent payments (e.g., biweekly) when crediting helps.</li>
        <li>Refinancing when rate/fees improve the overall cost.</li>
        <li>Prioritize high-interest balances.</li>
        <li>Avoid new debt that crowds the repayment budget.</li>
      </ul>

      <h2
        id="how-payment"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Is a Loan Payment Calculated?
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>i = (1 + j/m)^(m/p) − 1</p>
        <p>A = P · i / (1 − (1+i)^−n)</p>
        <p>If i = 0: A = P / n</p>
      </div>

      <h2
        id="compounding"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Interest Compounding Affect Repayment?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Nominal annual rates and compounding frequency define the growth of
        unpaid balances. Payment frequency may differ; this tool converts both
        into an effective rate per payment period.
      </p>

      <h2
        id="frequency"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Payment Frequency Affect Total Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Monthly (12), semimonthly (24), biweekly (26), and weekly (52) schedules
        change period counts and effective rates. Biweekly is not the same as
        semimonthly.
      </p>

      <h2
        id="amortization"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is an Amortization Schedule?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Early payments are interest-heavy; later payments are principal-heavy
        on a standard amortizing loan. The table shows each split and the
        remaining balance.
      </p>

      <h2
        id="too-small"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Happens If the Payment Is Too Small?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        If the installment does not exceed periodic interest, principal does not
        fall and there is no finite payoff under this model.
      </p>

      <h2
        id="compare-modes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Fixed-Term vs Fixed-Installment Repayment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fixed-term solves for payment given time. Fixed-installment solves for
        time given payment. Use whichever matches the decision you control.
      </p>

      <h2
        id="reduce-interest"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Can I Reduce My Total Loan Interest?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Borrow less, secure a lower rate, shorten the term, or raise
 installments so principal declines faster, subject to your contract and
        cash-flow constraints.
      </p>

      <h2
        id="rep-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...REPAYMENT_FAQS]} />
      </div>
    </article>
  );
}
