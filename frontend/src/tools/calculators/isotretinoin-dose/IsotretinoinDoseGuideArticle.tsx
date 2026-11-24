import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { ISOTRETINOIN_FAQS } from './content';

export function IsotretinoinDoseGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Isotretinoin Dose Worksheet</h2>
        <p>
          This educational tool converts a planned cumulative mg/kg target and
          body weight into total milligrams, then solves either therapy duration
          or daily dose. It is not a prescription.
        </p>
      </section>
      <section id="math">
        <h2>How the math works</h2>
        <p>
          Cumulative mass (mg) = weight (kg) × planned mg/kg. Duration (days) =
          mass ÷ daily mg, or daily mg = mass ÷ duration days. The screenshot
          mean of 135 mg/kg is a teaching example; FDA labeling uses daily
          mg/kg ranges and a 15–20 week course length instead of a fixed
          cumulative target.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="isotretinoin-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...ISOTRETINOIN_FAQS]} />
      </section>
    </article>
  );
}
