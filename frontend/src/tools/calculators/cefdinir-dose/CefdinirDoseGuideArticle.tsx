import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CEFDINIR_DOSE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function CefdinirDoseGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Cefdinir Dose Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Look up FDA-labeled Omnicef (cefdinir) regimens for adults/adolescents and
        for children on oral suspension. Results include duration and renal
        impairment notes from the package insert.
      </p>

      <h2
        id="regimens"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Labeled regimens
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Adults with community-acquired pneumonia receive 300 mg every
        12 hours for 10 days. Children receive 7 mg/kg every 12 hours for
        labeled indications, with a 600 mg/day cap.
      </p>

      <div id="cefdinir-faq" className="not-prose mt-8">
        <FAQAccordion items={CEFDINIR_DOSE_FAQS} />
      </div>
    </article>
  );
}