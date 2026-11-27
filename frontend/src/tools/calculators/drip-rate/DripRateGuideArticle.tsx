import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DRIP_RATE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function DripRateGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Drip Rate Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the IV infusion rate needed to deliver a weight-based liquid
        drug dose. Educational only — not a prescription or pump program.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is the IV drip rate?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        In intravenous therapy, drip rate is the volumetric infusion rate
        (typically mL/h) that delivers a prescribed dose given the solution
        concentration. Flow rate is the same idea expressed in drops per minute
        (gtts/min) using the tubing drop factor.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Flow rate and drip rate formulas
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate the drip rate: an example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Desired dose 0.02 mg/kg/min, weight 85 kg, 10 mg drug in a 40 mL bag
        (concentration 250 mg/L), drop factor 10 gtts/mL → drip rate 408 mL/h
        and flow rate 68 gtts/min.
      </p>

      <div id="drip-faq" className="not-prose mt-8">
        <FAQAccordion items={DRIP_RATE_FAQS} />
      </div>
    </article>
  );
}
