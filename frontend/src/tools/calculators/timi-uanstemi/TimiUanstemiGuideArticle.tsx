import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { TIMI_UANSTEMI_FAQS } from './content';
import { SOURCE_LABEL } from './calculation';

export function TimiUanstemiGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        TIMI Score Calculator for UA/NSTEMI
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an educational TIMI risk score (0–7) for unstable angina /
        non–ST-elevation myocardial infarction using the seven binary predictors
        published by Antman et al. (JAMA 2000). The tool reports the integer
        total and the TIMI 11B test-cohort 14-day composite event-rate band — not
        a diagnosis, disposition, or treatment order.
      </p>

      <h2
        id="factors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Seven TIMI Factors
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Each present factor adds one point:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Age ≥65 years</li>
        <li>
          ≥3 CAD risk factors (family history, hypertension,
          hypercholesterolemia, diabetes, current smoker)
        </li>
        <li>Known CAD (prior stenosis ≥50%)</li>
        <li>Aspirin use in the prior 7 days</li>
        <li>≥2 anginal episodes in the prior 24 hours</li>
        <li>ST-segment deviation ≥0.5 mm on the presenting ECG</li>
        <li>Elevated cardiac markers (CK-MB and/or cardiac troponin)</li>
      </ul>

      <h2
        id="event-rates"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        14-Day Event Rates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Published TIMI 11B test-cohort composite rates (all-cause mortality, new
        or recurrent MI, or severe recurrent ischemia requiring urgent
        revascularization) were 4.7% for scores 0/1, 8.3% for 2, 13.2% for 3,
        19.9% for 4, 26.2% for 5, and 40.9% for 6/7. Scores 0–1 and 6–7 were
        pooled in the source table. This calculator rounds the 0–1 band to 5% for
        display (reference screenshot) and uses nearest-integer rounding for the
        remaining bands while documenting the full source table in the engine.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>Answer each of the seven Yes/No questions from presentation data.</li>
        <li>Leave a factor as No when the finding is absent.</li>
        <li>
          Read the integer TIMI score (0–7) and the educational 14-day composite
          risk percentage shown under Result.
        </li>
        <li>
          Share or copy uses the public page URL only — clinical answers are not
          placed in the link.
        </li>
      </ol>

      <h2
        id="example"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Worked Example
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        All seven factors answered No → score <strong>0</strong>, educational
        display risk <strong>5%</strong> (published 0/1 band 4.7%). All seven Yes
        → score <strong>7</strong>, educational display risk <strong>41%</strong>{' '}
        (published 6/7 band 40.9%).
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits and Safety
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Cohort rates from late-1990s ACS trials do not transfer as individual
        forecasts. Marker assays, ECG criteria, and treatment options have
        evolved. Use only as an educational framing tool alongside clinical
        assessment.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source: {SOURCE_LABEL}
      </p>

      <div id="timi-uanstemi-faq" className="mt-8">
        <h2 className="text-lg font-bold tracking-tight text-accent sm:text-xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-4">
          <FAQAccordion faqs={[...TIMI_UANSTEMI_FAQS]} />
        </div>
      </div>
    </article>
  );
}
