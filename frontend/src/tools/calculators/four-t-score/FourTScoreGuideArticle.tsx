import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FOUR_T_SCORE_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function FourTScoreGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        4T Score Calculator | HIT
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational 4Ts pretest probability score (0–8) for
        heparin-induced thrombocytopenia (HIT). The tool sums thrombocytopenia
        (percent fall plus nadir jointly), timing of platelet decline, thrombosis
        features, and competing explanations for thrombocytopenia. It reports
        score points and teaching PPV bands — not a diagnosis or anticoagulation
        order.
      </p>

      <h2
        id="components"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Four 4Ts Components
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <strong>Thrombocytopenia</strong> — percent platelet fall and absolute
          nadir together (0–2 points).
        </li>
        <li>
          <strong>Timing</strong> — onset relative to heparin (classic days 5–10
          window) (0–2 points).
        </li>
        <li>
          <strong>Thrombosis</strong> — new, progressive, or suspected
          thrombosis or characteristic skin/systemic reactions (0–2 points).
        </li>
        <li>
          <strong>oTher causes</strong> — whether a definite alternate diagnosis
          explains the cytopenia (0–2 points; “none” scores highest).
        </li>
      </ul>

      <h2
        id="thrombocytopenia"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Platelet Fall and Nadir
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The thrombocytopenia column is not two separate scores. Published 4Ts
        rules award 2 points only when fall is &gt;50% <em>and</em> nadir is
        ≥20 ×10⁹/L. Fall &lt;30% or nadir &lt;10 ×10⁹/L yields 0 on that
        component even if the other measure looks severe (for example &gt;50%
        fall with nadir &lt;10 scores 0). Intermediate patterns (30–50% fall
        and/or nadir 10–19.9 without meeting the “2” rule) score 1.
      </p>

      <h2
        id="probability"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Pretest Probability Bands
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Total 0–3 → low pretest probability (~5% PPV in meta-analysis teaching
        summaries); 4–5 → intermediate (~14%); 6–8 → high (~64%). These figures
        come from Cuker et al. (Blood 2012) and describe cohorts referred for
        HIT workup — not calibrated individual risk.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select platelet percent fall and nadir from the patient chart.</li>
        <li>Choose timing and thrombosis findings from the dropdowns.</li>
        <li>
          Indicate whether another diagnosis definitely explains
          thrombocytopenia.
        </li>
        <li>Read the live 4Ts score (pts) and HIT probability wording.</li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Default screenshot profile: fall &lt;30%, nadir &lt;10 ×10⁹/L, onset
        &lt;4 days without heparin exposure, no thrombosis, definite other cause
        → score <strong>0</strong> — “The probability of HIT … is low (~5%).”
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        HIT is a clinical–laboratory diagnosis. The 4Ts does not replace PF4
        antibody or serotonin-release assay testing, hematology consultation, or
        institutional protocols for heparin cessation. Do not use this score alone
        in pregnant patients, dialysis, or prolonged LMWH courses without local
        guidance. This page is for learning — not medical advice.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/has-bled-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            HAS-BLED Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/revised-geneva-score-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Revised Geneva Score
          </Link>
        </li>
      </ul>

      <h2
        id="four-t-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-3">
        <FAQAccordion faqs={[...FOUR_T_SCORE_FAQS]} />
      </div>
    </article>
  );
}