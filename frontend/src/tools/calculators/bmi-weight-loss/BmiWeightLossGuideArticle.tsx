import { BMI_WEIGHT_LOSS_FAQS } from './content';

export function BmiWeightLossGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What This Calculator Does
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Enter your height and weight to see current BMI and BMI Prime. Then
          set a target BMI (or target BMI Prime / target weight) to learn the
          matching weight for your height and how much you would need to lose or
          gain. Figures are screening estimates only.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          BMI, Prime, and Target Weight
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>BMI = weight (kg) ÷ [height (m)]²</li>
          <li>BMI Prime = BMI ÷ 25</li>
          <li>Target weight (kg) = target BMI × [height (m)]²</li>
          <li>Weight change = current weight − target weight (positive = loss)</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Example: 85 kg at 175 cm → BMI ≈ 27.76 · Prime ≈ 1.11. Target BMI 22 →
          target weight ≈ 67.38 kg → about 17.62 kg to lose.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Open Current BMI and enter height and weight (units convertible).</li>
          <li>Read BMI and BMI Prime.</li>
          <li>
            Under Target BMI and weight loss, edit target BMI, target BMI Prime,
            or target weight — the other two update together.
          </li>
          <li>
            Optionally expand Check your BMI percentile for ages 2–19 (CDC LMS).
          </li>
          <li>Use Reload or Clear to reset. Share copies only the page URL.</li>
        </ol>
      </section>

      <section id="safe-targets" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Choosing a Safe Target
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The WHO adult healthy band is roughly BMI 18.5–24.9. Mid-band targets
          (about 21–23) leave a buffer. Targets below 18.5 warn; below 16 are
          rejected. Clinical guidance matters for personal goals, especially
          when starting from a high BMI or managing medical conditions.
        </p>
      </section>

      <section id="percentile" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          BMI Percentile Panel
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The collapsed panel reuses CDC 2000 BMI-for-age LMS parameters (same
          evidence base as the BMI Calculator for Kids). Enter sex and exact age
          in years when you need a childhood/teen percentile. Adults stay on WHO
          cut-offs.
        </p>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BMI cannot separate muscle from fat, and it does not prescribe calorie
          deficits, medications, or workout plans. Athletes, pregnancy, edema,
          and some ethnic groups may need different clinical tools. This page
          does not store your measurements.
        </p>
      </section>

      <section id="faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FAQ</h2>
        <dl className="space-y-4">
          {BMI_WEIGHT_LOSS_FAQS.map((item) => (
            <div key={item.question}>
              <dt className="text-sm font-semibold text-accent">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
