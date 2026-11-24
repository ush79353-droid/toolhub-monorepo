import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OPIOID_CONVERSION_FAQS } from './content';

export function OpioidConversionGuideArticle() {
  return (
    <article className="prose prose-neutral max-w-none">
      <section id="introduction" className="scroll-mt-28">
        <h2>Opioid Conversion Calculator</h2>
        <p>
          Enter a single opioid dose (with route) to populate approximate
          equianalgesic equivalents across the listed agents. Incomplete
          cross-tolerance reduces converted doses. This is a teaching worksheet
          for comparing published factors—not a dosing order.
        </p>
      </section>

      <section id="sources" className="scroll-mt-28">
        <h2>Published conversion factors</h2>
        <p>
          Oral morphine is the comparison anchor. CDC 2022 morphine milligram
          equivalent (MME) factors cover overlapping oral agents and transdermal
          fentanyl (mcg/h × 2.4). NHS Scottish Palliative Care Guidelines supply
          route-specific pairs for SC/IV morphine, diamorphine, oxycodone SC,
          alfentanil, and hydromorphone SC. FDA Duragesic and Butrans labeling
          constrain how patch rows may be interpreted clinically.
        </p>
      </section>

      <section id="opioid-faq" className="scroll-mt-28">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion items={[...OPIOID_CONVERSION_FAQS]} />
      </section>
    </article>
  );
}
