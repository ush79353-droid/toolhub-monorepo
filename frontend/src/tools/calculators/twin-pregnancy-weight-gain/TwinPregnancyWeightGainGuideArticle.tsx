export function TwinPregnancyWeightGainGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2>What Is Twin Pregnancy Weight Gain?</h2>
        <p>
          Twin pregnancies often need different total gestational weight-gain
          targets than singletons. This calculator starts in twin mode and uses
          the same IOM / CDC shared engine as the Pregnancy Weight Gain tool.
        </p>
      </section>
      <section id="iom" className="scroll-mt-24">
        <h2>IOM Twin Guidelines</h2>
        <p>
          Provisional twin totals near term: normal BMI 17–25 kg, overweight
          14–23 kg, obese 11–19 kg. Underweight twin totals are not published.
          Mid-pregnancy twin week rates are not invented here.
        </p>
      </section>
      <section id="how" className="scroll-mt-24">
        <h2>How to Use</h2>
        <ol>
          <li>Enter pre-pregnancy height and weight (BMI is calculated).</li>
          <li>Set gestational week (default 40).</li>
          <li>Leave Twins = Yes, or switch to No for singleton bands.</li>
          <li>Read min/max weight and gain; units can switch between kg and lb.</li>
        </ol>
      </section>
      <section id="limits" className="scroll-mt-24">
        <h2>Limits</h2>
        <p>
          Educational ranges only. Clinical conditions, edema, and multifetal
          pregnancies beyond twins need individualized care.
        </p>
      </section>
    </article>
  );
}
