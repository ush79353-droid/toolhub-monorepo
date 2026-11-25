import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { DISCLAIMER, ETT_FAQS, SOURCE_NOTE } from './content';

export function EndotrachealTubeSizeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Endotracheal Tube Size Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        This worksheet estimates pediatric uncuffed and cuffed endotracheal tube
        internal diameters and an oral insertion-depth estimate from age. Results
        are educational starting points only.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What is endotracheal intubation?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Endotracheal intubation places a tube through the larynx into the trachea
        to support ventilation and protect the airway. Tube diameter and depth
        must fit the patient; oversized or undersized tubes can injure the airway
        or leak.
      </p>

      <h2
        id="formulas"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        ET tube size formula
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Age range and limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cole age formulas are applied for about 1–12 years. Neonates/infants and
        adults need clinical sizing (weight, length, or habitus)—this page does
        not invent those tables. {DISCLAIMER}
      </p>

      <div id="ett-faq" className="not-prose mt-8">
        <FAQAccordion items={ETT_FAQS} />
      </div>
    </article>
  );
}
