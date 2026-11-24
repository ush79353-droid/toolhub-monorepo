import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { KIDNEY_STONE_PCNL_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function KidneyStonePcnlGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Kidney STONE Calculator for Percutaneous Nephrolithotomy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational S.T.O.N.E. nephrolithometry score and approximate
        stone-free probability after a first percutaneous nephrolithotomy (PCNL)
        from CT parameters. This is not the emergency renal-colic STONE score.
      </p>

      <h2
        id="scoring"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        S.T.O.N.E. scoring system (nephrolithometry)
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE} Components: stone area (mm²), tract length (mm),
        obstruction/hydronephrosis, number of involved calyces (or staghorn),
        and stone density (HU). Total scores range from 5 to 13.
      </p>

      <h2
        id="using"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Using the kidney STONE calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select one option in each of the five radio groups. The score updates
        immediately with an approximate first-procedure stone-free percentage
        (for example, score 5 → about 94%). Defaults match the lowest-complexity
        band in each group.
      </p>

      <h2
        id="pcnl"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Percutaneous nephrolithotomy
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        PCNL is a procedure to remove larger or complex kidney stones through a
        small flank tract. Score-based percentages are population estimates for
        counseling education only and do not replace imaging review or surgical
        judgment.
      </p>

      <div id="stone-faq" className="not-prose mt-8">
        <FAQAccordion items={KIDNEY_STONE_PCNL_FAQS} />
      </div>
    </article>
  );
}
