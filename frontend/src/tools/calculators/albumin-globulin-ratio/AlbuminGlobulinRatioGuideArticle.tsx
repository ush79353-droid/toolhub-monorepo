import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { ALBUMIN_GLOBULIN_RATIO_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function AlbuminGlobulinRatioGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Albumin Globulin Ratio Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter albumin and total protein to compute globulin and the A/G ratio
        from a standard chemistry panel.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Example: albumin 4 g/dL and total protein 7 g/dL give
        globulin 3 g/dL and A/G ratio 1.33.
      </p>

      <div id="ag-faq" className="not-prose mt-8">
        <FAQAccordion items={ALBUMIN_GLOBULIN_RATIO_FAQS} />
      </div>
    </article>
  );
}