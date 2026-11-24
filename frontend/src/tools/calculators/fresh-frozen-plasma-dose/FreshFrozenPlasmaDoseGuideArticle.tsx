import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ASSUMPTIONS, DISCLAIMER, SOURCE_NOTE } from './calculation';
import { FFP_DOSE_FAQS } from './content';

export function FreshFrozenPlasmaDoseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="how-it-works"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fresh Frozen Plasma Dose Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter patient weight, the labeled FFP unit (bag) volume, and an ordered
        mL/kg dose to estimate total plasma volume and the equivalent number of
        units. Results are educational arithmetic only and are not a transfusion
        order.
      </p>

      <h2
        id="dosing"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Published dosing ranges
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Volume must still be individualized by clinical situation,
        patient size, and coagulation testing per the Circular of Information.
      </p>

      <h2
        id="assumptions"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Assumptions &amp; limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {ASSUMPTIONS} {DISCLAIMER}
      </p>

      <div id="faq" className="not-prose mt-8">
        <FAQAccordion items={[...FFP_DOSE_FAQS]} />
      </div>
    </article>
  );
}
