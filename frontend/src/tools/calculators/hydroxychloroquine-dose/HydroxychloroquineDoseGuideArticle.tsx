import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SOURCE_NOTE } from './calculation';
import { HYDROXYCHLOROQUINE_FAQS } from './content';

export function HydroxychloroquineDoseGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Hydroxychloroquine Dose Checker</h2>
        <p>
          This educational tool checks a supplied hydroxychloroquine sulfate
          daily regimen against FDA/DailyMed labeling. Enter actual body weight
          and your custom daily dose to see mg/kg/day. It does not invent a
          prescription from weight alone.
        </p>
      </section>
      <section id="fda-threshold">
        <h2>FDA threshold &amp; labeled ranges</h2>
        <p>
          FDA PLAQUENIL labeling associates daily hydroxychloroquine sulfate
          dosages ≥5 mg/kg of actual body weight with higher retinopathy risk.
          Absolute adult ranges on the same labeling family include rheumatoid
          arthritis initial 400–600 mg daily and chronic 200–400 mg daily, and
          systemic or discoid lupus 200 or 400 mg daily. Malaria prophylaxis
          and treatment schedules are out of scope for this daily-dose checker.
        </p>
        <p className="text-sm text-muted-foreground">{SOURCE_NOTE}</p>
      </section>
      <section id="hydroxychloroquine-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...HYDROXYCHLOROQUINE_FAQS]} />
      </section>
    </article>
  );
}
