import Link from 'next/link';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { FERTILITY_BY_AGE_FAQS } from './content';
import { FECUNDABILITY_BANDS, SOURCE_LABEL } from './calculation';

export function FertilityByAgeGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Fertility by Age Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Select an age to see an educational estimate of the average chance of
        pregnancy in each menstrual cycle for that age band.
      </p>

      <h2
        id="what-it-shows"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What the Percent Means
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        The result is fecundability — the average probability of pregnancy per
        cycle in a general population without known infertility — expressed as
        a percent. It is not a live-birth rate and not a guarantee for any one
        couple.
      </p>

      <h2
        id="bands"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Age Bands Used
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {FECUNDABILITY_BANDS.map((b) => (
          <li key={b.label}>
            {b.label}: <strong>{b.percent}%</strong> per cycle
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {SOURCE_LABEL}
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Open the Age dropdown (starts on Select).</li>
        <li>Choose an age from 20 to 44 years.</li>
        <li>Read the percent chance to conceive in each cycle.</li>
      </ol>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Timing of intercourse, smoking, BMI, sexually transmitted infections,
        prior pregnancies, and male fertility all change real-world odds. Seek
        clinical advice if pregnancy has not occurred after 12 months of trying
        (or after 6 months if age 35+), or sooner if you have known risk factors.
      </p>

      <h2
        id="related"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Related Calculators
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          <Link
            href="/tools/ovulation-calculator"
            className="text-primary hover:underline"
          >
            Ovulation Calculator
          </Link>
        </li>
        <li>
          <Link
            href="/tools/conception-calculator"
            className="text-primary hover:underline"
          >
            Conception Calculator
          </Link>
        </li>
      </ul>

      <div id="fertility-faq" className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion items={[...FERTILITY_BY_AGE_FAQS]} />
        </div>
      </div>
    </article>
  );
}
