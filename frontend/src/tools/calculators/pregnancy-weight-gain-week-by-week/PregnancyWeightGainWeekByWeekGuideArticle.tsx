import { PWG_WEEK_FAQS } from './content';

export function PregnancyWeightGainWeekByWeekGuideArticle() {
  return (
    <article className="prose prose-sm max-w-none text-accent">
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Pregnancy Weight Gain: Week by Week Breakdown
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Chart recommended minimum and maximum weight from pre-pregnancy BMI
          using the shared IOM weekly model. Defaults: blank height/weight,
          week 40, twins No, metric chart units.
        </p>
      </section>
      <section id="model" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">
          Canonical Weekly Model
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Singleton weeks use first-trimester ramp plus second/third-trimester
          rates, with official IOM totals at week 40. Twin series use
          provisional IOM totals near term only. Calculate in kg, then convert
          for chart/table units so Imperial and Metric stay in parity.
        </p>
      </section>
      <section id="how-to-use" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">How to Use</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>Enter pre-pregnancy height and weight.</li>
          <li>Set week and twins Yes/No.</li>
          <li>Choose Imperial or Metric for chart/table units.</li>
          <li>Read selected-week bounds and the week-by-week chart.</li>
        </ol>
      </section>
      <section id="pwg-week-faq" className="mt-8 scroll-mt-24">
        <h2 className="text-xl font-semibold text-accent">FAQ</h2>
        <dl className="space-y-4">
          {PWG_WEEK_FAQS.map((faq) => (
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
