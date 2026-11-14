import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { EAR_FAQS } from './content';

export function EarGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-ear" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is EAR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Effective Annual Rate (EAR) shows what a nominal annual interest rate becomes after
        compounding. Comparing products with different compounding frequencies is clearer with EAR
        than with the stated annual rate alone.
      </p>

      <h2 id="ear-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        EAR Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Periodic Rate (%) = Annual Interest Rate (%) ÷ n</p>
        <p>EAR (%) = [(1 + Annual Interest Rate ÷ (100 × n))^n − 1] × 100</p>
        <p>n = 1 (Annual), 2 (Semiannual), 4 (Quarterly), 12 (Monthly), 365 (Daily)</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Annual interest rate = 12%; compounding = Monthly (n = 12)</p>
        <p>Periodic rate = 12 ÷ 12 = 1%</p>
        <p>EAR = [(1 + 12 ÷ (100 × 12))^12 − 1] × 100 ≈ 12.6825%</p>
      </div>

      <h2 id="ear-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...EAR_FAQS]} />
      </div>
    </article>
  );
}
