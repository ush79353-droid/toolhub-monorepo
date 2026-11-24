export function KetoGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>Keto Calculator</h2>
        <p>
          Estimate daily calorie allocation for a high-fat, very-low-carbohydrate
          pattern and split energy into fat, carbohydrate, and protein intakes
          using published educational macro shares.
        </p>
      </section>
      <section id="formula" className="scroll-mt-28">
        <h2>Calories &amp; Macros</h2>
        <p>
          Basal metabolic rate uses Mifflin–St Jeor. Maintenance multiplies BMR
          by a physical activity level (PAL). Default macro energy shares are
          75% fat, 5% carbohydrate, and 20% protein. Mass intakes divide
          allocated calories by 9, 4, and 4 kcal/g respectively.
        </p>
      </section>
      <section id="pace" className="scroll-mt-28">
        <h2>Diet Pace</h2>
        <p>
          Normal targets about 0.5 kg (≈1 lb) per week with a ±500 kcal/day
          adjustment. Strict targets about 1 kg (≈2 lb) per week with
          ±1,000 kcal/day. Direction follows whether target weight is below or
          above current weight. Equal target and current weight keep maintenance
          calories.
        </p>
      </section>
      <section id="example" className="scroll-mt-28">
        <h2>Worked Example</h2>
        <p>
          A 2,000 kcal/day allocation at 75 / 5 / 20 yields about 1,500 kcal
          (167 g) fat, 100 kcal (25 g) carbohydrate, and 400 kcal (100 g)
          protein.
        </p>
      </section>
      <section id="limits" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          Estimates ignore body composition, medical needs, and micronutrients.
          Classic therapeutic ketogenic ratios (3:1 / 4:1) are out of scope for
          this recreational worksheet.
        </p>
      </section>
    </article>
  );
}
