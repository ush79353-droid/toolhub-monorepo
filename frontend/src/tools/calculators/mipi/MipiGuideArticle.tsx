import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { MIPI_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function MipiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">
        MIPI Calculator
      </h2>
      <p className="mt-3 text-sm text-foreground/90">
        Educational continuous Mantle Cell Lymphoma International Prognostic Index (MIPI) and optional
        biological MIPI-b with Ki-67.
      </p>
      <h2 id="formula" className="mt-8 text-lg font-bold text-accent">
        Formula
      </h2>
      <p className="mt-3 text-sm">
        MIPI = 0.03535×age + 0.6978 (if ECOG &gt;1) + 1.367×log₁₀(LDH/ULN) + 0.9393×log₁₀(WBC per µL).
        MIPI-b adds 0.02142×Ki-67(%). {SOURCE_NOTE}
      </p>
      <div id="faq" className="mt-8">
        <FAQAccordion items={[...MIPI_FAQS]} />
      </div>
    </article>
  );
}
