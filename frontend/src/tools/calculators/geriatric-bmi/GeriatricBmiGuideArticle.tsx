export function GeriatricBmiGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>Geriatric BMI Calculator</h2>
        <p>
          Calculate body mass index and interpret it with older-adult bands
          shown on the reference tool (&lt;23 / 23–29.9 / ≥30).
        </p>
      </section>
      <section id="bands" className="scroll-mt-28">
        <h2>Older-Adult BMI Bands</h2>
        <p>
          Many geriatric nutrition references use a higher underweight threshold
          than the WHO adult &lt;18.5 cut-point. This calculator follows the
          screenshot table.
        </p>
      </section>
      <section id="formula" className="scroll-mt-28">
        <h2>BMI Formula</h2>
        <p>BMI = weight (kg) ÷ height (m)². Units convert before the formula.</p>
      </section>
      <section id="limits" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          BMI ignores muscle mass, edema, and ethnicity-specific guidance. Use
          clinical judgment.
        </p>
      </section>
    </article>
  );
}
