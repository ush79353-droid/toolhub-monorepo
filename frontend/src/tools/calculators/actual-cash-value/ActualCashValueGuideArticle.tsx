import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ACV_FAQS } from './content';

export function ActualCashValueGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-acv"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Actual Cash Value?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Actual cash value (ACV) is a valuation concept often used in insurance to
        estimate property value after depreciation. It differs from original
        purchase price and may also differ from open-market resale value. This
        calculator provides a simplified mathematical estimate, not a claim
        settlement.
      </p>

      <h2
        id="acv-definition"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Actual Cash Value Definition
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Insurers may consider replacement cost, age, condition, depreciation
        method, and policy language when determining ACV. There is no single
        formula every insurer must use. This tool’s default basis is original
        purchase price with straight-line zero-salvage depreciation.
      </p>

      <h2
        id="how-to-calculate"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Calculate Actual Cash Value
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter original purchase price.</li>
        <li>Enter expected useful life (years or months).</li>
        <li>Enter current age in matching or convertible units.</li>
        <li>Normalize durations internally.</li>
        <li>Apply the remaining-life fraction and floor at zero.</li>
      </ol>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        ACV = Purchase Price × max(0, 1 − Current Age / Expected Life)
      </div>

      <h2
        id="worked-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Actual Cash Value Calculation Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Purchase price $25,000 · expected life 10 years · current age 3 years →
        ACV = 25,000 × 7/10 = <strong>$17,500</strong>. Accumulated depreciation
        is $7,500 (30%), with 70% remaining value and 7 years of remaining
        modeled life.
      </p>

      <h2
        id="why-important"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why Is Actual Cash Value Important?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        People use ACV ideas for loss estimates, personal-property planning, and
        rough depreciation checks. Actual claim outcomes still depend on the
        policy and the insurer’s valuation process.
      </p>

      <h2
        id="acv-vs-replacement"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Actual Cash Value vs. Replacement Cost
      </h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong>ACV</strong>: valuation that accounts for depreciation or
          other applicable factors.
        </li>
        <li>
 <strong>Replacement cost</strong>: amount to replace with comparable
          property under applicable policy terms.
        </li>
      </ul>

      <h2
        id="depreciation-effect"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How Does Depreciation Affect ACV?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Straight-line depreciation spreads purchase price evenly over expected
        life. Age increases accumulated depreciation and reduces remaining
        value until the model reaches zero.
      </p>

      <h2
        id="useful-life"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is the Expected Useful Life of an Item?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Useful life depends on item type, quality, maintenance, usage,
        conditions, manufacturer expectations, and valuation assumptions. Do not
        treat one life expectancy as universal.
      </p>

      <h2
        id="common-assets"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ACV of Cars, Electronics, and Personal Property
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market depreciation is often nonlinear. Straight-line ACV can diverge
        from resale prices for cars, phones, appliances, and other personal
        property.
      </p>

      <h2
        id="acv-vs-market"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Actual Cash Value vs. Market Value
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Market value reflects what buyers will pay. Depreciation-based ACV from
        purchase price may be higher or lower than that market price.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations of the ACV Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This tool does not automatically include current replacement cost,
        physical condition, maintenance history, supply and demand, market
        depreciation curves, salvage value, deductibles, exclusions, local law,
        or insurer-specific practices. Results are educational estimates only.
      </p>

      <div id="acv-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ACV_FAQS]} />
        </div>
      </div>
    </article>
  );
}
