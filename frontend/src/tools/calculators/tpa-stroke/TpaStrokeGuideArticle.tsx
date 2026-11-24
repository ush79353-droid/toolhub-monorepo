import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TPA_STROKE_FAQS } from './content';

export function TpaStrokeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>tPA Stroke Dosing Calculator</h2>
        <p>
          Educational worksheet for the labeled Activase (alteplase) total dose
          in acute ischemic stroke from body weight. Enter weight to see the
          capped milligram total. Not a prescription, eligibility screen, or
          treatment decision.
        </p>
      </section>
      <section id="labeling">
        <h2>FDA alteplase stroke dosing</h2>
        <p>
          FDA/DailyMed Activase prescribing information for acute ischemic
          stroke recommends 0.9 mg/kg (not to exceed 90 mg total), with 10% of
          the total dose as an initial intravenous bolus over 1 minute and the
          remainder infused over 60 minutes. Initiate as soon as possible but
          within the labeled symptom-onset window after excluding intracranial
          hemorrhage and other contraindications. This calculator does not model
          AMI or pulmonary embolism regimens.
        </p>
      </section>
      <section id="tpa-stroke-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...TPA_STROKE_FAQS]} />
      </section>
    </article>
  );
}
