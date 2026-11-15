import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PVIFA_FAQS } from './content';

export function PvifaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-pvifa" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is PVIFA?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The Present Value Interest Factor of Annuity (PVIFA) is the present-value multiple for one
        unit of an ordinary annuity payment. It represents the present value factor for a series of
        equal end-of-period payments.
      </p>

      <h2
        id="pvifa-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PVIFA Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>r = Interest Rate (%) ÷ 100</p>
        <p>PVIFA = [1 − (1 + r)^(−n)] ÷ r</p>
        <p>When r = 0: PVIFA = n</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Interest rate per period = 5% → r = 0.05</p>
        <p>Number of periods = 10</p>
        <p>PVIFA = [1 − (1.05)^(−10)] ÷ 0.05 ≈ 7.7217</p>
      </div>

      <h2 id="pvifa-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...PVIFA_FAQS]} />
      </div>
    </article>
  );
}
