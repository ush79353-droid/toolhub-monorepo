import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NOI_FAQS } from './content';

export function NoiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-noi"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Net Operating Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net operating income (NOI) measures how much annual income an
        income-producing property generates from operations after vacancy losses
        and operating expenses. Investors use NOI to compare properties, underwrite
        acquisitions, and feed valuation tools such as capitalization rate
 analysis. NOI focuses on property operations; not loan structure, income
        taxes, or depreciation.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        NOI = Effective Gross Income − Operating Expenses
      </div>

      <h2
        id="how-to-calculate-noi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Net Operating Income
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Estimate annual rental income (area × annual rent per unit area).</li>
        <li>Add other recurring property income.</li>
        <li>Calculate potential gross income (PGI).</li>
        <li>Apply occupancy to estimate vacancy loss on rental income.</li>
        <li>Calculate effective gross income (EGI = PGI − vacancy loss).</li>
        <li>Sum annual operating expenses (manual total or itemized breakdown).</li>
        <li>Subtract operating expenses from EGI to get NOI.</li>
      </ol>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: 2,000 ft² at $25/ft²/year → $50,000 rent; $5,000 other income →
        PGI $55,000. At 92% occupancy, vacancy loss on rent is $4,000 → EGI
        $51,000. Operating expenses of $22,000 → NOI <strong>$29,000</strong>.
      </p>

      <h2
        id="potential-gross-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Potential Gross Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Potential gross income is the income the property could produce before
        vacancy adjustments: full-period rental income based on floor area and
        rent per area, plus other recurring income such as parking or laundry.
        PGI is a starting point, not the same as collected cash.
      </p>

      <h2
        id="effective-gross-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Effective Gross Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Occupancy rate measures the share of potential rental income expected
        under normal occupied conditions. Vacancy rate is 100% minus occupancy.
        This calculator applies vacancy loss to annual rental income only; other
        income is left unchanged unless you adjust it. EGI equals PGI minus that
        vacancy loss. Fuller underwriting models may also deduct collection losses.
      </p>

      <h2
        id="operating-expenses"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Operating Expenses
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Operating expenses are recurring costs of running the property: taxes,
        insurance, management, maintenance, owner-paid utilities, cleaning and
        landscaping, and administration. Enter a single annual total or use the
        itemized breakdown. Do not mix monthly and annual figures without
        converting first. Mortgage payments, depreciation, income taxes, and
        one-time capital projects do not belong in standard NOI.
      </p>

      <h2
        id="interpret-noi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Interpret Net Operating Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Positive NOI means operations cover operating costs before debt. Negative
        NOI means expenses exceed EGI. Context matters: market rents, expense
        intensity, property type, and local taxes all affect what a “good” NOI
        looks like. NOI alone does not decide whether an investment is attractive.
      </p>

      <h2
        id="noi-vs-net-income"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOI vs. Net Income
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOI is an operating real-estate measure. Accounting net income typically
        includes interest, depreciation, amortization, and taxes. A property can
        show solid NOI while reporting lower (or negative) net income after those
        items.
      </p>

      <h2
        id="noi-vs-cash-flow"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOI vs. Cash Flow
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOI stops before debt service. Cash flow usually continues by subtracting
        mortgage payments and other cash obligations. Example: NOI of $60,000 with
        $70,000 annual debt service can leave negative levered cash flow even
        though operations look healthy on an unlevered basis.
      </p>

      <h2
        id="noi-and-cap-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NOI and Capitalization Rate
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cap Rate = (NOI / Property Value) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Example: $45,000 NOI on a $600,000 property → 7.5% cap rate. Cap rate
        inherits every assumption baked into NOI and value.
      </p>

      <h2
        id="improve-noi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Improve NOI
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Raise sustainable rents where the market supports them.</li>
        <li>Reduce vacancy through leasing, retention, and marketing.</li>
        <li>Add durable ancillary income (parking, storage, services).</li>
        <li>Control operating expenses without starving necessary maintenance.</li>
        <li>Improve operations and property condition to support occupancy.</li>
      </ul>

      <h2
        id="common-mistakes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Common NOI Calculation Mistakes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Mixing monthly and annual amounts.</li>
        <li>Ignoring vacancy or assuming 100% collection forever.</li>
        <li>Omitting recurring operating costs.</li>
        <li>Including mortgage principal or interest in NOI.</li>
        <li>Double-counting manual totals and breakdown lines.</li>
        <li>Treating capital expenditures as ordinary operating expenses.</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of NOI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NOI does not directly include debt service, income taxes, depreciation,
        capital expenditures, purchase price, financing structure, or appreciation.
 Results are estimates based on your inputs; not an appraisal, tax advice,
        or investment recommendation.
      </p>

      <h2
        id="noi-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...NOI_FAQS]} />
      </div>
    </article>
  );
}
