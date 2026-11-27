import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { HEALTHY_WEIGHT_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function HealthyWeightGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Healthy Weight Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This calculator estimates an adult healthy body weight range from height
        using a BMI band. It is most appropriate for adults aged 18 or older and
        is educational only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is a healthy weight?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Population BMI charts often label a “normal” or healthy adult band near
        BMI 18.5–25. BMI does not measure body composition, so muscular or lean
        individuals can fall outside the band without the same health
        implications.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BMI healthy band
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: height 180 cm (1.80 m) → lower weight
        18.5 × 3.24 = 59.94 kg; upper exclusive boundary 25 × 3.24 = 81.00 kg.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Do not extrapolate these adult cutoffs to children. Pregnancy, edema,
        amputation, and high muscle mass all limit BMI interpretation. Seek
        clinical advice for personal targets.
      </p>

      <div id="hw-faq" className="not-prose mt-8">
        <FAQAccordion items={HEALTHY_WEIGHT_FAQS} />
      </div>
    </article>
  );
}
