import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CAP_RATE_FAQS } from './content';

export function CapRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-cap-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Capitalization Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The capitalization rate, or cap rate, measures how much annual net
        operating income (NOI) a property produces relative to its market value
        or purchase price. Investors use it to screen income-producing assets
        and compare yields without embedding a specific loan structure. Cap rate
        is useful for comparison, but it is not a complete investment-return
        model — it does not by itself capture financing, appreciation, capital
        expenditures, or exit timing.
      </p>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cap Rate = (NOI / Property Value) × 100
      </div>

      <h2
        id="what-is-noi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is Net Operating Income?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Net operating income starts with potential gross income (rent plus other
        recurring property income), subtracts vacancy and collection loss to
        reach effective gross income, then subtracts operating expenses such as
        management, repairs, insurance, property taxes, and owner-paid utilities.
        In the standard real estate definition used for cap rate, debt service
        (mortgage payments and interest) and depreciation are excluded from NOI.
      </p>

      <h2
        id="how-to-calculate-cap-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Cap Rate
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Determine annual gross rental income.</li>
        <li>Add other recurring property income.</li>
        <li>Estimate vacancy and collection losses.</li>
        <li>Calculate effective gross income.</li>
        <li>Subtract annual operating expenses to get NOI.</li>
        <li>Determine property value.</li>
        <li>Divide NOI by property value.</li>
        <li>Multiply by 100 to express the result as a percentage.</li>
      </ol>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual rental income = $72,000</p>
        <p>Other income = $3,000 → Potential gross = $75,000</p>
        <p>Vacancy 5% → Loss $3,750 → Effective gross = $71,250</p>
        <p>Operating expenses = $25,000 → NOI = $46,250</p>
        <p>Property value = $600,000 → Cap rate ≈ 7.71%</p>
      </div>

      <h2
        id="cap-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cap Rate Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cap Rate (%) = (NOI / Property Value) × 100</p>
        <p>Property Value = NOI / (Cap Rate / 100)</p>
        <p>Required NOI = Property Value × (Cap Rate / 100)</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use the first form when you know income and value. Use the second when
        you have NOI and a target market yield. Use the third when you need the
        income required to support a price at a chosen rate.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Cap Rate Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the property&apos;s value.</li>
        <li>Enter gross rental income.</li>
        <li>Select the rental income period (monthly or annually).</li>
        <li>Add any other recurring income.</li>
        <li>Enter the vacancy percentage.</li>
        <li>Enter annual operating expenses.</li>
        <li>Review NOI.</li>
        <li>Review the calculated cap rate.</li>
        <li>
          Expand Property value from cap rate to estimate value from a target
          yield (independent inputs).
        </li>
        <li>
          Use Required net operating income to calculate income targets for a
          price and target rate.
        </li>
      </ol>

      <h2
        id="what-is-a-good-cap-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is a Good Cap Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Interpretation depends on property location and type, local market
        conditions, tenant and lease risk, property age and condition, investment
        strategy, interest rates, and comparable transactions. Illustrative
        percentages in examples demonstrate math only — they are not universal
        buy/sell rules.
      </p>

      <h2
        id="high-vs-low-cap-rate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        High Cap Rate vs. Low Cap Rate
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <strong>Higher cap rates</strong> mean more current NOI relative to
        price. They may accompany higher perceived risk, thinner growth
        expectations, or pricing differences. <strong>Lower cap rates</strong>{' '}
        mean less current income relative to price and may reflect stronger
        demand, perceived stability, or growth expectations. Neither outcome
        automatically determines investment quality.
      </p>

      <h2
        id="cap-rate-and-value"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Cap Rate Affect Property Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        When NOI is held constant, estimated value moves inversely with the
        capitalization rate used in the valuation.
      </p>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual NOI = $50,000</p>
        <p>At 5% → Value = $1,000,000</p>
        <p>At 8% → Value = $625,000</p>
        <p>At 10% → Value = $500,000</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The same income stream can support very different prices under different
        market yield assumptions.
      </p>

      <h2
        id="cap-rate-vs-roi"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cap Rate vs. Return on Investment
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cap rate is based on NOI and property value. ROI typically relates profit
        or cash return to capital invested and may include financing, holding
        period, and sale outcomes. Gross rental yield often uses rent before
        vacancy and operating costs. Each metric answers a different question.
      </p>

      <h2
        id="cap-rate-vs-cash-on-cash"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Cap Rate vs. Cash-on-Cash Return
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        Cash-on-Cash Return = (Annual Pre-Tax Cash Flow / Cash Invested) × 100
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cash-on-cash return measures annual pre-tax cash flow against cash
        actually invested. Loan payments can change cash-on-cash return even when
        the property&apos;s unlevered cap rate is unchanged.
      </p>

      <h2
        id="advantages"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Advantages of Using Cap Rate
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Simple income-based comparison across properties</li>
        <li>Quick screening of potential acquisitions</li>
        <li>Income relative to price without assuming a loan</li>
        <li>Useful starting input for deeper underwriting</li>
      </ul>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of Cap Rate
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Excludes financing effects</li>
        <li>Does not directly model future appreciation</li>
        <li>May omit large capital expenditures</li>
        <li>Depends on reliable NOI estimates</li>
        <li>Can be distorted by unusual income or expenses</li>
        <li>Does not fully capture tenant or property risk</li>
        <li>Does not replace detailed investment underwriting</li>
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator is for educational planning. It is not appraisal advice,
        tax advice, or a recommendation to buy or sell any property.
      </p>

      <h2
        id="cap-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CAP_RATE_FAQS]} />
      </div>
    </article>
  );
}
