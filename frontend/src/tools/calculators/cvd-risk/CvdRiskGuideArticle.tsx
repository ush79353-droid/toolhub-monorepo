export function CvdRiskGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <h2 id="introduction">10-Year CVD Risk</h2>
      <p>
        This calculator estimates 10-year general cardiovascular disease risk
        with the Framingham Heart Study lipid equation published by D&apos;Agostino
        and colleagues (2008). Educational only.
      </p>

      <h2 id="how-to">How to Use</h2>
      <ol>
        <li>Select Female or Male.</li>
        <li>Enter age (30–74 years), HDL, total cholesterol, and systolic BP.</li>
        <li>
          Optionally mark treated hypertension, smoking, and diabetes.
        </li>
        <li>Read the estimated 10-year CVD risk percent.</li>
      </ol>

      <h2 id="formula">Formula</h2>
      <p>
        Risk = 1 − S₀^exp(ΣβX − mean), with natural logs of age, total
        cholesterol, HDL, and SBP, plus smoking and diabetes indicators.
        Sex-specific β, mean, and S₀ come from the Framingham published tables.
      </p>

      <h2 id="limits">Limits &amp; Safety</h2>
      <p>
        Not for people with known CVD, ages outside 30–74, or special
        populations requiring other scores (e.g., modern ASCVD PCE). Does not
        recommend therapy.
      </p>
    </article>
  );
}
