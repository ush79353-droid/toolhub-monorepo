import { CALORIE_DEFICIT_FAQS } from './content';

export function CalorieDeficitGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What Is a Calorie Deficit Calculator?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This tool estimates the average daily calorie deficit that would match
          a chosen weight-loss amount by a target date, then shows an
          illustrative intake plan under a sedentary maintenance assumption.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          How the Deficit Is Estimated
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Days = target date − today (UTC date-only). Energy ≈ Δkg × 7,700
          kcal/kg. Daily deficit = total energy ÷ days. The 7,700 kcal/kg figure
          is a common simplified estimate of metabolizable energy associated
          with body-weight change; real-world results vary.
        </p>
      </section>

      <section id="intake-plan" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Calorie Intake Plan
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Maintenance = Mifflin–St Jeor BMR × PAL 1.2 (sedentary). Suggested
          intake = maintenance − daily deficit. Because the screenshot form has
          no activity control, the plan always uses the sedentary factor and
          labels that assumption.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Enter sex, age, height, current weight, target weight, and a future target date.</li>
          <li>Review the daily deficit and intake plan when all fields are valid.</li>
          <li>Use Reload or Clear to restore defaults or empty fields.</li>
        </ol>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Does not measure metabolism, adapt for exercise, medications,
          pregnancy, or medical conditions. Weight gain goals are out of scope.
          Extreme timelines are blocked rather than recommending unsafe intakes.
        </p>
      </section>

      <section id="calorie-deficit-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="mt-4 space-y-4">
          {CALORIE_DEFICIT_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-sm font-semibold text-accent">
                {faq.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
