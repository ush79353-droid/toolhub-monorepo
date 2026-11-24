import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LIDOCAINE_DOSE_FAQS } from './content';

export function LidocaineDoseGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>Lidocaine Dose Calculator</h2>
        <p>
          Educational worksheet for the maximum subcutaneous (infiltration)
          dose of lidocaine hydrochloride injection without epinephrine. Enter
          body weight and solution concentration to see the labeled mass ceiling
          and the matching volume. Not a prescription or dosing order.
        </p>
      </section>
      <section id="labeling">
        <h2>FDA maximum dose labeling</h2>
        <p>
          For normal healthy adults, FDA/DailyMed labeling for lidocaine HCl
          injection states that when used without epinephrine the individual
          maximum recommended dose should not exceed 4.5 mg/kg of body weight,
          and in general the maximum total dose should not exceed 300 mg.
          Concentration percent (w/v) × 10 equals mg/mL; max volume is max mass
          divided by mg/mL. This tool does not cover epinephrine-containing
          solutions (labeled 7 mg/kg / 500 mg) or non-infiltration routes.
        </p>
      </section>
      <section id="lidocaine-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...LIDOCAINE_DOSE_FAQS]} />
      </section>
    </article>
  );
}
