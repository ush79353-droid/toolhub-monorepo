import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { MENTZER_INDEX_FAQS } from './content';

export function MentzerIndexGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Mentzer Index</h2>
        <p>
          This educational worksheet computes the Mentzer index from a complete
          blood count: mean corpuscular volume (MCV) in femtoliters divided by
          the red blood cell count in millions per microliter (million/mm³ is
          numerically the same unit).
        </p>
      </section>
      <section id="how-it-works">
        <h2>How the Mentzer index works</h2>
        <p>
          Mentzer (Lancet, 1973) proposed MCV ÷ RBC as a simple way to help
          separate iron-deficiency anemia from β-thalassemia trait when both
          produce microcytosis. Teaching summaries commonly use a cutoff of 13:
          values below 13 favor thalassemia trait; values above 13 favor iron
          deficiency. An index of 13 is treated as borderline.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="limitations">
        <h2>Screening limitations</h2>
        <p>
          The Mentzer index is not diagnostic. Coexisting disease, pregnancy,
          bleeding, hemolysis, polycythemia, partially treated iron deficiency,
          or combined iron deficiency plus thalassemia trait can invalidate the
          screen. Confirm with iron studies and hemoglobin analysis when the
          clinical question requires it.
        </p>
      </section>
      <section id="mentzer-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...MENTZER_INDEX_FAQS]} />
      </section>
    </article>
  );
}
