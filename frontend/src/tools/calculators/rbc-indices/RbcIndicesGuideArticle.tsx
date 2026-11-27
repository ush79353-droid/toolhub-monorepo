import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RBC_INDICES_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function RbcIndicesGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RBC Indices Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter hemoglobin, hematocrit, and red blood cell count to estimate MCH,
        MCHC, and MCV. This educational worksheet does not replace a laboratory
        report or clinical assessment.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to calculate RBC indices
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Worked example: Hb 15 g/dL, Hct 45%, RBC 5 ×10⁶/µL → MCH
        30 pg/cell, MCHC 33.33 g/dL, MCV 90 fL.
      </p>

      <h2
        id="mchc"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is MCHC?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        MCHC is the mean corpuscular hemoglobin concentration — average
        hemoglobin concentration within red cells. Low or high values can appear
        with certain anemias, specimen issues, or analyzer artifacts and need
        clinical correlation.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Unit conventions must match the formulas above. Reference intervals vary
        by laboratory, age, and method. Do not diagnose anemia type from these
        indices alone.
      </p>

      <div id="rbc-faq" className="not-prose mt-8">
        <FAQAccordion items={RBC_INDICES_FAQS} />
      </div>
    </article>
  );
}
