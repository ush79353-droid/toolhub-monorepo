export function WeightGainGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>Weight Gain Calculator</h2>
        <p>
          Estimate calories to maintain your current weight, then optionally
          plan a surplus toward a higher target weight at a Normal or Strict
          weekly pace.
        </p>
      </section>
      <section id="formula" className="scroll-mt-28">
        <h2>Maintenance &amp; Surplus</h2>
        <p>
          Maintenance uses Mifflin–St Jeor × activity. Gain calories add 500 or
          1,000 kcal/day depending on pace (≈7,700 kcal per kilogram heuristic).
        </p>
      </section>
      <section id="pace" className="scroll-mt-28">
        <h2>Gain Pace</h2>
        <p>
          Normal: 0.5 kg/week. Strict: 1 kg/week. Weeks to goal = (target −
          current) ÷ weekly pace when the target is above current weight.
        </p>
      </section>
      <section id="example" className="scroll-mt-28">
        <h2>Worked Example</h2>
        <p>
          Female · 28 · 170 cm · 60 kg · light activity · target 65 kg · Normal
          pace → maintenance ≈ 1,905 kcal/day · surplus plan ≈ 10 weeks.
        </p>
      </section>
      <section id="limits" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          Estimates ignore body composition and medical needs. Prefer gradual
          gain when unsure.
        </p>
      </section>
    </article>
  );
}
