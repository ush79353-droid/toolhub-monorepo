import { ANOREXIC_BMI_FAQS } from './content';

export function AnorexicBmiGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What Is This BMI Calculator?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This tool computes body mass index (BMI) from height and weight using
          the standard Quetelet formula. The catalog title reflects historical
          search interest around anorexia-related BMI questions; the calculator
          itself is a screening BMI utility with an adult WHO reference
          interval and an explicit non-diagnostic disclaimer.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">BMI Formula</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BMI = weight (kg) ÷ [height (m)]². Example: 60 kg at 1.80 m → 60 ÷
          3.24 ≈ 18.52 kg/m². Metric, US customary, and other unit tabs convert
          inputs to kilograms and meters before calculating.
        </p>
      </section>

      <section id="adult-range" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Adult Reference Interval
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For ages 20 and older, results show the WHO adult normal-weight
          interval 18.5–24.9 kg/m². Underweight, overweight, and obesity cutoffs
          exist in WHO guidance but are not used here as diagnostic anorexia
          severity labels. Ages under 20 do not receive adult cutoffs.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Choose US, Metric, or Other Units.</li>
          <li>Enter age, sex, height, and weight.</li>
          <li>Click Calculate to see BMI and the adult healthy range when applicable.</li>
          <li>Use Clear or Reload to reset fields.</li>
        </ol>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BMI does not measure body composition, nutritional status, or mental
          health. It cannot diagnose or exclude anorexia nervosa or other eating
          disorders. Muscle mass, pregnancy, edema, and frame size can shift BMI
          without matching clinical risk. Seek qualified clinical care for
          personal concerns.
        </p>
      </section>

      <section id="anorexic-bmi-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="mt-4 space-y-4">
          {ANOREXIC_BMI_FAQS.map((faq) => (
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
