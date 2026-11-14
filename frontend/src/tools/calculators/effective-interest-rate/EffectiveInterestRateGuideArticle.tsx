import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EFFECTIVE_INTEREST_RATE_FAQS } from './content';

export function EffectiveInterestRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-eir" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is Effective Interest Rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The effective interest rate (EIR) is the true annual return after accounting for compounding
        within the year. It is higher than the nominal annual rate whenever interest compounds more
        than once per year.
      </p>

      <h2 id="eir-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Periodic Rate (%) = Annual Interest Rate (%) / n</p>
        <p className="mt-2">EIR (%) = [(1 + Annual Interest Rate / (100 × n))^n − 1] × 100</p>
        <p className="mt-2">n = compounds per year</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual interest rate = 12%</p>
        <p>Compounding frequency = Monthly (n = 12)</p>
        <p className="mt-2">Periodic rate = 12 / 12 = 1%</p>
        <p>EIR = [(1 + 0.12 / 12)^12 − 1] × 100 ≈ 12.6825%</p>
      </div>

      <h2 id="eir-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EFFECTIVE_INTEREST_RATE_FAQS]} />
      </div>
    </article>
  );
}
