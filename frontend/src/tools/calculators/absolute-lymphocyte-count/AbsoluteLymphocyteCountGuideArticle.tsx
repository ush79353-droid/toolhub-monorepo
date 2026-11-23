import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ABSOLUTE_LYMPHOCYTE_COUNT_FAQS } from './content';
import {
  CELLS_PER_MICROLITER_NOTE,
  SOURCE_NOTE,
  UNIT_EQUIVALENCE_NOTE,
} from './calculation';

export function AbsoluteLymphocyteCountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Absolute Lymphocyte Count Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter white blood cell count and lymphocyte differential percentage to
        compute the absolute lymphocyte count (ALC). Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How ALC Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: WBC 6 ×10³/µL with lymphocytes 25% yields ALC 1.5
        ×10³/µL (1500 cells/µL).
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unit Conventions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {UNIT_EQUIVALENCE_NOTE} When your lab prints WBC or ALC in ×10⁹/L, use
        the same numeric value as for ×10³/µL in this calculator.{' '}
        {CELLS_PER_MICROLITER_NOTE}
      </p>

      <h2
        id="clinical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Clinical Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Clinicians use absolute lymphocyte counts alongside percentages to
        assess lymphopenia, lymphocytosis, and immune status in many conditions.
        Reference intervals vary by laboratory and patient context. This page
        performs arithmetic only—it does not interpret results or recommend
        treatment.
      </p>

      <div id="alc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ABSOLUTE_LYMPHOCYTE_COUNT_FAQS]} />
        </div>
      </div>
    </article>
  );
}