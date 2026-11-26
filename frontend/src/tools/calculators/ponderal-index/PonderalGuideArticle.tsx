import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { PONDERAL_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function PonderalGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Ponderal Index Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate Rohrer's ponderal (corpulence) index from height and weight for
        adults or neonates/infants. Educational anthropometric worksheet — not a
        diagnosis.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Ponderal index formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Adult example: 80 kg at 2 m → 10 kg/m³. The same body in
        neonate mode reports 1.0 on the 100×g/cm³ scale.
      </p>

      <div id="ponderal-faq" className="not-prose mt-8">
        <FAQAccordion items={PONDERAL_FAQS} />
      </div>
    </article>
  );
}
