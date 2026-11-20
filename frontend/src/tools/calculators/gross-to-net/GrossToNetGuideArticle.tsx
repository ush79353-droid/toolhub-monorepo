import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { GROSS_TO_NET_FAQS } from './content';

export function GrossToNetGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="what-is-gross-to-net"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Convert between gross and net amounts when tax is a flat percentage of gross.
        Choose gross-to-net or net-to-gross, enter the rate, and review tax amount.
        Independent FX selectors apply to money fields only.
      </p>

      <h2
        id="gross-to-net-formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross → Net: Tax = Gross × r/100; Net = Gross − Tax</p>
        <p>Net → Gross: Gross = Net / (1 − r/100); Tax = Gross − Net</p>
        <p>r = 100% cannot be reversed from a nonzero net</p>
      </div>

      <h2
        id="step-by-step-example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Step-by-Step Example
      </h2>
      <div className="my-3 rounded-lg border border-border bg-muted/20 p-3 text-xs leading-relaxed text-accent sm:text-sm">
        <p>Gross 100 · tax 10% → tax 10 · net 90</p>
        <p>Net 90 · tax 10% → gross 100 · tax 10</p>
      </div>

      <h2
        id="gross-to-net-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4">
        <FAQAccordion items={[...GROSS_TO_NET_FAQS]} />
      </div>
    </article>
  );
}
