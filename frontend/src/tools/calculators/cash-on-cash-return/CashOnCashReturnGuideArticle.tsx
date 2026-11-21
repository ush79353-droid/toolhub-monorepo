import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CASH_ON_CASH_FAQS } from './content';

export function CashOnCashReturnGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cash-on-cash"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Cash-on-Cash Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash-on-cash return measures annual pre-tax cash flow from a property
        relative to the cash you actually invested. Unlike net operating income
        (NOI), cash flow subtracts debt service, so financing affects the result.
        Investors use it to compare leveraged deals on an out-of-pocket cash
        basis.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cash-on-Cash Return
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Calculate NOI from effective rent (after vacancy) minus operating
          expenses.
        </li>
        <li>Subtract annual debt service to get annual cash flow.</li>
        <li>
          Divide annual cash flow by total cash invested and multiply by 100.
        </li>
      </ol>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cash-on-Cash Return (%) = (Annual Cash Flow / Total Cash Invested) × 100
      </div>

      <h2
        id="basic-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Basic Cash-on-Cash Return Formula
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>Annual cash flow</strong>: NOI minus annual debt service
        </li>
        <li>
 <strong>Total cash investment</strong>: out-of-pocket cash, not
          necessarily purchase price
        </li>
        <li>
 <strong>Return %</strong>: cash flow as a percent of that cash
        </li>
      </ul>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash-on-Cash Return Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Total cash invested = $100,000</p>
        <p>Gross annual rent = $72,000 · Vacancy = 5%</p>
        <p>Annual expenses = $20,000 · Monthly loan = $2,000</p>
        <p>Vacancy loss = 3,600 → Effective rent = 68,400</p>
        <p>NOI = 48,400 · Debt service = 24,000 · Cash flow = 24,400</p>
        <p>Cash-on-cash return = 24.4%</p>
      </div>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter total out-of-pocket cash investment.</li>
        <li>Enter gross annual rental income at full occupancy.</li>
        <li>Set the expected vacancy rate.</li>
        <li>Enter annual operating expenses (exclude mortgage P&amp;I).</li>
        <li>Enter the monthly loan payment.</li>
        <li>Review cash-on-cash return.</li>
        <li>Review net operating income.</li>
        <li>Review annual debt service.</li>
        <li>Review annual cash flow.</li>
        <li>Adjust inputs to compare scenarios.</li>
      </ol>

      <h2
        id="what-is-a-good-return"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Cash-on-Cash Return?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Suitability depends on market, property type, financing, risk, expected
        appreciation, expenses, vacancy, maintenance, and your time horizon.
 Illustrative percentages in examples are for math only; not universal
        targets.
      </p>

      <h2
        id="coc-vs-cap-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash-on-Cash Return vs. Cap Rate
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cap Rate = (NOI / Property Value) × 100</p>
        <p>Cash-on-Cash = (Annual Cash Flow / Cash Invested) × 100</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cap rate is unlevered and uses property value. Cash-on-cash uses cash
        flow after debt service and cash invested, so mortgage structure matters.
      </p>

      <h2
        id="coc-vs-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cash-on-Cash Return vs. ROI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash-on-cash emphasizes annual cash yield. ROI definitions often fold in
        sale proceeds, appreciation, or multi-year totals. They answer different
        questions and should not be treated as interchangeable labels.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Factors Affecting Cash-on-Cash Return
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Rental income and occupancy / vacancy</li>
        <li>Operating expenses and management costs</li>
        <li>Loan payment size and interest rates</li>
        <li>Down payment, closing costs, and renovations</li>
        <li>Unexpected repairs and maintenance</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Cash-on-Cash Return
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This simplified calculator does not model appreciation, capital gains,
        depreciation tax effects, income taxes, rent growth, inflation, major
        capital replacements, principal paydown as equity, sale expenses, or exit
 proceeds. Results are educational pre-tax annual cash-flow estimates; 
        not guaranteed returns or investment advice.
      </p>

      <h2
        id="cash-on-cash-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CASH_ON_CASH_FAQS]} />
      </div>
    </article>
  );
}
