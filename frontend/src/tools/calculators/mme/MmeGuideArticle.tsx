import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MME_FAQS } from './content';

export function MmeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction">
        <h2>MME Calculator</h2>
        <p>
          Educational worksheet for morphine milligram equivalents (MME) using
          the CDC 2022 Clinical Practice Guideline table. Select an opioid,
          enter the total daily amount (or transdermal fentanyl patch rate),
          and read the MME/day comparison. Not a prescription, taper plan, or
          opioid-switching calculator.
        </p>
      </section>
      <section id="cdc-factors">
        <h2>CDC 2022 conversion factors</h2>
        <p>
          Factors follow the MMWR table for commonly prescribed opioids for
          pain: codeine 0.15; fentanyl transdermal 2.4 (mcg/hr); hydrocodone
          1.0; hydromorphone 5.0; methadone 4.7; morphine 1.0; oxycodone 1.5;
          oxymorphone 3.0; tapentadol 0.4; tramadol 0.2. CDC cautions that MME
          totals must not be used to select doses when converting from one
          opioid to another, and that methadone and transdermal fentanyl need
          particular care. Buprenorphine is excluded from the CDC table because
          of partial agonist ceiling effects.
        </p>
      </section>
      <section id="mme-faq">
        <h2>Frequently Asked Questions</h2>
        <FAQAccordion faqs={[...MME_FAQS]} />
      </section>
    </article>
  );
}
