import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { BMI_BODY_MASS_INDEX_FAQS } from './content';

export function BmiBodyMassIndexGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        BMI Calculator – Body Mass Index
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Use this BMI Calculator to convert height and weight into body mass
        index (kg/m²) and BMI Prime. Adult results follow World Health
        Organization (WHO) cut-offs. The tool is for education and screening
        context—not a medical diagnosis.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What Is BMI?
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI (Quetelet&apos;s index) compares body mass to the square of stature.
        It is widely used in population health because it needs only height and
        weight, but it does not measure fat, muscle, bone, or fitness.
      </p>

      <h2
        id="formula"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        BMI and BMI Prime Formulas
      </h2>
      <div className="my-4 space-y-2 rounded-xl border border-border bg-brand-softTeal/40 p-4 font-mono text-xs leading-relaxed text-accent sm:text-sm">
        <p>BMI = weight (kg) ÷ height (m)²</p>
        <p>BMI Prime = BMI ÷ 25</p>
        <p>Example: 80 kg at 2 m → BMI = 20.00 · Prime = 0.80</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter height in cm, m, inches, or feet and weight in kg, lb, or stone.
        The engine converts to metric before applying the formulas and rounds
        only for display.
      </p>

      <h2
        id="who-categories"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        WHO Adult Categories
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        For adults, WHO uses the same BMI cut-offs for women and men: underweight
        below 18.5 (with thinness subclasses below 16, 16–16.99, and 17–18.49),
        normal 18.5–24.99, overweight 25–29.99, and obesity classes from 30
        upward. A healthy weight band for the entered height uses BMI 18.5–24.9.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use the Calculator
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Select Female or Male (adult cut-offs are the same either way).</li>
        <li>Enter height and weight with the units you prefer.</li>
        <li>Read BMI, BMI Prime, and the WHO category.</li>
        <li>
          Optionally open &quot;BMI percentile and athletes&quot; for age path notes
          and an athlete caution.
        </li>
      </ol>

      <h2
        id="percentile-athletes"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Percentiles and Athletes
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Childhood BMI-for-age percentiles (ages 2–19.99) are sex-specific and
        use CDC LMS growth-chart parameters. Those tables are not shipped in
        this calculator, so a numeric percentile is not invented. Ages 20+ use
        WHO adult categories. Athletes and people with high muscle mass can be
        misclassified as overweight—mark the athlete option for a clear caution.
      </p>

      <h2
        id="limitations"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limitations
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        BMI ignores fat distribution, ethnicity-specific risk thresholds, pregnancy,
        edema, amputation, and many clinical contexts. Share and copy actions on
        this page send only the public tool URL—not your measurements.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/bmi-percentile-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            BMI Percentile Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/body-fat-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Body Fat Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/calorie-calculator"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Calorie Calculator
          </Link>
        </li>
      </ul>

      <div id="bmi-body-mass-index-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...BMI_BODY_MASS_INDEX_FAQS]} />
        </div>
      </div>
    </article>
  );
}
