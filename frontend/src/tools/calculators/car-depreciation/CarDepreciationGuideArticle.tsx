import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  CAR_DEPRECIATION_ANNUAL_RATE,
  CAR_DEPRECIATION_FAQS,
} from './content';

const ratePercent = CAR_DEPRECIATION_ANNUAL_RATE * 100;

export function CarDepreciationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-car-depreciation"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Car Depreciation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Car depreciation is the decline in a vehicle’s estimated value over time.
        Actual resale prices depend on age, mileage, condition, brand demand, and
        local market conditions. This calculator uses a simple, disclosed declining-balance
 model so you can explore how value changes with age; not a guaranteed market
        forecast or appraisal.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use This Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Enter the initial car value and choose its currency.</li>
        <li>Enter the car’s current age in years (zero or greater).</li>
        <li>
          Read Reduced car value (estimate after that age). Change its currency to
          re-express the same amount.
        </li>
        <li>
          Expand Car value after… for 1-minute and 1–5 year projections from the
          current estimate. Each result has its own currency selector.
        </li>
      </ol>

      <h2
        id="car-depreciation-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Depreciation Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Value after t years = Initial × (1 − r)^t &nbsp;(r = {ratePercent}% /
          year, illustrative)
        </p>
        <p>Reduced car value = Initial × (1 − r)^age</p>
        <p>Value after Δt from now = Reduced × (1 − r)^Δt</p>
        <p>1 minute as years = 1 / (365.25 × 24 × 60)</p>
        <p>Total depreciation to date = Initial − Reduced</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Values are floored at zero so results never go negative. Calculations keep
        full precision and round only for display. Age and the rate are never
        currency-converted.
      </p>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Initial 1,000,000 · age 2 years · r = 15%. Reduced = 1,000,000 × 0.85² =
        722,500. One year later from now = 722,500 × 0.85 = 614,125. Five years
        from now = 722,500 × 0.85⁵ ≈ 320,161.72.
      </p>

      <h2
        id="car-depreciation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion faqs={[...CAR_DEPRECIATION_FAQS]} />
      </div>
    </article>
  );
}
