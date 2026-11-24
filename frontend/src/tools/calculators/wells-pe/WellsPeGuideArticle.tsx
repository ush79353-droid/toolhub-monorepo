import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { WELLS_PE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function WellsPeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Wells Score Calculator for Pulmonary Embolism
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational Wells criteria score for pulmonary embolism
        pretest probability. Tick the published clinical criteria to see the
        live score plus two-level and three-level probability bands with cohort
        incidence context.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Calculator Does
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        It applies the original Wells PE point weights. Classifications support
        evaluation and cannot independently rule out PE. It does not diagnose
        PE or order imaging.
      </p>

      <h2
        id="weights"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Scoring Weights
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Clinical symptoms of DVT → 3</li>
        <li>Heart rate &gt; 100 bpm → 1.5</li>
        <li>Immobilization ≥3 days or surgery within 4 weeks → 1.5</li>
        <li>Previous DVT/PE → 1.5</li>
        <li>Hemoptysis → 1</li>
        <li>Malignancy (treated within 6 months or palliative) → 1</li>
        <li>PE as likely as (or more likely than) an alternative diagnosis → 3</li>
      </ul>

      <h2
        id="bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Two- and Three-Level Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Two-level: ≤4 unlikely, &gt;4 likely. Three-level: &lt;2 low, 2–6
        intermediate, &gt;6 high. Incidence phrases summarize published cohort
        ranges for teaching — not individual absolute risk.
      </p>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Clinical symptoms of DVT alone → score <strong>3</strong> (unlikely /
        intermediate).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Educational use only. Score bands do not replace clinical judgment,
        D-dimer pathways, or imaging decisions. Entries are not stored server-
        side.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/revised-geneva-score-calculator-for-pulmonary-embolism"
            className="text-primary underline-offset-2 hover:underline"
          >
            Revised Geneva Score Calculator for Pulmonary Embolism
          </Link>
        </li>
        <li>
          <Link
            href="/tools/perc-calculator-pulmonary-embolism-rule-out-criteria"
            className="text-primary underline-offset-2 hover:underline"
          >
            PERC Calculator
          </Link>
        </li>
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <div id="wells-pe-faq" className="mt-8">
        <FAQAccordion faqs={[...WELLS_PE_FAQS]} />
      </div>
    </article>
  );
}
