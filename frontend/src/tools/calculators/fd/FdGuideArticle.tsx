import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FD_FAQS } from './content';

export function FdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-fd" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is a Fixed Deposit?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A fixed deposit locks principal for a set term at a stated interest rate. Cumulative deposits
        compound interest into the balance; simple deposits pay interest out periodically.
      </p>

      <h2 id="fd-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Cumulative: Maturity = P × (1 + r / n)^(n × t)</p>
        <p className="mt-2">Simple: Total Interest = P × r × t</p>
        <p className="mt-2">Simple payout per period = P × r / n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Principal = PKR 100,000</p>
        <p>Interest rate = 8%</p>
        <p>Term = 2 years</p>
        <p>Type = Cumulative, Monthly (n = 12)</p>
        <p className="mt-2">
          Maturity ≈ 100,000 × (1 + 0.08/12)^(24) ≈ PKR 117,288.79
        </p>
      </div>

      <h2 id="fd-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...FD_FAQS]} />
      </div>
    </article>
  );
}
