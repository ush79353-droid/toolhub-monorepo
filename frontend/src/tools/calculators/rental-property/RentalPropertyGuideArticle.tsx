import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RENTAL_PROPERTY_FAQS } from './content';

export function RentalPropertyGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="investment-overview"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Investment in a Property – Rental Property Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A rental property investment combines acquisition financing, ongoing
        rental income, operating costs, and an eventual exit. Investors estimate
        cash flow to see whether rent covers expenses and debt service, then
        look at leveraged yield (cash-on-cash), unlevered yield (cap rate), and
        longer-horizon ROI that includes appreciation and sale proceeds.
      </p>

      <h2
        id="upkeep-expenses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Upkeep and Monthly Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Recurring costs usually include property tax, insurance, maintenance and
        repairs, HOA fees, management fees, and other operating charges such as
        owner-paid utilities. Annualize every item consistently before summing.
        Mortgage principal and interest are debt service, not operating
        expenses, and should stay outside NOI.
      </p>

      <h2
        id="rental-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Your Rental Property Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Start with gross potential rent, subtract vacancy loss for effective
        rental income, then subtract operating expenses (including a management
        fee based on effective rent in this simplified model) to reach NOI:
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Effective Rent = Gross Rent − Vacancy Loss
        <br />
        NOI = Effective Rent − Operating Expenses
        <br />
        Annual Cash Flow = NOI − Annual Debt Service
      </div>

      <h2
        id="selling-property"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Selling the Property
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A constant annual appreciation assumption projects selling price as
        Purchase Price × (1 + appreciation rate)^years held. Subtract selling
        costs and the outstanding mortgage balance to estimate net sale
        proceeds. Do not treat the full original loan as still owed after years
        of amortization.
      </p>

      <h2
        id="how-to-calculate-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Real Estate Investment Evaluation – How to Calculate ROI on Rental
        Property
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Compute initial cash invested (down payment + closing + renovations +
          other cash costs).
        </li>
        <li>
          Project operating cash flows over the holding period (rent after
          vacancy, expenses, and mortgage payments only while the loan is
          active).
        </li>
        <li>
          Estimate net sale proceeds after selling costs and loan payoff.
        </li>
        <li>
          Total profit = cumulative cash flow + net sale proceeds − initial cash
          invested; ROI = profit ÷ initial cash × 100.
        </li>
      </ol>

      <h2
        id="good-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Considered a Good ROI for Rental Properties?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Expectations vary with local rental demand, property type, financing
        costs, vacancy, maintenance intensity, risk tolerance, appreciation
        assumptions, and holding period. A return that looks strong on paper can
        still be a poor fit if leverage or liquidity risk exceeds your comfort.
      </p>

      <h2
        id="financing-factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Financing and Market Factors That Impact ROI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mortgage interest rates and loan term</li>
        <li>Down payment size and cash reserves</li>
        <li>Property taxes, insurance, and HOA costs</li>
        <li>Vacancy and management fees</li>
        <li>Local appreciation and rent growth (not automatic here)</li>
      </ul>

      <h2
        id="what-is-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Return on Investment (ROI) in Rental Properties?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total investment ROI measures overall profit relative to cash invested
        across a defined period. It is broader than a single year of cash flow
        and should not be confused with cash-on-cash return.
      </p>

      <h2
        id="cash-on-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Do I Calculate Cash-on-Cash Return for a Rental Property?
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cash-on-Cash Return = Annual Cash Flow / Initial Cash Invested × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $8,000 annual cash flow on $80,000 cash invested → 10%
        cash-on-cash return for that year.
      </p>

      <h2
        id="example-150k"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the ROI on a $150,000 Property?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purchase price alone does not determine ROI. You still need financing
        terms, rent, vacancy, expenses, holding period, appreciation, and selling
        costs. Two $150,000 properties can produce very different returns under
        different assumptions.
      </p>

      <h2
        id="metrics-compared"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cap Rate vs. Cash-on-Cash Return vs. ROI
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Cap rate</strong>: NOI relative to property value (unlevered).
        </li>
        <li>
 <strong>Cash-on-cash</strong>: annual cash flow after debt relative to
          cash invested (levered annual yield).
        </li>
        <li>
 <strong>Total ROI</strong>: overall profit versus investment over a
          stated holding period, often including sale proceeds.
        </li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Rental Property Calculator Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator uses simplified constant assumptions. It does not
        automatically model income taxes, depreciation, refinancing, variable
        rates, unexpected capital expenses, or market volatility. Results are
        educational estimates, not advice. Verify local rules, lender terms, and
        professional guidance before investing.
      </p>

      <div id="rental-property-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...RENTAL_PROPERTY_FAQS]} />
        </div>
      </div>
    </article>
  );
}
