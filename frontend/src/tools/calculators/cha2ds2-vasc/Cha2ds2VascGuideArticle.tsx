export function Cha2ds2VascGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">CHA₂DS₂-VASc Score</h2>
      <p>
        CHA₂DS₂-VASc estimates stroke risk factors in nonvalvular atrial
        fibrillation. This calculator sums the standard points and shows
        historical annual event rates from a large Swedish AF cohort. It does
        not prescribe treatment.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>Select Yes or No for each clinical factor (defaults are No).</li>
        <li>Choose the age band (&lt;65, 65–74, or ≥75).</li>
        <li>
          Read the score (0–9) and Friberg cohort annual stroke and composite
          embolism rates.
        </li>
      </ol>

      <h2 id="scoring">Scoring &amp; Rates</h2>
      <p>
        Points: CHF 1, hypertension 1, age 65–74 → 1 / ≥75 → 2, diabetes 1,
        prior stroke/TIA/TE 2, vascular disease 1, female sex 1. Annual rates
        follow Friberg et al. 2012 (never on warfarin): score 0 → 0.2% stroke /
        0.3% composite; score 9 → 12.2% / 17.4%.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Rates vary by population, anticoagulation exposure, and era. Valvular AF,
        hypertrophic cardiomyopathy, and other special populations need
        specialist pathways. This tool never issues anticoagulation orders.
      </p>
    </article>
  );
}
