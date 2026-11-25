import { FAQAccordion } from '@/components/shared/FAQAccordion';
import {
  DISCLAIMER,
  SOURCE_NOTE,
  TTKG_FAQS,
  URINE_SODIUM_APPLICABILITY_NOTE,
} from './content';

export function TtkgGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        TTKG Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The transtubular potassium gradient (TTKG) compares urine-to-serum
        potassium against urine-to-serum osmolality as an educational index of
        renal tubular potassium handling.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        TTKG formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        TTKG = (urine K ÷ serum K) ÷ (urine osmolality ÷ serum osmolality). Use
        mmol/L for potassium and mOsm/kg H₂O for osmolality.
      </p>

      <h2
        id="usage"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter paired serum and urine potassium and osmolality from the same
        clinical context. {URINE_SODIUM_APPLICABILITY_NOTE}
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and caveats
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} {DISCLAIMER}
      </p>

      <div id="ttkg-faq" className="not-prose mt-8">
        <FAQAccordion items={TTKG_FAQS} />
      </div>
    </article>
  );
}