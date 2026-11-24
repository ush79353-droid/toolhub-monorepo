export function EerCalculatorGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-muted-foreground">
      <h2 id="introduction">EER Calculator</h2>
      <p>
        Estimated Energy Requirement (EER) is the average dietary energy intake predicted to
        maintain energy balance in a healthy adult of a defined age, sex, weight, height, and
        physical activity level, consistent with good health (Institute of Medicine Dietary
        Reference Intakes).
      </p>
      <h2 id="formula">IOM DRI equations</h2>
      <p>
        This tool uses the published adult (≥19 years) IOM 2002/2005 regression equations with
        height in meters and weight in kilograms. Physical activity enters as a PA coefficient
        for the selected sedentary, low active, active, or very active category.
      </p>
      <h2 id="activity">Physical activity</h2>
      <p>
        Activity labels match the classic DRI PAL categories. Selecting a level updates the
        educational description beneath the radios; only the matching PA coefficient changes the
        calculated EER.
      </p>
      <h2 id="pregnancy">Pregnancy &amp; lactation</h2>
      <p>
        Pregnancy and breastfeeding energy deposition offsets from the same DRI edition are shown
        as reference additions and are kept separate from the baseline EER calculation.
      </p>
    </article>
  );
}
