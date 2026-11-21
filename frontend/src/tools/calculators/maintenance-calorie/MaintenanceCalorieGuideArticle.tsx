export function MaintenanceCalorieGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent prose-a:text-primary">
      <section id="what-is" className="scroll-mt-24">
        <h2>What Are Maintenance Calories?</h2>
        <p>
          Maintenance calories are an estimate of how much energy you need each
          day to keep your current weight when activity stays similar. They are
          not a prescription and cannot replace individualized medical or
          dietetic care.
        </p>
      </section>
      <section id="how" className="scroll-mt-24">
        <h2>How This Calculator Works</h2>
        <p>
          Basal metabolic rate uses Mifflin–St Jeor: women{' '}
          <code>10×kg + 6.25×cm − 5×age − 161</code>; men the same with{' '}
          <code>+5</code> instead of <code>−161</code>. Maintenance = BMR × PAL.
        </p>
      </section>
      <section id="activity" className="scroll-mt-24">
        <h2>Activity Levels (PAL)</h2>
        <ul>
          <li>I do not exercise — 1.2</li>
          <li>I exercise regularly — 1.55</li>
          <li>I have a physical job — 2.0</li>
          <li>I am a professional athlete — 2.4</li>
        </ul>
      </section>
      <section id="extras" className="scroll-mt-24">
        <h2>Macros, Ideal Weight, and Goals</h2>
        <p>
          Optional panels show USDA-style macronutrient shares, Devine ideal
          weight with a BMI healthy band, or a weight-change plan using about
          7,700 kcal per kilogram with an educational intake floor and weekly
          rate caps.
        </p>
      </section>
      <section id="limits" className="scroll-mt-24">
        <h2>Limits</h2>
        <p>
          Equations are for typical healthy adults. Pregnancy, illness, eating
          disorders, medications, and very high muscle mass change needs.
          Aggressive deficits are blocked or warned rather than presented as
          safe plans.
        </p>
      </section>
    </article>
  );
}
