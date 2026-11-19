import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NATURAL_UNEMPLOYMENT_FAQS } from './content';

export function NaturalUnemploymentGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-natural-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is the Natural Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The natural rate of unemployment is often described as the unemployment rate that remains
        when the economy is at full employment — typically the sum of frictional and structural
        unemployment, not cyclical joblessness from recessions. This calculator uses that simplified
        textbook model only. For the overall unemployment rate from employed and unemployed counts,
        use the{' '}
        <a
          href="/tools/unemployment-calculator-unemployment-rate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Unemployment Calculator (Unemployment Rate)
        </a>
        .
      </p>

      <h2
        id="natural-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>
          Natural rate (%) = (Frictionally unemployed + Structurally unemployed) ÷ Total labor
          force × 100
        </p>
      </div>

      <h2
        id="population-units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Population Units
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter counts in people, thousands of people, or millions of people. Each field has an
        independent unit selector. Values are normalized to people before dividing. The resulting
        percentage is never scaled by population units.
      </p>

      <h2
        id="natural-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...NATURAL_UNEMPLOYMENT_FAQS]} />
      </div>
    </article>
  );
}
