import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TOTAL_BODY_WATER_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function TotalBodyWaterGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Total Body Water Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate total body water from sex, age, height, and weight using the
        Watson 1980 anthropometric equations. Educational only — not a dilution
        measurement.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How does total body water calculator work?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Water mass uses 1 kg per liter, and percentage of body
        weight is 100 × water mass / body mass.
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why is the total body water calculated by body weight, height, age, and
        sex?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Watson&apos;s regression equations relate measured TBW to these simple
        anthropometrics. Age appears only in the male formula; changing age
        alone does not change the female estimate.
      </p>

      <h2
        id="interpret"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to interpret the calculated body water percentage?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Percentage of body weight is an educational index from the estimated
        water mass. Typical published ranges vary by sex and body composition;
        this tool does not diagnose dehydration or overhydration.
      </p>

      <div id="tbw-faq" className="not-prose mt-8">
        <FAQAccordion items={TOTAL_BODY_WATER_FAQS} />
      </div>
    </article>
  );
}
