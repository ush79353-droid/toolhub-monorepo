import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { COEFFICIENTS, INTERCEPT, MODEL_VERSION } from './calculation';
import { STILLBIRTH_RISK_FAQS } from './content';

export function StillbirthRiskGuideArticle() {
  return (
    <article className="prose prose-slate max-w-none rounded-2xl border border-border bg-white px-5 py-6 sm:px-8 sm:py-8">
      <h2
        id="introduction"
        className="text-xl font-bold tracking-tight text-accent sm:text-2xl"
      >
        Stillbirth Risk Calculator
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Estimate an individualized stillbirth probability from 32 weeks of
        gestation using the published Yerke et al. 2017 US cohort logistic model.
        Educational counseling aid only — not a care plan.
      </p>

      <h2
        id="what-is"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        What This Model Estimates
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Among singleton pregnancies without major fetal anomaly or aneuploidy
        that reach at least 32 weeks, the model returns the calibrated
        probability of stillbirth based on maternal age, race (Black vs
        non-Black), parity, BMI category, smoking, chronic hypertension, and
        pregestational diabetes.
      </p>

      <h2
        id="yerke"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Yerke 2017 Model
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Logistic form: p = 1 / (1 + e<sup>−logit</sup>) with published intercept{' '}
        {INTERCEPT} ({MODEL_VERSION}). This is not an odds-ratio product
        multiplied by an editable baseline rate such as 0.2197%.
      </p>

      <h2
        id="predictors"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Model Predictors
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <li>
          Age bands (≤18: {COEFFICIENTS.ageLe18}; 19–34 reference; 35–39:{' '}
          {COEFFICIENTS.age35to39}; ≥40: {COEFFICIENTS.ageGe40})
        </li>
        <li>Non-Hispanic Black race ({COEFFICIENTS.blackRace})</li>
        <li>Nulliparity ({COEFFICIENTS.nulliparity})</li>
        <li>
          BMI categories (&lt;25 reference; 25–29.9: {COEFFICIENTS.bmi25to29_9};
          30–34.9: {COEFFICIENTS.bmi30to34_9}; 35–39.9:{' '}
          {COEFFICIENTS.bmi35to39_9}; ≥40: {COEFFICIENTS.bmiGe40})
        </li>
        <li>Smoking ({COEFFICIENTS.smoking})</li>
        <li>Chronic hypertension ({COEFFICIENTS.chronicHypertension})</li>
        <li>
          Pregestational diabetes Type 1 or 2 ({COEFFICIENTS.pregestationalDiabetes})
        </li>
      </ul>

      <h2
        id="screenshot"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Screenshot Parity Fields
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        ART, SLE, APS, alcohol, and detailed ethnicity options beyond Black vs
        other appear on the form to match legacy intake layouts. They are not
        applied in this Yerke-calibrated engine and are labeled accordingly in
        results when relevant.
      </p>

      <h2
        id="how-to-use"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        How to Use
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Enter maternal age, height (cm), and pre-pregnancy weight (kg). Answer
        previous pregnancies, ethnicity, comorbidities, and addictions. The
        calculator derives BMI bands for the model and shows probability percent
        and a 1-in-N summary.
      </p>

      <h2
        id="limits"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Limits
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
        Validated on a US population cohort with specific exclusions. Does not
        replace ultrasound, antenatal testing, or clinician judgment. Rare-event
        probabilities are sensitive to model calibration and should be discussed
        in context.
      </p>

      <h2
        id="stillbirth-faq"
        className="mt-8 text-lg font-bold tracking-tight text-accent sm:text-xl"
      >
        Frequently Asked Questions
      </h2>
      <div className="mt-4 not-prose">
        <FAQAccordion items={[...STILLBIRTH_RISK_FAQS]} />
      </div>
    </article>
  );
}