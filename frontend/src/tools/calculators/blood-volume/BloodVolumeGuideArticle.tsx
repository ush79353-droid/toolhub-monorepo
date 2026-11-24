export function BloodVolumeGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <p>
        Total blood volume estimates combine plasma and cellular fractions. This
        tool applies three published adult estimators from height and weight.
      </p>
      <h3 id="nadler">Nadler formula</h3>
      <p>
        Sex-specific regression on height cubed (centimeters) and weight
        (kilograms), yielding milliliters directly.
      </p>
      <h3 id="lbb">Lemmens–Bernstein–Brodsky</h3>
      <p>
        Indexed blood volume scales with weight and corrects for BMI relative to
        22 kg/m² using 70 mL/kg (male) or 65 mL/kg (female) bases.
      </p>
      <h3 id="weight">Weight-based estimate</h3>
      <p>
        Constant 70 or 65 mL/kg — depends on weight only, not height.
      </p>
    </article>
  );
}