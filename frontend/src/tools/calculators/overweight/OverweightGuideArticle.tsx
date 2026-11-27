import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OVERWEIGHT_FAQS } from './content';

export function OverweightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is the BMI of an overweight person? Definition of overweight
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For adults, WHO defines overweight as BMI 25.0–29.99 kg/m² and obesity
        at BMI ≥ 30. This educational tool also reports adult ponderal index
        (kg/m³). Screening only — not a diagnosis.
      </p>

      <h2
        id="epidemic"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Obesity epidemic: Percentage of overweight in the USA and in other
        countries
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Population overweight and obesity rates vary by country, age, and survey
        year. Use national statistics and clinical guidelines for public-health
        context; this calculator does not store or forecast population trends.
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Overweight calculator: How to determine your BMI and ponderal index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter weight and height. Adults use WHO BMI bands plus Rohrer ponderal
        index. For a child or adolescent up to age 19, enable the checkbox and
        enter age and sex so CDC BMI-for-age percentiles can classify weight
        status.
      </p>

      <div id="ow-faq" className="not-prose mt-8">
        <FAQAccordion items={OVERWEIGHT_FAQS} />
      </div>
    </article>
  );
}
