export function DriGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="what-is-dri">What is DRI?</h3>
      <p>
        Dietary Reference Intakes (DRIs) summarize how much energy, water,
        macronutrients, vitamins, and minerals healthy people typically need.
        Values come from National Academies Food and Nutrition Board reports as
        curated by the NIH Office of Dietary Supplements. This page is an
        educational lookup — not a personalized medical diet prescription.
      </p>

      <h3 id="energy-and-macros">Energy and macronutrients</h3>
      <p>
        Body mass index uses weight (kg) ÷ height (m)². Total daily calories use
        the original Harris–Benedict resting equation with a representative age
        for the selected life-stage band, then multiply by the activity factor
        (1.2 sedentary through 2.4 professional athlete). Protein, fat, and
        carbohydrate gram ranges follow Acceptable Macronutrient Distribution
        Ranges (AMDR). Fiber is estimated as 14 g per 1,000 kcal. Fluid volume
        is approximated as 1 mL water per kilocalorie.
      </p>

      <h3 id="micronutrients">Vitamins and minerals</h3>
      <p>
        Micronutrient rows are sex- and age-band–specific RDA or AI amounts from
        NIH DRI summary tables (vitamins, elements, electrolytes). Sodium is
        shown as the Chronic Disease Risk Reduction (CDRR) ceiling of 2,300 mg
        for ages 14 and older. Where Omni-style bands merge NIH 19–30 and 31–50
        rows that differ (for example magnesium), the midpoint of the two NIH
        values is used.
      </p>

      <h3 id="smoking">Smoking and vitamin C</h3>
      <p>
        People who smoke need an extra 35 mg/day of vitamin C above the sex/age
        RDA (NIH ODS Vitamin C fact sheet). No other nutrient in this calculator
        receives a smoking adjustment.
      </p>
    </article>
  );
}
