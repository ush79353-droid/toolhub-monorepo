import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DEPRECIATION_FAQS } from './content';

export function DepreciationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-depreciation"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Depreciation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Depreciation allocates an asset&apos;s depreciable cost (original cost minus salvage) over
        its useful life. This calculator estimates the depreciation expense for a selected year and
        the book value after that many years under straight-line, declining-balance, or
 sum-of-years&apos; digits methods. It is an accounting estimate; not a tax schedule.
      </p>

      <h2 id="how-to-use" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select a depreciation method (straight line is the default).</li>
        <li>Enter original cost and salvage value (independent currencies supported).</li>
        <li>Set useful life and the year for end book value (whole years only).</li>
        <li>
          For declining balance, confirm or edit the annual rate percent (default = 200% ÷ life).
        </li>
        <li>Read selected-year depreciation expense and end book value.</li>
      </ol>

      <h2
        id="depreciation-methods"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Depreciation Methods
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
 <strong className="font-semibold text-accent">Straight line</strong>: equal annual
          expense over useful life.
        </li>
        <li>
 <strong className="font-semibold text-accent">Declining balance</strong>: expense =
          beginning book × rate, capped so book never falls below salvage.
        </li>
        <li>
 <strong className="font-semibold text-accent">Sum-of-years&apos; digits</strong>: front-
          loaded fractions of depreciable cost using SYD = n(n+1)/2.
        </li>
      </ul>

      <h2
        id="depreciation-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Straight line annual = (Cost − Salvage) / Life</p>
        <p>Book after t = Cost − Annual × t</p>
        <p>Declining balance year dep = min(Begin × Rate, Begin − Salvage)</p>
        <p>SYD = Life × (Life + 1) / 2</p>
        <p>SYD year k = (Cost − Salvage) × (Life − k + 1) / SYD</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Straight line · Cost 10,000 · Salvage 0 · Life 5 · After year 2</p>
        <p>Annual = 10,000 / 5 = 2,000</p>
        <p>Year-2 expense = 2,000 · End book = 10,000 − 4,000 = 6,000</p>
      </div>

      <h2
        id="depreciation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...DEPRECIATION_FAQS]} />
      </div>
    </article>
  );
}
