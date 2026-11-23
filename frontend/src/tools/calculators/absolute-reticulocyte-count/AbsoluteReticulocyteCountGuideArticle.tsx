import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ABSOLUTE_RETICULOCYTE_COUNT_FAQS } from './content';
import { ASSUMPTION_NOTE, SOURCE_NOTE } from './calculation';

export function AbsoluteReticulocyteCountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Absolute Reticulocyte Count Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter patient hematocrit, reference hematocrit, and reticulocyte
        percentage to estimate absolute reticulocyte count in cells/µL.
        Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How ARC Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example at patient Hct 45%, normal Hct 45%, reticulocytes
        1%: estimated RBC 5,000,000 cells/µL and ARC 50,000 cells/µL.
      </p>

      <h2
        id="corrected"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Corrected vs Absolute
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {ASSUMPTION_NOTE}
      </p>

      <h2
        id="clinical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Clinical Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Clinicians interpret reticulocyte counts with CBC and smear data to assess
        marrow response in anemia and other hematologic conditions. Reference
        intervals vary by laboratory. This page performs arithmetic only—it does
        not interpret results or recommend treatment.
      </p>

      <div id="arc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ABSOLUTE_RETICULOCYTE_COUNT_FAQS]} />
        </div>
      </div>
    </article>
  );
}