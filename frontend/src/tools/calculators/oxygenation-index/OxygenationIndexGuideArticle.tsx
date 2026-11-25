import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { OXYGENATION_INDEX_FAQS, SOURCE_LABEL } from './content';

export function OxygenationIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Oxygenation Index Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate the PaO₂/FiO₂ ratio and conventional oxygenation index from
        inspired oxygen percent, ventilator mean airway pressure, and arterial
        PaO₂. Educational only.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Oxygenation Index formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        OI = (FiO₂ fraction × MAP × 100) ÷ PaO₂. FiO₂ is entered as a percent
        and divided by 100 once. Zero PaO₂ is rejected.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Source framing: {SOURCE_LABEL}
      </p>

      <h2
        id="fio2"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What does FiO₂ stand for?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Fraction of inspired oxygen. Room air is about 21%. Entering 50% means
        a fraction of 0.50 — the calculator does not apply a second percent
        conversion.
      </p>

      <h2
        id="pf-ratio"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        PaO₂ / FiO₂ ratio
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        P/F = PaO₂ (mmHg) ÷ FiO₂ fraction. Example: 100 mmHg at 50% oxygen →
        200. P/F omits airway pressure; OI includes MAP.
      </p>

      <div id="oi-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...OXYGENATION_INDEX_FAQS]} />
        </div>
      </div>
    </article>
  );
}
