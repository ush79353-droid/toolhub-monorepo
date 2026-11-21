import { BMI_PERCENTILE_FAQS } from './content';

export function BmiPercentileGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="what-is" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          What Is BMI Percentile?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Body mass index for age expresses a child&apos;s BMI relative to
          children of the same sex and age. Unlike adult BMI cutoffs, childhood
          interpretation uses percentiles (or z-scores) from a growth standard.
          This calculator uses the WHO Child Growth Standards BMI-for-age
          tables for ages 0–60 months.
        </p>
      </section>

      <section id="formula" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">WHO LMS Formula</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Each age and sex has LMS parameters L (Box-Cox power), M (median
          BMI), and S (coefficient of variation). The z-score is z =
          ((BMI/M)^L − 1)/(L×S) when L ≠ 0, or ln(BMI/M)/S when L = 0. WHO
          applies a restricted tail beyond ±3 SD so extreme percentiles do not
          rely on unsupported outer LMS tails. The percentile is 100 × Φ(z),
          where Φ is the standard normal CDF.
        </p>
      </section>

      <section id="age-range" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">Age Range</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Supported ages are 0–60 months (0–5 years). Enter age in months or
          years; years convert as age × 12. Values outside this window are
          rejected rather than silently extrapolated onto another chart.
        </p>
      </section>

      <section id="how-to" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Enter the child&apos;s age and choose months or years.</li>
          <li>Select boy or girl.</li>
          <li>
            Enter BMI directly, or uncheck the BMI box and provide height and
            weight.
          </li>
          <li>
            Read the percentile, z-score, and WHO median BMI for that age and
            sex.
          </li>
        </ol>
      </section>

      <section id="related" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Related Percentiles
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Weight, height, and fetal-weight percentile tools cover related growth
          questions. BMI-for-age remains the right choice when you already have
          BMI or want weight adjusted for height.
        </p>
      </section>

      <section id="bmi-percentile-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Frequently Asked Questions
        </h2>
        <dl className="mt-3 space-y-3">
          {BMI_PERCENTILE_FAQS.map((faq) => (
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
