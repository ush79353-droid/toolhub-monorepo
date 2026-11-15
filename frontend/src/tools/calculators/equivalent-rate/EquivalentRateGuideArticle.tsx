import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EQUIVALENT_RATE_FAQS } from './content';

export function EquivalentRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-equivalent-rate"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What Is an Equivalent Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        An equivalent interest rate is the nominal annual rate at a new compounding frequency
        that produces the same effective annual return (AER) as the original quoted rate.
      </p>

      <h2
        id="equivalent-rate-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Equivalent Rate Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>AER = (1 + r/m)^m − 1</p>
        <p className="mt-2">Equivalent Rate = n × [(1 + AER)^(1/n) − 1]</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Nominal rate = 12% compounded 12 times per year</p>
        <p>New frequency = 4 per year</p>
        <p>AER ≈ 12.6825%</p>
        <p>Equivalent rate ≈ 12.1204%</p>
      </div>

      <h2
        id="equivalent-rate-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EQUIVALENT_RATE_FAQS]} />
      </div>
    </article>
  );
}
