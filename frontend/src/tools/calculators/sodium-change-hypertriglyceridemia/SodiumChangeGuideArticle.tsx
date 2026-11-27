import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { SODIUM_CHANGE_FAQS } from './content';
import { SOURCE_NOTE } from './calculation';

export function SodiumChangeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Sodium Change Calculator in Hypertriglyceridemia
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate how much measured serum sodium may be depressed by severe
        hypertriglyceridemia (pseudohyponatremia) when labs use indirect
        ion-selective electrodes. Educational only.
      </p>

      <h2
        id="what"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Sodium in hypertriglyceridemia
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Elevated triglycerides increase the non-water fraction of plasma. On
        diluted indirect assays, measured sodium can look low even when sodium
        in plasma water is normal.
      </p>

      <h2
        id="pseudo"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pseudohyponatremia phenomenon
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {SOURCE_NOTE}
      </p>

      <h2
        id="how"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to use the sodium change calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter measured serum sodium (mEq/L) and triglycerides (mg/dL or mmol/L).
        Example: Na 130 with TG 5000 mg/dL → ΔNa 10 → corrected 140 mEq/L.
      </p>

      <div id="sodium-change-faq" className="not-prose mt-8">
        <FAQAccordion items={SODIUM_CHANGE_FAQS} />
      </div>
    </article>
  );
}
