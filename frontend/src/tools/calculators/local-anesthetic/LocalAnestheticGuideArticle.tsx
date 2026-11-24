import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { LOCAL_ANESTHETIC_FAQS } from './content';

export function LocalAnestheticGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Local Anesthetic Max Dose</h2>
        <p>
          Educational worksheet for plain (without epinephrine) maximum
          subcutaneous/infiltration dose by drug, weight, and concentration.
        </p>
      </section>
      <section id="limits">
        <h2>Plain dose ceilings</h2>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="la-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...LOCAL_ANESTHETIC_FAQS]} />
      </section>
    </article>
  );
}
