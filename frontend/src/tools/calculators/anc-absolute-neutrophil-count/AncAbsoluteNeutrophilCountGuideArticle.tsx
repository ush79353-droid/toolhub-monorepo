import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ANC_ABSOLUTE_NEUTROPHIL_COUNT_FAQS } from './content';
import { SOURCE_NOTE, UNIT_EQUIVALENCE_NOTE } from './calculation';

export function AncAbsoluteNeutrophilCountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        ANC Calculator — Absolute Neutrophil Count
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter white blood cell count, neutrophil granulocytes (segs %), and
        neutrophilic band forms (bands %) to compute the absolute neutrophil
        count (ANC). Educational use only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How ANC Is Calculated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: WBC 5 ×10³/µL with segs 40% and bands 2% yields
        ANC 2.1 ×10³/µL.
      </p>

      <h2
        id="units"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Unit Conventions
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {UNIT_EQUIVALENCE_NOTE} When your lab prints WBC or ANC in ×10⁹/L, use
        the same numeric value as for ×10³/µL in this calculator.
      </p>

      <h2
        id="clinical"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Clinical Context
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Clinicians use ANC to monitor neutropenia risk, infection susceptibility,
        and response to myelosuppressive therapy. Reference intervals vary by
        laboratory and patient context. This page performs arithmetic only—it
        does not interpret results or recommend treatment.
      </p>

      <div id="anc-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...ANC_ABSOLUTE_NEUTROPHIL_COUNT_FAQS]} />
        </div>
      </div>
    </article>
  );
}