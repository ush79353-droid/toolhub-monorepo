export function IifymGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>IIFYM Calculator</h2>
        <p>
          If It Fits Your Macros estimates daily calories and USDA AMDR
          protein, carbohydrate, and fat gram ranges from sex, height, weight,
          age, and activity — with an optional weight-change plan.
        </p>
      </section>
      <section id="formula" className="scroll-mt-28">
        <h2>BMR, TDEE &amp; Macros</h2>
        <p>
          Basal metabolic rate uses Mifflin–St Jeor. Maintenance (TDEE) multiplies
          BMR by a physical activity level (PAL). Macro grams convert energy
          shares with 4 kcal/g (protein, carbs) and 9 kcal/g (fat).
        </p>
      </section>
      <section id="change" className="scroll-mt-28">
        <h2>Change Weight</h2>
        <p>
          Enter a target weight and Normal (0.5 kg/week) or Strict (1 kg/week)
          pace. Intake adjusts by ±500 or ±1,000 kcal/day; macros follow the
          adjusted calorie target. Deficits larger than about 7,000 kcal/week
          are not recommended in unsupervised plans.
        </p>
      </section>
      <section id="example" className="scroll-mt-28">
        <h2>Worked Example</h2>
        <p>
          Female · 30 · 165 cm · 65 kg · light activity → maintenance ≈ 1,918
          kcal/day · protein ≈ 48–168 g · carbs ≈ 216–312 g · fat ≈ 43–75 g.
        </p>
      </section>
      <section id="limits" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          Estimates ignore body composition, medical needs, and micronutrients.
          IIFYM flexibility does not replace food quality guidance.
        </p>
      </section>
    </article>
  );
}
