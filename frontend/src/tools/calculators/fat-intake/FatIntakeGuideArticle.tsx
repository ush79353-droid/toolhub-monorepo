export function FatIntakeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h3 id="amdr">Total fat AMDR</h3>
      <p>
        Adult Acceptable Macronutrient Distribution Range (AMDR) for total fat is
        20–35% of energy (Institute of Medicine Dietary Reference Intakes). Target
        grams equal kcal/day × share ÷ 9 kcal/g.
      </p>
      <h3 id="saturated">Saturated fat guidance</h3>
      <p>
        Dietary Guidelines for Americans recommend less than 10% of calories from
        saturated fat. That bound is shown separately from total-fat AMDR rows and
        is not a clinical prescription.
      </p>
      <h3 id="energy">Energy base</h3>
      <p>
        Enter daily calories directly, or leave them blank and provide sex, age,
        height, weight, and activity so maintenance energy can be estimated with
        Mifflin–St Jeor × activity PAL.
      </p>
    </article>
  );
}
