import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IRR_FAQS } from './content';

export function IrrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-irr" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is IRR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Internal rate of return is the annualized rate that sets the present value of an
        investment&apos;s cash flows equal to its upfront cost. Compare it with a required return
        to judge whether a project adds value.
      </p>

      <h2 id="irr-formula" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        IRR Formula
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>0 = −Initial Investment + Σ [Cash Flow(t) ÷ (1 + r)^t]</p>
        <p>Solve for r (annual IRR) with numerical root-finding</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 space-y-1 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial investment = 1,000; Year 1 = 600; Year 2 = 600</p>
        <p>IRR ≈ 13.07%</p>
      </div>

      <h2 id="irr-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...IRR_FAQS]} />
      </div>
    </article>
  );
}
