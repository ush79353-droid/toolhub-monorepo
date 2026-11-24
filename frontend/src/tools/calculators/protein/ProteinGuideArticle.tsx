export function ProteinGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="general">General IOM / AMDR</h3>
      <p>
        The Institute of Medicine Recommended Dietary Allowance for protein is
        expressed in grams per kilogram of body weight by life stage (0.80 g/kg
        for adults 19 years and older). Separately, the Acceptable Macronutrient
        Distribution Range allocates 10–35% of daily energy to protein; grams
        equal kcal × share ÷ 4 kcal/g.
      </p>
      <h3 id="sport">Sport ACSM bands</h3>
      <p>
        When Recommendations for sport is selected, a training-focus control
        appears. Educational ACSM teaching ranges multiply body weight: endurance
        1.2–1.4 g/kg, strength/power 1.6–1.7 g/kg, or the broader ACSM/AND/DC
        athletic band 1.2–2.0 g/kg. These are not individualized prescriptions.
      </p>
      <h3 id="energy">Energy base</h3>
      <p>
        Enter daily calories directly, or leave them blank and provide sex, age,
        height, weight, and activity so maintenance energy can be estimated with
        Mifflin–St Jeor × activity PAL. AMDR rows use that energy base only.
      </p>
    </article>
  );
}
