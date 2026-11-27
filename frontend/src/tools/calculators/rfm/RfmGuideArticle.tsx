import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { RFM_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function RfmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        RFM Calculator (Relative Fat Mass)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate adult Relative Fat Mass from height, waist circumference, and
        sex. Educational anthropometric worksheet — not densitometry.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Relative Fat Mass formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Fixture: height 180 cm, waist 90 cm → RFM 24% (male) or
        36% (female).
      </p>

      <div id="rfm-faq" className="not-prose mt-8">
        <FAQAccordion items={RFM_FAQS} />
      </div>
    </article>
  );
}
