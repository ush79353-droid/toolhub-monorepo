import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { HCT_HGB_RATIO_FAQS } from './content';

export function HematocritHemoglobinRatioGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Hematocrit to Hemoglobin Ratio</h2>
        <p>
          This educational worksheet computes hematocrit (%) divided by
          hemoglobin (g/dL). Until both values are entered, it shows the
          teaching “rule of three” factor of approximately 3.
        </p>
      </section>
      <section id="rule-of-three">
        <h2>Rule of three</h2>
        <p>
          CBC teaching often notes that hematocrit is roughly three times
          hemoglobin in g/dL (for example, 14 g/dL ↔ about 42%). That factor
          is approximate and not a laboratory reference interval or diagnosis.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="hct-hgb-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...HCT_HGB_RATIO_FAQS]} />
      </section>
    </article>
  );
}
