import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { LBM_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function LbmGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Lean Body Mass Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate lean body mass with the Boer anthropometric equations from
        sex, weight, and height. Educational worksheet — not imaging.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Boer lean body mass formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Male example: 75 kg at 180 cm → 59.385 kg.
      </p>

      <div id="lbm-faq" className="not-prose mt-8">
        <FAQAccordion items={LBM_FAQS} />
      </div>
    </article>
  );
}
