export function FiberGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="energy-scaled">Energy-scaled fiber target</h3>
      <p>
        Institute of Medicine Dietary Reference Intakes set total fiber guidance
        on an energy-density basis of 14 grams per 1,000 kcal. Recommended
        optimum grams equal daily kcal × 14 ÷ 1,000 (for example, 2,000 kcal →
        28 g).
      </p>
      <h3 id="ai-tables">IOM Adequate Intake</h3>
      <p>
        Life-stage and sex Adequate Intake (AI) values for total fiber are
        published separately (for example, men 19–50 y: 38 g/day; women 19–50 y:
        25 g/day; men ≥51 y: 30 g/day; women ≥51 y: 21 g/day). Pregnancy AI is
        28 g/day and lactation AI is 29 g/day. This tool reports AI distinctly
        from the energy-scaled estimate and does not invent unpublished values.
      </p>
      <h3 id="energy-base">Energy base</h3>
      <p>
        Enter recommended daily calorie intake directly (kcal or kJ), or leave
        calories blank and provide sex, age, height, weight, and activity so
        maintenance energy can be estimated with Mifflin–St Jeor × activity PAL.
        Fiber math always normalizes energy to kcal before applying 14 g/1,000
        kcal.
      </p>
    </article>
  );
}
