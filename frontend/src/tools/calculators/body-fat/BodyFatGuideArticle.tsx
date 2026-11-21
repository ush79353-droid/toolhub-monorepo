export function BodyFatGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent prose-a:text-primary">
      <section id="what-is" className="scroll-mt-24">
        <h2>What Is the Body Fat Calculator?</h2>
        <p>
          This tool estimates percent body fat from simple anthropometry. You
          choose sex and one of three published methods, then enter age, height,
          and weight. Fat mass, lean mass, and BMI are derived from the same
          inputs. It is an educational screening aid — not a clinic visit, DXA
          scan, or body-composition prescription.
        </p>
      </section>

      <section id="methods" className="scroll-mt-24">
        <h2>Calculation Methods</h2>
        <p>
          <strong>American Diabetes Association (most common)</strong> uses the
          CUN-BAE equation reported in <em>Diabetes Care</em> (2012;35:383–388).
          It predicts body fat from age, sex, and BMI with polynomial terms and
          was validated against air-displacement plethysmography in a large adult
          cohort (SEE ≈ 4.7%).
        </p>
        <p>
          <strong>U.S. Navy (most precise)</strong> applies the Naval Health
          Research Center circumference equations (Hodgdon &amp; Beckett). Men
          need height, waist, and neck; women also need hip. All lengths are
          converted to centimeters before the metric log₁₀ formulas.
        </p>
        <p>
          <strong>BMI (least precise)</strong> uses Deurenberg’s adult equations:
          BF% = 1.20×BMI + 0.23×age − 16.2 (men) or − 5.4 (women). It is kept for
          comparison when tape measurements are unavailable.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-24">
        <h2>How to Use</h2>
        <ol>
          <li>Select Female or Male.</li>
          <li>Pick ADA, U.S. Navy, or BMI.</li>
          <li>Enter age in years, height, and body weight (switch cm/in or kg/lb as needed).</li>
          <li>
            For Navy, add neck and waist; add hip when sex is Female. Measure
            waist at the navel for men and at the narrowest point for women; hips
            at the widest point; neck just below the larynx.
          </li>
          <li>
            Read estimated body fat % and fat mass. Expand “BMI and lean body
            mass” for the supporting figures.
          </li>
        </ol>
      </section>

      <section id="results" className="scroll-mt-24">
        <h2>Reading the Results</h2>
        <p>
          Estimated body fat is percent of total body weight. Body fat weight is
          that fraction times your entered mass. Lean body mass is the remainder.
          BMI is always kg/m² after unit conversion and does not by itself prove
          adiposity quality (muscle versus fat).
        </p>
      </section>

      <section id="limits" className="scroll-mt-24">
        <h2>Limits and Accuracy</h2>
        <p>
          CUN-BAE was studied mainly in adults about 18–80 years old. Navy
          equations assume correct tape sites and body shapes typical of service
          populations. BMI-based estimates cannot distinguish dense muscle from
          fat. Out-of-range or structurally invalid Navy combinations (for
          example waist ≤ neck) are rejected instead of inventing a number.
        </p>
      </section>
    </article>
  );
}
