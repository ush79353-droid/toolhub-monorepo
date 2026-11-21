export function CalorieGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent prose-headings:text-accent">
      <section id="introduction" className="scroll-mt-28">
        <h2>Calorie Calculator</h2>
        <p>
          Estimate how many kilocalories you may need each day to maintain your
          current weight, based on sex, age, height, weight, and activity.
        </p>
      </section>
      <section id="formula" className="scroll-mt-28">
        <h2>Mifflin–St Jeor Formula</h2>
        <p>
          Male BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + 5. Female BMR =
          10×weight + 6.25×height − 5×age − 161. TDEE = BMR × PAL.
        </p>
      </section>
      <section id="activity" className="scroll-mt-28">
        <h2>Activity Levels</h2>
        <p>
          PAL factors follow the Omni Calorie Calculator bands from sedentary
          (1.2) through professional athlete (2.3). The default screenshot
          option is Exercise 1–2 times/week (1.4).
        </p>
      </section>
      <section id="how-to-use" className="scroll-mt-28">
        <h2>How to Use</h2>
        <p>
          Choose sex, enter age/height/weight (switch units as needed), pick an
          activity level, and read kcal/day. Share copies the public page URL
          without your metrics.
        </p>
      </section>
      <section id="example" className="scroll-mt-28">
        <h2>Worked Example</h2>
        <p>
          Female · 25 years · 168 cm · 62 kg · Exercise 1–2 times/week → BMR ≈
          1,384 kcal/day → TDEE ≈ 1,938 kcal/day.
        </p>
      </section>
      <section id="limitations" className="scroll-mt-28">
        <h2>Limitations</h2>
        <p>
          Estimates ignore body composition, illness, and pregnancy. Prefer a
          lower activity band if unsure.
        </p>
      </section>
    </article>
  );
}
