import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { IV_FLOW_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function IvFlowGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        IV Flow Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate IV drops per minute and volume flow from tubing drop factor,
        total solution volume, and infusion time. Educational worksheet — not a
        pump program.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        IV flow rate formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: 500 mL over 4 h with drop factor 20 → 125 mL/h and
        ≈41.67 gtts/min.
      </p>

      <div id="iv-flow-faq" className="not-prose mt-8">
        <FAQAccordion items={IV_FLOW_FAQS} />
      </div>
    </article>
  );
}
