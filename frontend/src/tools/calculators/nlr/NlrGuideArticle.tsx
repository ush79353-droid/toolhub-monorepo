import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { NLR_FAQS } from './content';

export function NlrGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        What is NLR?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Welcome to the NLR calculator, a simple tool for the
        neutrophil-to-lymphocyte ratio from a complete blood count. NLR
        summarizes relative neutrophilia versus lymphopenia and is discussed as
        a nonspecific inflammatory marker — educational only, not a diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        NLR ratio calculation
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        NLR = neutrophils ÷ lymphocytes on the same measurement basis. Use
        absolute neutrophil and lymphocyte counts (×10³/µL), or neutrophil and
        lymphocyte percentages from the same differential. Example: 4 ÷ 2 = 2.
        Zero lymphocytes make the ratio undefined.
      </p>

      <h2
        id="interpretation"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Interpretation of neutrophil-lymphocyte ratio: elevated NLR
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published cutoffs vary by population, assay, and clinical question.
        Higher NLR may accompany acute inflammation, infection, or stress
        physiology, but thresholds are not universal. Interpret only with a
        clinician and the full CBC context.
      </p>

      <div id="nlr-faq" className="not-prose mt-8">
        <FAQAccordion items={NLR_FAQS} />
      </div>
    </article>
  );
}
