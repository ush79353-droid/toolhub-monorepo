import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { APPRECIATION_FAQS } from './content';

export function AppreciationGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-appreciation"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is Appreciation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Appreciation is the increase in an asset’s value over time. This calculator compounds a
        starting amount by a chosen daily, monthly, or yearly rate across a duration measured in
        years and months.
      </p>

      <h2
        id="appreciation-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Appreciation Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Final Value = Starting Value × (1 + Appreciation Rate / 100)^N</p>
        <p className="mt-2">Daily N = (Years + Months / 12) × 365</p>
        <p>Monthly N = Years × 12 + Months</p>
        <p>Yearly N = Years + Months / 12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Starting value = PKR 10,000</p>
        <p>Appreciation rate = 1% monthly</p>
        <p>Period = 0 years, 12 months → N = 12</p>
        <p>Final value = 10,000 × (1.01)^12 ≈ PKR 11,268.25</p>
      </div>

      <h2
        id="appreciation-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...APPRECIATION_FAQS]} />
      </div>
    </article>
  );
}
