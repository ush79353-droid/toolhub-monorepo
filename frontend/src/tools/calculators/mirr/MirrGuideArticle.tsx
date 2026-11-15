import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MIRR_FAQS } from './content';

export function MirrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="what-is-mirr" className="text-xl font-bold tracking-tight text-accent sm:text-2xl">
        What Is MIRR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The modified internal rate of return (MIRR) measures an investment&apos;s annualized
        return after financing outflows at one rate and reinvesting inflows at another. The
        initial investment is treated as a year-0 outflow.
      </p>

      <h2
        id="mirr-formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        MIRR Formula
      </h2>
      <div className="my-4 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>MIRR = (FV of positive cash flows / |PV of negative cash flows|)^(1/n) − 1</p>
        <p className="mt-2">
          FV uses the reinvestment rate; PV uses the financing rate; n is the number of years.
        </p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Initial investment = PKR 1,000</p>
        <p>Financing rate = 10%, reinvestment rate = 8%</p>
        <p>Year 1–3 cash flows = PKR 500 each</p>
        <p>FV of positives ≈ 1,623.20; |PV of negatives| = 1,000; n = 3</p>
        <p>MIRR ≈ 17.5%</p>
      </div>

      <h2 id="mirr-faq" className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl">
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...MIRR_FAQS]} />
      </div>
    </article>
  );
}
