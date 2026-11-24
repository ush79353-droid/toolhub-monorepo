import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { CORRECTED_RETICULOCYTE_FAQS } from './content';
import { DEFAULT_REFERENCE_HEMATOCRIT_PERCENT, SOURCE_NOTE } from './calculation';

export function CorrectedReticulocyteCountGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2 id="introduction" className="text-xl font-bold text-accent">Corrected Reticulocyte Count Calculator</h2>
      <p className="mt-3 text-sm text-foreground/90">Educational corrected reticulocyte % and optional reticulocyte production index (RPI).</p>
      <h2 id="formula" className="mt-8 text-lg font-bold text-accent">Formula</h2>
      <p className="mt-3 text-sm">CRC (%) = reticulocyte % × (Hct ÷ reference Hct). Default reference {DEFAULT_REFERENCE_HEMATOCRIT_PERCENT}%. {SOURCE_NOTE}</p>
      <div id="faq" className="mt-8">
        <FAQAccordion items={[...CORRECTED_RETICULOCYTE_FAQS]} />
      </div>
    </article>
  );
}