import { BMI_FOR_WOMEN_FAQS } from './content';

export function BmiForWomenGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          BMI Calculator for Women
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Use this women&apos;s adult BMI tool to compute body mass index and
          BMI Prime from height and weight. Defaults are blank height (cm),
          weight (kg), and age (years). There is no sex switch—WHO adult
          cut-offs are the same for women and men.
        </p>
      </section>

      <section id="what-is" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">What Is BMI?</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Body mass index is a simple height–weight screening index. It does not
          measure body fat, muscle, or health risk by itself. Treat results as
          educational, not diagnostic.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          BMI and BMI Prime Formulas
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BMI = weight (kg) ÷ [height (m)]². BMI Prime = BMI ÷ 25. Example: 80 kg
          at 2 m → BMI = 20.00; BMI Prime = 0.80. Imperial and stone units are
          converted to kilograms and meters before the formula runs; switching
          units preserves the physical height or weight.
        </p>
      </section>

      <section id="who-categories" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          WHO Adult Categories
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For ages 20 and older (or when age is left blank for comparison),
          results show WHO adult categories: severe/moderate/mild thinness,
          normal (18.5–24.99), overweight (25–29.99), and obesity classes I–III.
          A healthy weight band for BMI 18.5–24.9 is also shown for the entered
          height.
        </p>
      </section>

      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          How to Use the Calculator
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Enter height and choose cm, m, in, or ft.</li>
          <li>Enter weight and choose kg, lb, or st.</li>
          <li>Optionally enter age in years to confirm the adult path.</li>
          <li>Read BMI, BMI Prime, and any adult category notes.</li>
          <li>Use Reload or Clear to reset; Share uses only the page URL.</li>
        </ol>
      </section>

      <section id="age-guard" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Age and Adult Cut-offs
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ages under 20 still receive BMI and BMI Prime, but adult WHO category
          labels are withheld. Childhood and teen assessment should use age-
          and sex-specific BMI-for-age percentiles (for example CDC growth
          charts), not adult cut-offs.
        </p>
      </section>

      <section id="pregnancy" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Pregnancy Caution</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Do not evaluate pregnancy weight gain with adult WHO BMI
          weight-status labels. During pregnancy, clinicians use pre-pregnancy
          BMI and trimester-specific gestational weight-gain ranges (for
          example IOM/ACOG guidance). This calculator remains a non-pregnant
          adult screening aid.
        </p>
      </section>

      <section id="limitations" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Limitations</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BMI ignores body composition. Muscular athletes can appear overweight
          despite low body fat. Edema, frame size, ethnicity, and life stage
          can also shift interpretation. Seek qualified clinical care for
          personal decisions.
        </p>
      </section>

      <section id="bmi-for-women-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {BMI_FOR_WOMEN_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="text-sm font-semibold text-accent">
                {faq.question}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
