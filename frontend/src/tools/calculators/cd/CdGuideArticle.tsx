import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CD_FAQS } from './content';

export function CdGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-cd" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is a CD?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        A certificate of deposit (CD) is a timed deposit that pays interest for a fixed term. This
        calculator estimates the ending balance and interest earned with periodic compounding.
      </p>

      <h2 id="cd-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Final Balance = P × (1 + r / n)^(n × t)</p>
        <p className="mt-2">Interest Earned = Final Balance − Initial Deposit</p>
        <p className="mt-2">t = Years + Months / 12</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial deposit = PKR 100,000</p>
        <p>Interest rate = 5% yearly</p>
        <p>Term = 2 years</p>
        <p>Compounding = Yearly (n = 1)</p>
        <p className="mt-2">Final balance = 100,000 × (1.05)^2 = PKR 110,250</p>
        <p>Interest earned = 110,250 − 100,000 = PKR 10,250</p>
      </div>

      <h2 id="cd-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...CD_FAQS]} />
      </div>
    </article>
  );
}
