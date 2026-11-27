import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BSA_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function BsaGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BSA Calculator – Body Surface Area
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter weight and height to estimate body surface area. The primary result
        uses the Du Bois equation; expand Additional BSA calculations for
        alternate published formulas.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        The BSA formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="why"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Why use this calculator?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BSA estimates are used in physiology teaching and some dosing frameworks.
        Different formulas can disagree slightly — compare methods before relying
        on a single number.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Other considerations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Extreme body composition, edema, amputation, and pediatric populations may
        need specialized approaches. This tool is educational and not a
        prescribing authority.
      </p>

      <div id="bsa-faq" className="not-prose mt-8">
        <FAQAccordion items={BSA_FAQS} />
      </div>
    </article>
  );
}
